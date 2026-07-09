import axios from 'axios';
import type {
  StockSearchResult,
  StockDetails,
  CompanyProfile,
  StockFundamentals,
  DividendItem,
  FinancialScoreResult,
  FinancialHealthRating,
} from './types';
import { getCache, setCache } from './cache';

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
 * Helper to fetch a URL using local dev proxy when running locally,
 * or rotating through multiple public CORS proxies when in production.
 */
async function fetchWithProxy<T = unknown>(url: string): Promise<T> {
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocal) {
    let localUrl = url;
    if (url.startsWith('https://query1.finance.yahoo.com')) {
      localUrl = url.replace('https://query1.finance.yahoo.com', '/yahooFinance1');
    } else if (url.startsWith('https://query2.finance.yahoo.com')) {
      localUrl = url.replace('https://query2.finance.yahoo.com', '/yahooFinance2');
    }
    try {
      const res = await axios.get<T>(localUrl);
      if (res.data) {
        return res.data;
      }
    } catch (e) {
      console.warn('Local dev proxy failed or returned error, falling back to public CORS proxies', e);
    }
  }

  // List of public CORS proxies to try
  const proxyBuilders = [
    (targetUrl: string) => `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`,
    (targetUrl: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    (targetUrl: string) => `https://thingproxy.freeboard.io/fetch/${targetUrl}`,
  ];

  let lastError: Error | null = null;
  for (const buildProxyUrl of proxyBuilders) {
    const proxyUrl = buildProxyUrl(url);
    try {
      const res = await axios.get<T>(proxyUrl, { timeout: 8000 });
      if (res.data) {
        return res.data;
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`CORS proxy failed: ${proxyUrl}`, errorMsg);
      lastError = err instanceof Error ? err : new Error(errorMsg);
    }
  }

  throw lastError || new Error('All CORS proxies failed to fetch data');
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

/**
 * Fetch quote summary (assetProfile, defaultKeyStatistics, financialData, summaryDetail)
 */
export async function getFullData(symbol: string): Promise<StockDetails> {
  const normalized = normalizeSymbol(symbol);
  const cacheKey = `stock_details_${normalized}`;

  // Check cache
  const cached = getCache<StockDetails>(cacheKey);
  if (cached) {
    return cached;
  }

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
  let financialScore: FinancialScoreResult;

  if (useFallback && chartMeta) {
    profile = {
      name: chartMeta.longName || chartMeta.shortName || normalized.split('.')[0],
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

    financialScore = calculateFinancialScore(fundamentals, null);
  } else {
    if (!summary) {
      throw new Error('NOT_FOUND');
    }
    profile = adaptCompanyProfile(summary, normalized);
    fundamentals = adaptFundamentals(summary);
    financialScore = calculateFinancialScore(fundamentals, summary);
  }

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
    shareholding: null, // Not available on free APIs
    financialScore,
  };

  // Cache final details
  setCache(cacheKey, finalDetails, 24);

  return finalDetails;
}

/**
 * Adapters
 */
function adaptCompanyProfile(summary: YahooQuoteSummaryResult, symbol: string): CompanyProfile {
  const profile = summary?.assetProfile || {};
  const priceObj = summary?.price || {};
  return {
    name: priceObj.longName || priceObj.shortName || symbol.split('.')[0],
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
