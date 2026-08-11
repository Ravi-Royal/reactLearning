export interface StockSearchResult {
  symbol: string;
  name: string;
  exch: string;
  type: string;
  exchDisp: string;
}

export interface CompanyProfile {
  name: string;
  symbol: string;
  sector: string;
  industry: string;
  description: string;
  website: string;
}

export interface StockFundamentals {
  marketCap: number | null;
  currentPrice: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  peRatio: number | null;
  pbRatio: number | null;
  roe: number | null; // e.g. 0.15 for 15%
  roce: number | null; // e.g. 0.767 for 76.7% (screener.in)
  eps: number | null;
  bookValue: number | null;
  dividendYield: number | null; // e.g. 0.02 for 2%
  debtToEquity: number | null; // e.g. 0.45
  totalDebt: number | null;
  cashReserves: number | null; // total cash
  interestCoverageRatio: number | null; // e.g. 8.5 (screener.in: Operating Profit / Interest)
}

export interface DividendItem {
  date: string; // Ex-date formatted as YYYY-MM-DD
  amount: number;
}

export interface ShareholdingPattern {
  quarter: string;
  promoter: number | null;
  fii: number | null;
  dii: number | null;
  public: number | null;
}

export interface ShareholdingData {
  current: ShareholdingPattern;
  previous: ShareholdingPattern;
  trend: ShareholdingPattern[];
}

/** One fiscal year of P&L numbers (screener.in, standalone, ₹ Cr unless noted). */
export interface AnnualMetric {
  year: string; // e.g. "Mar 2026"
  sales: number | null;
  operatingProfit: number | null;
  opm: number | null; // %
  netProfit: number | null;
  eps: number | null; // ₹
  interest: number | null;
  interestCoverage: number | null; // Operating Profit / Interest
  salesGrowth: number | null; // % YoY
  netProfitGrowth: number | null; // % YoY
  roce: number | null; // % (from screener.in ratios table)
}

/** One quarter of P&L numbers (screener.in, standalone, ₹ Cr). */
export interface QuarterlyResult {
  quarter: string; // e.g. "Jun 2025"
  sales: number | null;
  operatingProfit: number | null;
  opm: number | null; // %
  netProfit: number | null;
  eps: number | null; // ₹
}

/** Latest fiscal year balance sheet snapshot (₹ Cr). */
export interface BalanceSheetSnapshot {
  year: string;
  equityCapital: number | null;
  reserves: number | null;
  borrowings: number | null;
  otherLiabilities: number | null;
  totalLiabilities: number | null;
  fixedAssets: number | null;
  cwip: number | null;
  investments: number | null;
  otherAssets: number | null;
  totalAssets: number | null;
  netWorth: number | null; // equity + reserves
}

/** Latest fiscal year cash flow snapshot (₹ Cr). */
export interface CashFlowSnapshot {
  year: string;
  cfo: number | null; // cash from operating activity
  cfi: number | null; // cash from investing activity
  cff: number | null; // cash from financing activity
  netCashFlow: number | null;
  freeCashFlow: number | null;
}

/** ~1 year of daily closing prices from Yahoo spark (for the hero sparkline). */
export interface PriceHistory {
  closes: number[]; // oldest -> newest
  previousClose: number | null;
}

export type FinancialHealthRating = 'Excellent' | 'Good' | 'Average' | 'Weak';

export interface FinancialScoreResult {
  score: number; // 0 to 100
  rating: FinancialHealthRating;
  reasons: string[];
}

export interface StockDetails {
  symbol: string;
  profile: CompanyProfile;
  fundamentals: StockFundamentals;
  dividends: DividendItem[];
  shareholding: ShareholdingData | null;
  financialScore: FinancialScoreResult;
  /** Fiscal-year P&L trend (screener.in) - null when the feed is unavailable. */
  annuals: AnnualMetric[] | null;
  /** Recent quarterly results (screener.in) - null when unavailable. */
  quarters: QuarterlyResult[] | null;
  /** Latest balance sheet snapshot (screener.in) - null when unavailable. */
  balanceSheet: BalanceSheetSnapshot | null;
  /** Latest cash flow snapshot (screener.in) - null when unavailable. */
  cashFlow: CashFlowSnapshot | null;
  /** ~1y of daily closes (Yahoo spark) for the hero sparkline - null when unavailable. */
  priceHistory: PriceHistory | null;
}

export interface CachedData<T> {
  data: T;
  timestamp: number;
}
