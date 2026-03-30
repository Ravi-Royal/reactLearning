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
  // S2: Financial Health (AI)
  PROFIT_MARGIN: 'Strong profit margins (>15%)',
  POSITIVE_FCF: 'Positive Free Cash Flow (FCF)',
  HIGH_ROE: 'Return on Equity (ROE) > 15% consistently',
  HIGH_ROCE: 'Return on Capital (ROCE/ROIC) > 15%',
  SAFE_INTEREST_COVERAGE: 'Interest coverage ratio > 4x–5x (EBIT / Interest)',
  HEALTHY_CURRENT_RATIO: 'Current ratio > 1.5 (short-term liquidity)',
  // S3: Valuation (AI)
  PE_REASONABLE: 'Reasonable P/E ratio — in-line with 5-year historical average',
  ATTRACTIVE_PEG: 'PEG ratio < 1.5 (not overpaying for growth)',
  PRICE_TO_FCF: 'Price-to-Free-Cash-Flow (P/FCF) < 20',
  FAIR_EV_EBITDA: 'EV/EBITDA reasonable vs. direct sector peers',
  SHAREHOLDER_YIELD: 'Consistent dividends or steady share buybacks',
  // S4: Business Quality (AI)
  ECONOMIC_MOAT: 'Strong economic moat (brand, network effect, switching cost)',
  PRICING_POWER: 'Can raise prices during inflation without losing customers',
  MANAGEMENT: 'Transparent, capable and shareholder-friendly management',
  LOW_CUSTOMER_CONCENTRATION: 'No single customer accounts for >10% of revenue',
  CONTINUOUS_INNOVATION: 'Adequate R&D investment to stay ahead of competition',
  GROWTH: 'Clear growth strategy & addressable market',
  // S5: Risk & Stability (AI)
  CLEAN_GOVERNANCE: 'No frequent auditor changes or accounting red flags',
  LOW_PROMOTER_PLEDGING: 'Promoter pledged shares < 5% (ideally zero)',
  NO_TOXIC_DILUTION: 'Outstanding shares are stable — no excessive dilution',
  MANAGEABLE_REGULATORY_RISK: 'Not overly vulnerable to sudden regulatory changes',
  MACRO_RESILIENCE: 'Business can survive recession or high interest rate cycles',
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
  // S2: Financial Health
  { id: 'profit', label: CHECKLIST_ITEM_LABELS.PROFIT_MARGIN, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'fcf', label: CHECKLIST_ITEM_LABELS.POSITIVE_FCF, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'roe', label: CHECKLIST_ITEM_LABELS.HIGH_ROE, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'roce', label: CHECKLIST_ITEM_LABELS.HIGH_ROCE, checked: false, category: CHECKLIST_CATEGORIES.AI },
  {
    id: 'interest_coverage',
    label: CHECKLIST_ITEM_LABELS.SAFE_INTEREST_COVERAGE,
    checked: false,
    category: CHECKLIST_CATEGORIES.AI,
  },
  {
    id: 'current_ratio',
    label: CHECKLIST_ITEM_LABELS.HEALTHY_CURRENT_RATIO,
    checked: false,
    category: CHECKLIST_CATEGORIES.AI,
  },
  // S3: Valuation
  { id: 'pe', label: CHECKLIST_ITEM_LABELS.PE_REASONABLE, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'peg', label: CHECKLIST_ITEM_LABELS.ATTRACTIVE_PEG, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'pfcf', label: CHECKLIST_ITEM_LABELS.PRICE_TO_FCF, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'evebitda', label: CHECKLIST_ITEM_LABELS.FAIR_EV_EBITDA, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'yield', label: CHECKLIST_ITEM_LABELS.SHAREHOLDER_YIELD, checked: false, category: CHECKLIST_CATEGORIES.AI },
  // S4: Business Quality
  { id: 'moat', label: CHECKLIST_ITEM_LABELS.ECONOMIC_MOAT, checked: false, category: CHECKLIST_CATEGORIES.AI },
  {
    id: 'pricing_power',
    label: CHECKLIST_ITEM_LABELS.PRICING_POWER,
    checked: false,
    category: CHECKLIST_CATEGORIES.AI,
  },
  { id: 'management', label: CHECKLIST_ITEM_LABELS.MANAGEMENT, checked: false, category: CHECKLIST_CATEGORIES.AI },
  {
    id: 'concentration',
    label: CHECKLIST_ITEM_LABELS.LOW_CUSTOMER_CONCENTRATION,
    checked: false,
    category: CHECKLIST_CATEGORIES.AI,
  },
  {
    id: 'innovation',
    label: CHECKLIST_ITEM_LABELS.CONTINUOUS_INNOVATION,
    checked: false,
    category: CHECKLIST_CATEGORIES.AI,
  },
  { id: 'growth', label: CHECKLIST_ITEM_LABELS.GROWTH, checked: false, category: CHECKLIST_CATEGORIES.AI },
  // S5: Risk & Stability
  {
    id: 'governance',
    label: CHECKLIST_ITEM_LABELS.CLEAN_GOVERNANCE,
    checked: false,
    category: CHECKLIST_CATEGORIES.AI,
  },
  {
    id: 'pledging',
    label: CHECKLIST_ITEM_LABELS.LOW_PROMOTER_PLEDGING,
    checked: false,
    category: CHECKLIST_CATEGORIES.AI,
  },
  { id: 'dilution', label: CHECKLIST_ITEM_LABELS.NO_TOXIC_DILUTION, checked: false, category: CHECKLIST_CATEGORIES.AI },
  {
    id: 'reg_risk',
    label: CHECKLIST_ITEM_LABELS.MANAGEABLE_REGULATORY_RISK,
    checked: false,
    category: CHECKLIST_CATEGORIES.AI,
  },
  {
    id: 'macro_resilience',
    label: CHECKLIST_ITEM_LABELS.MACRO_RESILIENCE,
    checked: false,
    category: CHECKLIST_CATEGORIES.AI,
  },
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
