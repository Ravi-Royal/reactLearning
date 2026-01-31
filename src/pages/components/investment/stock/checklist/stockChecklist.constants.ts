// Stock checklist constants
export const CHECKLIST_CATEGORIES = {
  AI: 'AI',
  PERSONAL: 'mine',
} as const;

export type ChecklistCategory = (typeof CHECKLIST_CATEGORIES)[keyof typeof CHECKLIST_CATEGORIES];

export const STOCK_LIST_CATEGORIES = {
  GOOD_STOCK: 'Good Stock',
  CHECK_STOCK: 'Check Stock',
  AVOID_STOCK: 'Avoid Stock',
} as const;

export const STOCK_CHECKLIST_PAGE_HEADER = {
  TITLE: 'Stock Investment Checklist',
  SUBTITLE: 'Use this checklist to evaluate potential stock investments systematically.',
} as const;

export const STOCK_CHECKLIST_MODAL = {
  TITLE: 'Select Stock',
} as const;

export const CHECKLIST_ITEM_LABELS = {
  DEBT_RATIO: 'Low debt-to-equity ratio (<1.0)',
  DEBT_DECREASE: 'Decreasing debt over the past 3 years',
  SALES_INCREASE: 'Increasing year-on-year sales',
  NET_PROFIT: 'Positive net profit in last 5 years',
  ROE: 'Return on Equity (ROE) > 20%',
  NET_PROFIT_INCREASE: 'Increasing net profit year-on-year',
  REVENUE_GROWTH: 'Consistent revenue growth (>10% YoY)',
  PE_RATIO: 'Less PE (<10)',
  PB_RATIO: 'Less price to book',
  PE_PB_RATIO: 'Lower PE and lower Price to Book is for sure better stock',
  PROFIT_MARGIN: 'Strong profit margins (>15%)',
  PE_REASONABLE: 'Reasonable P/E ratio (<25)',
  DIVIDEND: 'Consistent dividend payments',
  COMPETITION: 'Strong competitive advantage',
  MANAGEMENT: 'Experienced management team',
  GROWTH: 'Clear growth strategy',
} as const;

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: ChecklistCategory;
}

export const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'debt', label: CHECKLIST_ITEM_LABELS.DEBT_RATIO, checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  {
    id: 'yearOveryearDebt',
    label: CHECKLIST_ITEM_LABELS.DEBT_DECREASE,
    checked: false,
    category: CHECKLIST_CATEGORIES.PERSONAL,
  },
  {
    id: 'yearOnyearSales',
    label: CHECKLIST_ITEM_LABELS.SALES_INCREASE,
    checked: false,
    category: CHECKLIST_CATEGORIES.PERSONAL,
  },
  { id: 'netProfit', label: CHECKLIST_ITEM_LABELS.NET_PROFIT, checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'ROE', label: CHECKLIST_ITEM_LABELS.ROE, checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  {
    id: 'netproitYearOnyear',
    label: CHECKLIST_ITEM_LABELS.NET_PROFIT_INCREASE,
    checked: false,
    category: CHECKLIST_CATEGORIES.PERSONAL,
  },
  {
    id: 'revenue',
    label: CHECKLIST_ITEM_LABELS.REVENUE_GROWTH,
    checked: false,
    category: CHECKLIST_CATEGORIES.PERSONAL,
  },
  { id: 'pedata', label: CHECKLIST_ITEM_LABELS.PE_RATIO, checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'PBratio', label: CHECKLIST_ITEM_LABELS.PB_RATIO, checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  {
    id: 'PEAdPBratio',
    label: CHECKLIST_ITEM_LABELS.PE_PB_RATIO,
    checked: false,
    category: CHECKLIST_CATEGORIES.PERSONAL,
  },
  { id: 'profit', label: CHECKLIST_ITEM_LABELS.PROFIT_MARGIN, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'pe', label: CHECKLIST_ITEM_LABELS.PE_REASONABLE, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'dividend', label: CHECKLIST_ITEM_LABELS.DIVIDEND, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'competition', label: CHECKLIST_ITEM_LABELS.COMPETITION, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'management', label: CHECKLIST_ITEM_LABELS.MANAGEMENT, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'growth', label: CHECKLIST_ITEM_LABELS.GROWTH, checked: false, category: CHECKLIST_CATEGORIES.AI },
];

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
