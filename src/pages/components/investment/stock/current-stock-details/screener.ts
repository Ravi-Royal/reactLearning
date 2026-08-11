import { fetchWithProxy } from '@utils';
import type { AnnualMetric, BalanceSheetSnapshot, CashFlowSnapshot, QuarterlyResult, ShareholdingData } from './types';

/**
 * Enrichment data extracted from a screener.in company page.
 *
 * screener.in is a free, key-less source of reliable Indian-stock
 * fundamentals (ROCE, ROE, interest coverage, promoter/FII/DII holdings)
 * that Yahoo Finance's free tier does not expose. Values are normalized to
 * the same units the rest of the app uses:
 *   - marketCap in raw rupees (existing formatters divide by 1e7 -> Cr)
 *   - roe / roce / dividendYield as fractions (0.652 == 65.2%)
 *   - debtToEquity as a plain ratio
 *   - prices / book value / eps in rupees
 */
export interface ScreenerEnrichment {
  marketCap?: number;
  currentPrice?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  peRatio?: number;
  pbRatio?: number;
  bookValue?: number;
  dividendYield?: number;
  roce?: number;
  roe?: number;
  debtToEquity?: number;
  eps?: number;
  interestCoverageRatio?: number;
  sector?: string;
  industry?: string;
  website?: string;
  description?: string;
  shareholding?: ShareholdingData;
  /** Fiscal-year P&L trend with YoY growth + ROCE (oldest -> newest). */
  annuals?: AnnualMetric[];
  /** Recent quarterly results, oldest -> newest. */
  quarters?: QuarterlyResult[];
  /** Latest fiscal-year balance sheet snapshot. */
  balanceSheet?: BalanceSheetSnapshot;
  /** Latest fiscal-year cash flow snapshot. */
  cashFlow?: CashFlowSnapshot;
}

/** Parse "8,82,886" | "72.30%" | "2,440" | "▲ +0.11" into a number (or null). */
function parseNumber(text: string | null | undefined): number | null {
  if (!text) {
    return null;
  }
  const cleaned = text.replace(/[^0-9.-]/g, '');
  if (!cleaned) {
    return null;
  }
  const value = parseFloat(cleaned);
  return Number.isFinite(value) ? value : null;
}

/** YoY % change between two values (null when the base is missing or zero). */
function growthPercent(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous === 0) {
    return null;
  }
  return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10;
}

function cleanText(text: string | null | undefined): string {
  return (text || '').replace(/\s+/g, ' ').trim();
}

/**
 * Fetch and parse a screener.in company page.
 *
 * Any failure (rate limit, proxy outage, unknown symbol) returns null so the
 * caller keeps whatever Yahoo data it already has - enrichment never blocks
 * the page from rendering.
 */
export async function fetchScreenerEnrichment(symbol: string): Promise<ScreenerEnrichment | null> {
  const clean = (symbol || '').trim().toUpperCase();
  if (!clean) {
    return null;
  }

  const url = `https://www.screener.in/company/${encodeURIComponent(clean)}/`;

  let html: string;
  try {
    html = await fetchWithProxy<string>(url);
  } catch (error) {
    console.warn(`screener.in fetch failed for ${clean}:`, error);
    return null;
  }

  try {
    return parseScreenerPage(html);
  } catch (error) {
    console.warn(`screener.in parse failed for ${clean}:`, error);
    return null;
  }
}

function parseScreenerPage(html: string): ScreenerEnrichment | null {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const enrichment: ScreenerEnrichment = {};

  // --- Top ratios block (#top-ratios): P/E, Market Cap, ROCE, ROE, D/E etc. ---
  const ratios = new Map<string, number[]>();
  doc
    .getElementById('top-ratios')
    ?.querySelectorAll('li')
    .forEach((li) => {
      const name = cleanText(li.querySelector('.name')?.textContent).toLowerCase();
      const numbers = [...li.querySelectorAll('.number')].map((el) => parseNumber(el.textContent));
      if (!name || numbers.length === 0 || numbers.some((n) => n === null)) {
        return;
      }
      ratios.set(name, numbers as number[]);
    });

  const firstOf = (name: string): number | undefined => ratios.get(name)?.[0];

  const marketCapCr = firstOf('market cap');
  if (marketCapCr !== undefined) {
    enrichment.marketCap = marketCapCr * 10_000_000; // Cr -> raw rupees
  }
  const currentPrice = firstOf('current price');
  if (currentPrice !== undefined) {
    enrichment.currentPrice = currentPrice;
  }
  const highLow = ratios.get('high / low') || ratios.get('high/low');
  if (highLow && highLow.length >= 2) {
    enrichment.fiftyTwoWeekHigh = highLow[0];
    enrichment.fiftyTwoWeekLow = highLow[1];
  }
  const peRatio = firstOf('stock p/e');
  if (peRatio !== undefined) {
    enrichment.peRatio = peRatio;
  }
  const bookValue = firstOf('book value');
  if (bookValue !== undefined) {
    enrichment.bookValue = bookValue;
    if (currentPrice !== undefined && currentPrice > 0) {
      enrichment.pbRatio = Math.round((currentPrice / bookValue) * 100) / 100;
    }
  }
  const dividendYield = firstOf('dividend yield');
  if (dividendYield !== undefined) {
    enrichment.dividendYield = dividendYield / 100; // % -> fraction
  }
  const roce = firstOf('roce');
  if (roce !== undefined) {
    enrichment.roce = roce / 100; // % -> fraction
  }
  const roe = firstOf('roe');
  if (roe !== undefined) {
    enrichment.roe = roe / 100; // % -> fraction
  }
  const debtToEquity = firstOf('debt to equity');
  if (debtToEquity !== undefined) {
    enrichment.debtToEquity = debtToEquity;
  }

  // --- Sector & industry from the header (link with title="Sector") ---
  for (const p of doc.querySelectorAll('p.sub')) {
    const sectorLink = p.querySelector('a[title="Sector"]');
    if (!sectorLink) {
      continue;
    }
    enrichment.sector = cleanText(sectorLink.textContent);
    const links = p.querySelectorAll('a');
    if (links.length > 0) {
      enrichment.industry = cleanText(links[links.length - 1].textContent);
    }
    break;
  }

  // --- Website (prefer the explicit "Website" link, else the first external link) ---
  const websiteAnchor = [...doc.querySelectorAll('a')].find((a) => cleanText(a.textContent) === 'Website');
  const website =
    websiteAnchor?.getAttribute('href') || doc.querySelector('a[href^="http"]')?.getAttribute('href') || '';
  if (website) {
    enrichment.website = website;
  }

  // --- Description (meta tag, falling back to the #about paragraph) ---
  const description =
    doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
    cleanText(doc.getElementById('about')?.querySelector('p')?.textContent);
  if (description) {
    enrichment.description = description;
  }

  // --- Shareholding pattern (#quarterly-shp): quarters x (Promoter/FII/DII/Public) ---
  const shpTable = doc.getElementById('quarterly-shp')?.querySelector('table');
  if (shpTable) {
    const quarters = [...shpTable.querySelectorAll('thead th')].map((th) => cleanText(th.textContent)).filter(Boolean);
    const rows = new Map<string, (number | null)[]>();
    shpTable.querySelectorAll('tbody tr').forEach((tr) => {
      const label = cleanText(tr.querySelector('td.text')?.textContent);
      if (!label) {
        return;
      }
      const cells = [...tr.querySelectorAll('td')].slice(1).map((td) => parseNumber(td.textContent));
      rows.set(label, cells);
    });

    const pick = (prefix: string, quarterIndex: number): number | null => {
      for (const [label, cells] of rows) {
        if (label.toLowerCase().startsWith(prefix)) {
          return cells[quarterIndex] ?? null;
        }
      }
      return null;
    };

    const trend = quarters.map((quarter, index) => ({
      quarter,
      promoter: pick('promoter', index),
      fii: pick('fii', index),
      dii: pick('dii', index),
      public: pick('public', index),
    }));

    const filled = trend.filter(
      (row) => row.promoter !== null || row.fii !== null || row.dii !== null || row.public !== null,
    );
    if (filled.length > 0) {
      enrichment.shareholding = {
        current: filled[filled.length - 1],
        previous: filled[filled.length - 2] ?? filled[filled.length - 1],
        trend: filled,
      };
    }
  }

  // --- Annual P&L (#profit-loss): per-year financials, growth, interest coverage ---
  const plTable = doc.getElementById('profit-loss')?.querySelector('table');
  if (plTable) {
    const plHeaders = [...plTable.querySelectorAll('thead th')].map((th) => cleanText(th.textContent)).filter(Boolean);
    const plRows = new Map<string, (number | null)[]>();
    plTable.querySelectorAll('tbody tr').forEach((tr) => {
      const label = cleanText(tr.querySelector('td.text')?.textContent);
      if (!label) {
        return;
      }
      const cells = [...tr.querySelectorAll('td')].slice(1).map((td) => parseNumber(td.textContent));
      plRows.set(label, cells);
    });

    const rowFor = (prefix: string): (number | null)[] | null => {
      for (const [label, cells] of plRows) {
        if (label.startsWith(prefix)) {
          return cells;
        }
      }
      return null;
    };

    const sales = rowFor('Sales');
    const operatingProfit = rowFor('Operating Profit');
    const opm = rowFor('OPM %');
    const interest = rowFor('Interest');
    const netProfit = rowFor('Net Profit');
    const epsRow = rowFor('EPS');

    // Headers include a trailing "TTM" column - keep only full fiscal years.
    const fiscalYears = plHeaders.filter((year) => year !== 'TTM');
    const annuals: AnnualMetric[] = fiscalYears.map((year, index) => {
      const salesValue = sales?.[index] ?? null;
      const netProfitValue = netProfit?.[index] ?? null;
      const previousSales = index > 0 ? (sales?.[index - 1] ?? null) : null;
      const previousProfit = index > 0 ? (netProfit?.[index - 1] ?? null) : null;
      const interestValue = interest?.[index] ?? null;
      const operatingValue = operatingProfit?.[index] ?? null;
      const yearCoverage =
        operatingValue !== null && interestValue !== null && interestValue > 0
          ? Math.round((operatingValue / interestValue) * 10) / 10
          : null;
      return {
        year,
        sales: salesValue,
        operatingProfit: operatingValue,
        opm: opm?.[index] ?? null,
        netProfit: netProfitValue,
        eps: epsRow?.[index] ?? null,
        interest: interestValue,
        interestCoverage: yearCoverage,
        salesGrowth: growthPercent(salesValue, previousSales),
        netProfitGrowth: growthPercent(netProfitValue, previousProfit),
        roce: null, // filled from the #ratios table below
      };
    });

    // Attach ROCE % per year from the #ratios table (same year headers).
    const ratiosTable = doc.getElementById('ratios')?.querySelector('table');
    if (ratiosTable) {
      const ratiosHeaders = [...ratiosTable.querySelectorAll('thead th')]
        .map((th) => cleanText(th.textContent))
        .filter(Boolean);
      let roceRow: (number | null)[] | null = null;
      ratiosTable.querySelectorAll('tbody tr').forEach((tr) => {
        const label = cleanText(tr.querySelector('td.text')?.textContent);
        if (label === 'ROCE %') {
          roceRow = [...tr.querySelectorAll('td')].slice(1).map((td) => parseNumber(td.textContent));
        }
      });
      if (roceRow) {
        annuals.forEach((metric) => {
          const ratiosIndex = ratiosHeaders.indexOf(metric.year);
          if (ratiosIndex >= 0) {
            metric.roce = roceRow?.[ratiosIndex] ?? null;
          }
        });
      }
    }

    const latest = annuals[annuals.length - 1];
    if (latest) {
      enrichment.interestCoverageRatio = latest.interestCoverage;
      if (latest.eps !== null) {
        enrichment.eps = latest.eps;
      }
    }
    if (annuals.length > 0) {
      enrichment.annuals = annuals;
    }
  }

  // --- Quarterly results (#quarters): last 12 quarters of Sales / OPM / Net Profit / EPS ---
  const quartersTable = doc.getElementById('quarters')?.querySelector('table');
  if (quartersTable) {
    const quarterHeaders = [...quartersTable.querySelectorAll('thead th')]
      .map((th) => cleanText(th.textContent))
      .filter(Boolean);
    const qRows = new Map<string, (number | null)[]>();
    quartersTable.querySelectorAll('tbody tr').forEach((tr) => {
      const label = cleanText(tr.querySelector('td.text')?.textContent);
      if (!label) {
        return;
      }
      const cells = [...tr.querySelectorAll('td')].slice(1).map((td) => parseNumber(td.textContent));
      qRows.set(label, cells);
    });
    const qRowFor = (prefix: string): (number | null)[] | null => {
      for (const [label, cells] of qRows) {
        if (label.startsWith(prefix)) {
          return cells;
        }
      }
      return null;
    };
    const qSales = qRowFor('Sales');
    const qOp = qRowFor('Operating Profit');
    const qOpm = qRowFor('OPM %');
    const qNet = qRowFor('Net Profit');
    const qEps = qRowFor('EPS');
    const quarters: QuarterlyResult[] = quarterHeaders.map((quarter, index) => ({
      quarter,
      sales: qSales?.[index] ?? null,
      operatingProfit: qOp?.[index] ?? null,
      opm: qOpm?.[index] ?? null,
      netProfit: qNet?.[index] ?? null,
      eps: qEps?.[index] ?? null,
    }));
    const filledQuarters = quarters.filter((q) => q.sales !== null || q.netProfit !== null);
    if (filledQuarters.length > 0) {
      enrichment.quarters = filledQuarters;
    }
  }

  // --- Balance sheet (#balance-sheet): latest fiscal year snapshot ---
  const bsTable = doc.getElementById('balance-sheet')?.querySelector('table');
  if (bsTable) {
    const bsHeaders = [...bsTable.querySelectorAll('thead th')].map((th) => cleanText(th.textContent)).filter(Boolean);
    const bs: Record<string, number | null> = {};
    bsTable.querySelectorAll('tbody tr').forEach((tr) => {
      const label = cleanText(tr.querySelector('td.text')?.textContent);
      if (!label) {
        return;
      }
      const cells = [...tr.querySelectorAll('td')].slice(1).map((td) => parseNumber(td.textContent));
      const latestValue = cells[cells.length - 1] ?? null;
      if (label.startsWith('Equity Capital')) {
        bs.equityCapital = latestValue;
      } else if (label === 'Reserves') {
        bs.reserves = latestValue;
      } else if (label.startsWith('Borrowings')) {
        bs.borrowings = latestValue;
      } else if (label.startsWith('Other Liabilities')) {
        bs.otherLiabilities = latestValue;
      } else if (label === 'Total Liabilities') {
        bs.totalLiabilities = latestValue;
      } else if (label.startsWith('Fixed Assets')) {
        bs.fixedAssets = latestValue;
      } else if (label === 'CWIP') {
        bs.cwip = latestValue;
      } else if (label === 'Investments') {
        bs.investments = latestValue;
      } else if (label.startsWith('Other Assets')) {
        bs.otherAssets = latestValue;
      } else if (label === 'Total Assets') {
        bs.totalAssets = latestValue;
      }
    });
    const equity = bs.equityCapital ?? null;
    const reserves = bs.reserves ?? null;
    const balanceSheet: BalanceSheetSnapshot = {
      year: bsHeaders[bsHeaders.length - 1] || 'Latest',
      equityCapital: equity,
      reserves,
      borrowings: bs.borrowings ?? null,
      otherLiabilities: bs.otherLiabilities ?? null,
      totalLiabilities: bs.totalLiabilities ?? null,
      fixedAssets: bs.fixedAssets ?? null,
      cwip: bs.cwip ?? null,
      investments: bs.investments ?? null,
      otherAssets: bs.otherAssets ?? null,
      totalAssets: bs.totalAssets ?? null,
      netWorth: equity !== null && reserves !== null ? equity + reserves : null,
    };
    if (balanceSheet.totalAssets !== null || balanceSheet.borrowings !== null) {
      enrichment.balanceSheet = balanceSheet;
    }
  }

  // --- Cash flow (#cash-flow): latest fiscal year snapshot ---
  const cfTable = doc.getElementById('cash-flow')?.querySelector('table');
  if (cfTable) {
    const cfHeaders = [...cfTable.querySelectorAll('thead th')].map((th) => cleanText(th.textContent)).filter(Boolean);
    const cf: Record<string, number | null> = {};
    cfTable.querySelectorAll('tbody tr').forEach((tr) => {
      const label = cleanText(tr.querySelector('td.text')?.textContent);
      if (!label) {
        return;
      }
      const cells = [...tr.querySelectorAll('td')].slice(1).map((td) => parseNumber(td.textContent));
      const latestValue = cells[cells.length - 1] ?? null;
      if (label.startsWith('Cash from Operating')) {
        cf.cfo = latestValue;
      } else if (label.startsWith('Cash from Investing')) {
        cf.cfi = latestValue;
      } else if (label.startsWith('Cash from Financing')) {
        cf.cff = latestValue;
      } else if (label === 'Net Cash Flow') {
        cf.netCashFlow = latestValue;
      } else if (label === 'Free Cash Flow') {
        cf.freeCashFlow = latestValue;
      }
    });
    const cashFlow: CashFlowSnapshot = {
      year: cfHeaders[cfHeaders.length - 1] || 'Latest',
      cfo: cf.cfo ?? null,
      cfi: cf.cfi ?? null,
      cff: cf.cff ?? null,
      netCashFlow: cf.netCashFlow ?? null,
      freeCashFlow: cf.freeCashFlow ?? null,
    };
    if (cashFlow.cfo !== null || cashFlow.freeCashFlow !== null) {
      enrichment.cashFlow = cashFlow;
    }
  }

  return Object.keys(enrichment).length > 0 ? enrichment : null;
}
