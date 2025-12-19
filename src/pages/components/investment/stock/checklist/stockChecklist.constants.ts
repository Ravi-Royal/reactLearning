// Stock checklist constants
export const CHECKLIST_CATEGORIES = {
  AI: 'AI',
  PERSONAL: 'mine',
} as const;

export type ChecklistCategory = typeof CHECKLIST_CATEGORIES[keyof typeof CHECKLIST_CATEGORIES];

export const STOCK_LIST_CATEGORIES = {
  GOOD_STOCK: 'Good Stock',
  CHECK_STOCK: 'Check Stock',
  AVOID_STOCK: 'Avoid Stock',
} as const;

export interface MyStockItem {
    name: string;
    category: string;
    symbol?: string;
}

export const MY_STOCK_LIST: MyStockItem[] = [
  {
    name: 'Go Fashion (India) Ltd',
    category: STOCK_LIST_CATEGORIES.CHECK_STOCK,
    symbol: 'gocolors',
  },
];