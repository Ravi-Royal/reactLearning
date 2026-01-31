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