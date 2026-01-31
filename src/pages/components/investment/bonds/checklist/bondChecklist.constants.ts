// Bond checklist constants
export const CHECKLIST_CATEGORIES = {
  EDUCATION: 'Education',
  PREPARATION: 'Preparation',
  MINE: 'mine',
  PERSONAL: 'Personal',
  AI: 'AI',
} as const;

export type ChecklistCategory = typeof CHECKLIST_CATEGORIES[keyof typeof CHECKLIST_CATEGORIES];

export const BOND_LIST_CATEGORIES = {
  GOOD_BOND: 'Good Bond',
  CHECK_BOND: 'Check Bond',
  AVOID_BOND: 'Avoid Bond',
} as const;

export const BOND_CHECKLIST_PAGE_HEADER = {
  TITLE: 'Bond Investment Checklist',
  SUBTITLE: 'Use this checklist to evaluate potential bond investments systematically.',
} as const;

export const BOND_CHECKLIST_MODAL = {
  TITLE: 'Select Bond',
} as const;

export const CHECKLIST_ITEM_LABELS = {
  REPAYMENT_PRIORITY: 'Repayment Priority - senior',
  CREDIT_RATING: 'Investment grade credit rating',
  ISSUER: 'Reputable issuer',
  MATURITY: 'Suitable maturity period',
  COUPON: 'Attractive coupon rate',
  LIQUIDITY: 'Good liquidity',
  TAX: 'Tax efficiency',
  PERSONAL_RISK: 'Matches my risk tolerance',
  PERSONAL_DURATION: 'Fits my investment timeline',
  PERSONAL_INCOME: 'Provides desired income stream',
} as const;

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: ChecklistCategory;
}

export const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'repaymentPriority', label: CHECKLIST_ITEM_LABELS.REPAYMENT_PRIORITY, checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'creditRating', label: CHECKLIST_ITEM_LABELS.CREDIT_RATING, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'issuer', label: CHECKLIST_ITEM_LABELS.ISSUER, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'maturity', label: CHECKLIST_ITEM_LABELS.MATURITY, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'coupon', label: CHECKLIST_ITEM_LABELS.COUPON, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'liquidity', label: CHECKLIST_ITEM_LABELS.LIQUIDITY, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'tax', label: CHECKLIST_ITEM_LABELS.TAX, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'personalRisk', label: CHECKLIST_ITEM_LABELS.PERSONAL_RISK, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'personalDuration', label: CHECKLIST_ITEM_LABELS.PERSONAL_DURATION, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'personalIncome', label: CHECKLIST_ITEM_LABELS.PERSONAL_INCOME, checked: false, category: CHECKLIST_CATEGORIES.AI },
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