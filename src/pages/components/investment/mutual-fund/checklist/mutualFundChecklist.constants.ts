// Mutual Fund checklist constants
export const CHECKLIST_CATEGORIES = {
  AI: 'AI',
  PERSONAL: 'mine',
} as const;

export type ChecklistCategory = typeof CHECKLIST_CATEGORIES[keyof typeof CHECKLIST_CATEGORIES];

export const MUTUAL_FUND_CATEGORIES = {
  EQUITY: 'Equity Fund',
  DEBT: 'Debt Fund',
  HYBRID: 'Hybrid Fund',
  INDEX: 'Index Fund',
  ELSS: 'ELSS',
} as const;

export interface MutualFundItem {
  name: string;
  category: string;
  code?: string;
  fundHouse?: string;
}

export const MUTUAL_FUND_LIST: MutualFundItem[] = [
  {
    name: 'HDFC Index Fund - Nifty 50 Plan',
    category: MUTUAL_FUND_CATEGORIES.INDEX,
    code: 'HDFC-INDEX-NIFTY50',
    fundHouse: 'HDFC Mutual Fund',
  },
  {
    name: 'SBI Bluechip Fund',
    category: MUTUAL_FUND_CATEGORIES.EQUITY,
    code: 'SBI-BLUECHIP',
    fundHouse: 'SBI Mutual Fund',
  },
  {
    name: 'ICICI Prudential Balanced Advantage Fund',
    category: MUTUAL_FUND_CATEGORIES.HYBRID,
    code: 'ICICI-BAF',
    fundHouse: 'ICICI Prudential Mutual Fund',
  },
];
