// Before-starting bond checklist constants
export const CHECKLIST_CATEGORIES = {
  EDUCATION: 'Education',
  PREPARATION: 'Preparation',
  MINE: 'mine',
} as const;

export type ChecklistCategory = typeof CHECKLIST_CATEGORIES[keyof typeof CHECKLIST_CATEGORIES];

export const BOND_LIST_CATEGORIES = {
  GOOD_BOND: 'Good Bond',
  CHECK_BOND: 'Check Bond',
  AVOID_BOND: 'Avoid Bond',
} as const;

export const BEFORE_STARTING_BOND_PAGE_HEADER = {
  TITLE: 'Before Starting Bond Checklist',
  SUBTITLE: 'Complete this checklist before starting your bond investment journey.',
} as const;

export const CHECKLIST_ITEM_LABELS = {
  HOW_TO_COME_OUT: 'How to come out ahead in bond investments',
  UNDERSTAND_BASICS: 'Understand bond basics (fixed income, coupons, maturity)',
  RISK_TOLERANCE: 'Assess my risk tolerance for bonds',
  INVESTMENT_GOALS: 'Define investment goals and timeline',
  RESEARCH_ISSUERS: 'Research reputable bond issuers',
  CREDIT_RATINGS: 'Learn about credit ratings and their importance',
  TAX_IMPLICATIONS: 'Understand tax implications of bond investments',
  DIVERSIFICATION: 'Plan for diversification in bond portfolio',
  BROKER_ACCOUNT: 'Set up or review brokerage account for bonds',
  MARKET_CONDITIONS: 'Review current market conditions for bonds',
  PROFESSIONAL_ADVICE: 'Consider consulting a financial advisor',
} as const;

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: ChecklistCategory;
}

export const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'howToComeOut', label: CHECKLIST_ITEM_LABELS.HOW_TO_COME_OUT, checked: false, category: CHECKLIST_CATEGORIES.MINE },
  { id: 'understandBasics', label: CHECKLIST_ITEM_LABELS.UNDERSTAND_BASICS, checked: false, category: CHECKLIST_CATEGORIES.EDUCATION },
  { id: 'riskTolerance', label: CHECKLIST_ITEM_LABELS.RISK_TOLERANCE, checked: false, category: CHECKLIST_CATEGORIES.PREPARATION },
  { id: 'investmentGoals', label: CHECKLIST_ITEM_LABELS.INVESTMENT_GOALS, checked: false, category: CHECKLIST_CATEGORIES.PREPARATION },
  { id: 'researchIssuers', label: CHECKLIST_ITEM_LABELS.RESEARCH_ISSUERS, checked: false, category: CHECKLIST_CATEGORIES.EDUCATION },
  { id: 'creditRatings', label: CHECKLIST_ITEM_LABELS.CREDIT_RATINGS, checked: false, category: CHECKLIST_CATEGORIES.EDUCATION },
  { id: 'taxImplications', label: CHECKLIST_ITEM_LABELS.TAX_IMPLICATIONS, checked: false, category: CHECKLIST_CATEGORIES.EDUCATION },
  { id: 'diversification', label: CHECKLIST_ITEM_LABELS.DIVERSIFICATION, checked: false, category: CHECKLIST_CATEGORIES.PREPARATION },
  { id: 'brokerAccount', label: CHECKLIST_ITEM_LABELS.BROKER_ACCOUNT, checked: false, category: CHECKLIST_CATEGORIES.PREPARATION },
  { id: 'marketConditions', label: CHECKLIST_ITEM_LABELS.MARKET_CONDITIONS, checked: false, category: CHECKLIST_CATEGORIES.PREPARATION },
  { id: 'professionalAdvice', label: CHECKLIST_ITEM_LABELS.PROFESSIONAL_ADVICE, checked: false, category: CHECKLIST_CATEGORIES.PREPARATION },
];

export interface MyBondItem {
    name: string;
    category: string;
    symbol?: string;
}

export const MY_BOND_LIST: MyBondItem[] = [
  {
    name: 'Government Bond',
    category: BOND_LIST_CATEGORIES.GOOD_BOND,
    symbol: 'govbond',
  },
];