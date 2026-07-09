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
  roce: number | null; // will be null
  eps: number | null;
  bookValue: number | null;
  dividendYield: number | null; // e.g. 0.02 for 2%
  debtToEquity: number | null; // e.g. 0.45
  totalDebt: number | null;
  cashReserves: number | null; // total cash
  interestCoverageRatio: number | null; // will be null
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
}

export interface CachedData<T> {
  data: T;
  timestamp: number;
}
