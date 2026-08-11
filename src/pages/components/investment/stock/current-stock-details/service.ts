import axios from 'axios';
import { fetchWithProxy } from '@utils';
import type {
  StockSearchResult,
  StockDetails,
  CompanyProfile,
  StockFundamentals,
  DividendItem,
  FinancialScoreResult,
  FinancialHealthRating,
  PriceHistory,
} from './types';
import { getCache, setCache } from './cache';
import { fetchScreenerEnrichment, type ScreenerEnrichment } from './screener';

/**
 * Bump when the cached StockDetails shape changes so stale localStorage
 * entries from older app versions are ignored and re-fetched with the new
 * fields instead of being served for the full TTL.
 */
const CACHE_SCHEMA_VERSION = 'v2';

/**
 * Helper: Normalize symbol (e.g. TCS -> TCS.NS)
 */
export function normalizeSymbol(symbol: string): string {
  let clean = symbol.trim().toUpperCase();
  if (!clean.includes('.') && clean.length > 0) {
    clean = `${clean}.NS`;
  }
  return clean;
}

interface YahooAutocompleteQuote {
  symbol: string;
  shortname?: string;
  longname?: string;
  exchange: string;
  quoteType: string;
  exchDisp?: string;
}

interface YahooAutocompleteResponse {
  quotes?: YahooAutocompleteQuote[];
}

interface YahooDividendRaw {
  date: number;
  amount: number;
}

interface YahooChartResultItem {
  meta?: {
    symbol?: string;
    regularMarketPrice?: number;
    chartPreviousClose?: number;
    fiftyTwoWeekHigh?: number;
    fiftyTwoWeekLow?: number;
    longName?: string;
    shortName?: string;
  };
  events?: {
    dividends?: Record<string, YahooDividendRaw>;
  };
}

interface YahooChartResponse {
  chart?: {
    result?: YahooChartResultItem[];
  };
}

interface YahooQuoteSummaryResult {
  assetProfile?: {
    sector?: string;
    industry?: string;
    longBusinessSummary?: string;
    website?: string;
  };
  price?: {
    longName?: string;
    shortName?: string;
  };
  defaultKeyStatistics?: {
    returnOnEquity?: { raw?: number };
    trailingEps?: { raw?: number };
    bookValue?: { raw?: number };
    earningsQuarterlyGrowth?: { raw?: number };
    dividendYield?: { raw?: number };
    priceToBook?: { raw?: number };
  };
  financialData?: {
    returnOnEquity?: { raw?: number };
    debtToEquity?: { raw?: number };
    totalDebt?: { raw?: number };
    totalCash?: { raw?: number };
    revenueGrowth?: { raw?: number };
    currentPrice?: { raw?: number };
  };
  summaryDetail?: {
    marketCap?: { raw?: number };
    regularMarketPrice?: { raw?: number };
    fiftyTwoWeekHigh?: { raw?: number };
    fiftyTwoWeekLow?: { raw?: number };
    trailingPE?: { raw?: number };
    dividendYield?: { raw?: number };
    trailingAnnualDividendYield?: { raw?: number };
  };
}

interface YahooQuoteSummaryResponse {
  quoteSummary?: {
    result?: YahooQuoteSummaryResult[];
  };
}

/**
 * Search stocks from Yahoo Finance autocomplete
 */
export async function searchStocks(query: string): Promise<StockSearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
    query,
  )}&quotesCount=10&newsCount=0&enableFuzzyQuery=false`;

  try {
    const response = await fetchWithProxy<YahooAutocompleteResponse>(url);
    if (!response || !response.quotes) {
      return [];
    }

    return response.quotes
      .filter((q) => q.quoteType === 'EQUITY')
      .map((q) => ({
        symbol: q.symbol,
        name: q.shortname || q.longname || q.symbol,
        exch: q.exchange,
        type: q.quoteType,
        exchDisp: q.exchDisp || q.exchange,
      }));
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
}

/**
 * Fetch dividend events from Yahoo Finance Chart
 */
export async function getDividends(symbol: string): Promise<DividendItem[]> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?events=div&interval=1d&range=10y`;

  try {
    const response = await fetchWithProxy<YahooChartResponse>(url);
    const dividendsObj = response?.chart?.result?.[0]?.events?.dividends;
    if (!dividendsObj) {
      return [];
    }

    const items: DividendItem[] = Object.values(dividendsObj).map((div) => {
      const date = new Date(div.date * 1000);
      return {
        date: date.toISOString().split('T')[0] || '',
        amount: Number(div.amount),
      };
    });

    return items.sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error('Error fetching dividends:', error);
    return [];
  }
}

interface SparkSeriesData {
  close?: (number | null)[];
  previousClose?: number;
  chartPreviousClose?: number;
}

/**
 * ~1 year of daily closes + yesterday's close for the hero, via the Yahoo
 * spark endpoint (single symbol, no crumb needed).
 *
 * Two small calls: range=1y&interval=1d supplies the sparkline closes, while
 * range=1d supplies the true previous close (chartPreviousClose for a 1y
 * window is the anchor ~1 year ago, not yesterday).
 */
export async function getPriceHistory(symbol: string): Promise<PriceHistory | null> {
  const normalized = normalizeSymbol(symbol);
  const sparkUrl = (range: string, interval: string) =>
    `https://query1.finance.yahoo.com/v8/finance/spark?symbols=${encodeURIComponent(
      normalized,
    )}&range=${range}&interval=${interval}&indicators=close`;

  try {
    const [yearly, daily] = await Promise.all([
      fetchWithProxy<Record<string, SparkSeriesData>>(sparkUrl('1y', '1d')),
      fetchWithProxy<Record<string, SparkSeriesData>>(sparkUrl('1d', '5m')),
    ]);
    const closes = (yearly?.[normalized]?.close ?? []).filter(
      (close): close is number => close !== null && close !== undefined,
    );
    if (closes.length === 0) {
      return null;
    }
    const dailyData = daily?.[normalized];
    return {
      closes,
      previousClose: dailyData?.chartPreviousClose ?? dailyData?.previousClose ?? null,
    };
  } catch (error) {
    console.warn(`Price history fetch failed for ${normalized}:`, error);
    return null;
  }
}

/**
 * Fetch quote summary (assetProfile, defaultKeyStatistics, financialData, summaryDetail)
 */
export async function getFullData(symbol: string): Promise<StockDetails> {
  const normalized = normalizeSymbol(symbol);
  const cacheKey = `stock_details_${CACHE_SCHEMA_VERSION}_${normalized}`;

  // One-time cleanup: drop pre-v2 cache entries (old StockDetails shape) so
  // they can never be mistaken for fresh enriched data.
  try {
    const prefix = `stock_details_${CACHE_SCHEMA_VERSION}_`;
    const stale: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('stock_details_') && !key.startsWith(prefix)) {
        stale.push(key);
      }
    }
    stale.forEach((key) => localStorage.removeItem(key));
  } catch {
    // localStorage may be unavailable (private mode) - not fatal.
  }

  // Check cache
  const cached = getCache<StockDetails>(cacheKey);
  if (cached) {
    return cached;
  }

  // Kick off the screener.in enrichment and the price history spark call in
  // parallel with the Yahoo flow so their latency overlaps. Screener fills
  // fields Yahoo's free tier lacks: ROCE, interest coverage, shareholding,
  // annual/quarterly results, balance sheet and cash flow.
  const screenerPromise = fetchScreenerEnrichment(normalized.split('.')[0] || normalized).catch(() => null);
  const priceHistoryPromise = getPriceHistory(normalized).catch(() => null);

  const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${normalized}?modules=assetProfile,defaultKeyStatistics,financialData,summaryDetail`;

  let summary: YahooQuoteSummaryResult | null = null;
  let useFallback = false;
  let chartMeta: YahooChartResultItem['meta'] | null = null;

  try {
    const response = await fetchWithProxy<YahooQuoteSummaryResponse>(url);
    summary = response?.quoteSummary?.result?.[0] || null;
    if (!summary) {
      throw new Error('NOT_FOUND');
    }
  } catch (error: unknown) {
    console.warn('Error fetching stock summary quoteSummary, trying fallback chart API:', error);
    // Try to get chart details as a fallback
    try {
      const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${normalized}?interval=1d&range=1d`;
      const chartResponse = await fetchWithProxy<YahooChartResponse>(chartUrl);
      chartMeta = chartResponse?.chart?.result?.[0]?.meta || null;
      if (!chartMeta) {
        throw new Error('NOT_FOUND');
      }
      useFallback = true;
    } catch (chartErr: unknown) {
      console.error('Fallback chart fetch failed too:', chartErr);
      const isRateLimit =
        (axios.isAxiosError(error) && error.response?.status === 429) ||
        (axios.isAxiosError(chartErr) && chartErr.response?.status === 429);
      if (isRateLimit) {
        throw new Error('RATE_LIMIT');
      }
      const isNotFound =
        (error instanceof Error && error.message === 'NOT_FOUND') ||
        (chartErr instanceof Error && chartErr.message === 'NOT_FOUND');
      if (isNotFound) {
        throw new Error('NOT_FOUND');
      }
      throw new Error('API_ERROR');
    }
  }

  let profile: CompanyProfile;
  let fundamentals: StockFundamentals;

  if (useFallback && chartMeta) {
    profile = {
      name: chartMeta.longName || chartMeta.shortName || normalized.split('.')[0] || normalized,
      symbol: normalized,
      sector: 'Unavailable on Free Tier',
      industry: 'Unavailable on Free Tier',
      description:
        'Detailed company profile and financial statements are restricted on this free API endpoint. Basic real-time pricing and dividend history trackers remain functional.',
      website: '',
    };

    fundamentals = {
      marketCap: null,
      currentPrice: chartMeta.regularMarketPrice ?? chartMeta.chartPreviousClose ?? null,
      fiftyTwoWeekHigh: chartMeta.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow: chartMeta.fiftyTwoWeekLow ?? null,
      peRatio: null,
      pbRatio: null,
      roe: null,
      roce: null,
      eps: null,
      bookValue: null,
      dividendYield: null,
      debtToEquity: null,
      totalDebt: null,
      cashReserves: null,
      interestCoverageRatio: null,
    };
  } else {
    if (!summary) {
      throw new Error('NOT_FOUND');
    }
    profile = adaptCompanyProfile(summary, normalized);
    fundamentals = adaptFundamentals(summary);
  }

  // Merge screener.in enrichment on top of the Yahoo data (screener wins for
  // the fields it covers - it is a more reliable source for Indian equities).
  const screener = await screenerPromise;
  if (screener) {
    applyScreenerEnrichment(profile, fundamentals, screener);
  }

  // Score after the enrichment merge so real ROE/leverage numbers (e.g. from
  // screener.in) feed the algorithm instead of "data not available" defaults.
  const financialScore = calculateFinancialScore(fundamentals, summary);

  // Fetch dividends
  const dividends = await getDividends(normalized);

  // If in fallback mode, compute the dividend yield dynamically based on the last 1 year of actual payouts
  if (useFallback && chartMeta) {
    const currentPrice = chartMeta.regularMarketPrice ?? chartMeta.chartPreviousClose ?? null;
    if (currentPrice && currentPrice > 0 && dividends.length > 0) {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const recentDividends = dividends.filter((d) => {
        const dDate = new Date(d.date);
        return !isNaN(dDate.getTime()) && dDate >= oneYearAgo;
      });
      const annualDividend = recentDividends.reduce((sum, d) => sum + d.amount, 0);
      fundamentals.dividendYield = annualDividend / currentPrice;
    }
  }

  const finalDetails: StockDetails = {
    symbol: normalized,
    profile,
    fundamentals,
    dividends,
    shareholding: screener?.shareholding ?? null,
    financialScore,
    annuals: screener?.annuals ?? null,
    quarters: screener?.quarters ?? null,
    balanceSheet: screener?.balanceSheet ?? null,
    cashFlow: screener?.cashFlow ?? null,
    priceHistory: await priceHistoryPromise,
  };

  // Cache final details. When the screener.in enrichment failed (rate-limited
  // or the feed was down) the result is missing the deep sections - cache it
  // briefly so the page retries the screener part soon instead of serving a
  // half-empty report for the full 24h.
  const enriched =
    screener !== null && (Boolean(screener.annuals) || Boolean(screener.balanceSheet) || Boolean(screener.cashFlow));
  setCache(cacheKey, finalDetails, enriched ? 24 : 0.5);

  return finalDetails;
}

/**
 * Merge screener.in enrichment into the Yahoo-derived profile/fundamentals.
 * Only non-null enrichment fields override the existing values.
 */
function applyScreenerEnrichment(
  profile: CompanyProfile,
  fundamentals: StockFundamentals,
  screener: ScreenerEnrichment,
): void {
  if (screener.marketCap !== undefined) {
    fundamentals.marketCap = screener.marketCap;
  }
  if (screener.currentPrice !== undefined) {
    fundamentals.currentPrice = screener.currentPrice;
  }
  if (screener.fiftyTwoWeekHigh !== undefined) {
    fundamentals.fiftyTwoWeekHigh = screener.fiftyTwoWeekHigh;
  }
  if (screener.fiftyTwoWeekLow !== undefined) {
    fundamentals.fiftyTwoWeekLow = screener.fiftyTwoWeekLow;
  }
  if (screener.peRatio !== undefined) {
    fundamentals.peRatio = screener.peRatio;
  }
  if (screener.pbRatio !== undefined) {
    fundamentals.pbRatio = screener.pbRatio;
  }
  if (screener.bookValue !== undefined) {
    fundamentals.bookValue = screener.bookValue;
  }
  if (screener.dividendYield !== undefined) {
    fundamentals.dividendYield = screener.dividendYield;
  }
  if (screener.roce !== undefined) {
    fundamentals.roce = screener.roce;
  }
  if (screener.roe !== undefined) {
    fundamentals.roe = screener.roe;
  }
  if (screener.debtToEquity !== undefined) {
    fundamentals.debtToEquity = screener.debtToEquity;
  }
  if (screener.eps !== undefined) {
    fundamentals.eps = screener.eps;
  }
  if (screener.interestCoverageRatio !== undefined) {
    fundamentals.interestCoverageRatio = screener.interestCoverageRatio;
  }

  if (screener.sector) {
    profile.sector = screener.sector;
  }
  if (screener.industry) {
    profile.industry = screener.industry;
  }
  if (screener.website) {
    profile.website = screener.website;
  }
  if (screener.description) {
    profile.description = screener.description;
  }
}

/**
 * Adapters
 */
function adaptCompanyProfile(summary: YahooQuoteSummaryResult, symbol: string): CompanyProfile {
  const profile = summary?.assetProfile || {};
  const priceObj = summary?.price || {};
  return {
    name: priceObj.longName || priceObj.shortName || symbol.split('.')[0] || symbol,
    symbol: symbol,
    sector: profile.sector || 'N/A',
    industry: profile.industry || 'N/A',
    description: profile.longBusinessSummary || 'No company summary available.',
    website: profile.website || '',
  };
}

function adaptFundamentals(summary: YahooQuoteSummaryResult): StockFundamentals {
  const stats = summary?.defaultKeyStatistics || {};
  const fin = summary?.financialData || {};
  const detail = summary?.summaryDetail || {};

  const rawRoe = stats.returnOnEquity?.raw ?? fin.returnOnEquity?.raw ?? null;
  const rawDivYield =
    detail.dividendYield?.raw ?? stats.dividendYield?.raw ?? detail.trailingAnnualDividendYield?.raw ?? null;

  let rawDebtToEquity = fin.debtToEquity?.raw ?? null;
  if (rawDebtToEquity !== null) {
    rawDebtToEquity = rawDebtToEquity / 100;
  }

  return {
    marketCap: detail.marketCap?.raw ?? null,
    currentPrice: fin.currentPrice?.raw ?? detail.regularMarketPrice?.raw ?? null,
    fiftyTwoWeekHigh: detail.fiftyTwoWeekHigh?.raw ?? null,
    fiftyTwoWeekLow: detail.fiftyTwoWeekLow?.raw ?? null,
    peRatio: detail.trailingPE?.raw ?? null,
    pbRatio: stats.priceToBook?.raw ?? null,
    roe: rawRoe,
    roce: null,
    eps: stats.trailingEps?.raw ?? null,
    bookValue: stats.bookValue?.raw ?? null,
    dividendYield: rawDivYield,
    debtToEquity: rawDebtToEquity,
    totalDebt: fin.totalDebt?.raw ?? null,
    cashReserves: fin.totalCash?.raw ?? null,
    interestCoverageRatio: null,
  };
}

/**
 * Financial score algorithm
 */
function calculateFinancialScore(
  fundamentals: StockFundamentals,
  summary: YahooQuoteSummaryResult | null,
): FinancialScoreResult {
  let score = 0;
  const reasons: string[] = [];

  const stats = summary?.defaultKeyStatistics || {};
  const fin = summary?.financialData || {};

  // 1. ROE Score
  const roe = fundamentals.roe;
  if (roe !== null) {
    const roePct = roe * 100;
    if (roePct > 20) {
      score += 25;
      reasons.push('High Return on Equity (ROE > 20%) shows exceptional profitability.');
    } else if (roePct >= 15) {
      score += 20;
      reasons.push('Healthy Return on Equity (ROE 15-20%) shows solid returns.');
    } else if (roePct >= 10) {
      score += 15;
      reasons.push('Moderate Return on Equity (ROE 10-15%).');
    } else {
      score += 5;
      reasons.push('Low Return on Equity (ROE < 10%) suggests suboptimal asset utilization.');
    }
  } else {
    score += 12;
    reasons.push('ROE data not available.');
  }

  // 2. ROCE Fallback (using ROE)
  if (roe !== null) {
    const roePct = roe * 100;
    if (roePct > 15) {
      score += 20;
      reasons.push('Excellent estimated capital returns (using ROE fallback > 15%).');
    } else if (roePct >= 10) {
      score += 15;
      reasons.push('Adequate estimated capital returns (using ROE fallback).');
    } else {
      score += 10;
      reasons.push('Weak estimated capital returns (using ROE fallback).');
    }
  } else {
    score += 10;
    reasons.push('ROCE / Capital return data not available.');
  }

  // 3. Debt to Equity Score
  const de = fundamentals.debtToEquity;
  if (de !== null) {
    if (de < 0.5) {
      score += 25;
      reasons.push(`Low leverage (Debt/Equity of ${de.toFixed(2)}) indicates very low solvency risk.`);
    } else if (de <= 1.0) {
      score += 15;
      reasons.push(`Manageable leverage (Debt/Equity of ${de.toFixed(2)}).`);
    } else if (de <= 1.5) {
      score += 5;
      reasons.push(`High leverage (Debt/Equity of ${de.toFixed(2)}) increases financial risk.`);
    } else {
      reasons.push(`Very high leverage (Debt/Equity of ${de.toFixed(2)}) is a potential concern.`);
    }
  } else {
    score += 15;
    reasons.push('Debt/Equity ratio not available.');
  }

  // 4. Sales Growth
  const revGrowth = fin.revenueGrowth?.raw ?? null;
  if (revGrowth !== null) {
    const revGrowthPct = revGrowth * 100;
    if (revGrowthPct > 15) {
      score += 15;
      reasons.push(`Robust quarterly sales growth of ${revGrowthPct.toFixed(1)}% YoY.`);
    } else if (revGrowthPct >= 5) {
      score += 10;
      reasons.push(`Steady quarterly sales growth of ${revGrowthPct.toFixed(1)}% YoY.`);
    } else if (revGrowthPct >= 0) {
      score += 5;
      reasons.push(`Flat quarterly sales growth of ${revGrowthPct.toFixed(1)}% YoY.`);
    } else {
      reasons.push(`Declining sales growth of ${revGrowthPct.toFixed(1)}% YoY.`);
    }
  } else {
    score += 8;
    reasons.push('Revenue growth data not available.');
  }

  // 5. Profit Growth
  const earnGrowth = stats.earningsQuarterlyGrowth?.raw ?? null;
  if (earnGrowth !== null) {
    const earnGrowthPct = earnGrowth * 100;
    if (earnGrowthPct > 15) {
      score += 15;
      reasons.push(`Outstanding earnings growth of ${earnGrowthPct.toFixed(1)}% YoY.`);
    } else if (earnGrowthPct >= 5) {
      score += 10;
      reasons.push(`Stable earnings growth of ${earnGrowthPct.toFixed(1)}% YoY.`);
    } else if (earnGrowthPct >= 0) {
      score += 5;
      reasons.push(`Modest earnings growth of ${earnGrowthPct.toFixed(1)}% YoY.`);
    } else {
      reasons.push(`Earnings contraction of ${earnGrowthPct.toFixed(1)}% YoY.`);
    }
  } else {
    score += 8;
    reasons.push('Earnings growth data not available.');
  }

  let rating: FinancialHealthRating = 'Average';
  if (score >= 80) {
    rating = 'Excellent';
  } else if (score >= 60) {
    rating = 'Good';
  } else if (score >= 40) {
    rating = 'Average';
  } else {
    rating = 'Weak';
  }

  return {
    score,
    rating,
    reasons,
  };
}
