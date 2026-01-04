export interface CalculationResult {
  corpusAfterInvestment: number;
  finalBalance: number;
  totalInvested: number;
  totalReturns: number;
  yearsToZero: number | null;
  monthsToZero: number | null;
  minSWPToSustain: number;
}

export interface YearlyBreakdown {
  year: number;
  invested: number;
  interest: number;
  totalValue: number;
  withdrawal?: number;
  openingBalance: number;
  periodInvestment: number;
  periodInterest: number;
  closingBalance: number;
}

export type InvestmentType = 'sip' | 'lumpsum';
export type BreakdownView = 'monthly' | 'quarterly' | 'yearly';
