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

export const MUTUAL_FUND_CHECKLIST_PAGE_HEADER = {
  TITLE: 'Mutual Fund Investment Checklist',
  SUBTITLE: 'Use this checklist to evaluate potential mutual fund investments systematically.',
} as const;

export const MUTUAL_FUND_CHECKLIST_MODAL = {
  TITLE: 'Select Mutual Fund',
} as const;

export const CHECKLIST_INFO = {
  sharpeRatiomine: {
    title: 'Sharpe Ratio',
    info: 'Measures risk-adjusted return. >2 is excellent, 1-2 is good, <1 is poor.',
  },
  alpha: {
    title: 'Alpha',
    info: 'Measures excess return over benchmark. Positive alpha (>0) is good, negative is bad.',
  },
  beta: {
    title: 'Beta',
    info: 'Measures volatility vs market. <1 is less volatile (good for conservative), >1 is more volatile.',
  },
  expenseRatio: {
    title: 'Expense Ratio',
    info: 'Annual fund management cost. <1% for equity, <0.5% for index funds is good. Lower is better.',
  },
  aum: {
    title: 'AUM',
    info: 'Assets Under Management. >₹1000 crores is considered stable.',
  },
  fundHouse: {
    title: 'Fund House',
    info: 'Reputed, established fund houses are preferred for stability and governance.',
  },
  returns5y: {
    title: '5Y Returns',
    info: 'Consistent returns over 5 years show good performance. Compare with peers/benchmark.',
  },
  manager: {
    title: 'Fund Manager',
    info: 'Experienced manager (>5 years) is a positive sign.',
  },
  category: {
    title: 'Fund Category',
    info: 'Should match your investment goal (e.g., equity for growth, debt for safety).',
  },
  risk: {
    title: 'Risk Level',
    info: 'Should match your risk profile. High risk for aggressive, low for conservative.',
  },
  exitLoad: {
    title: 'Exit Load',
    info: 'Fee for early withdrawal. Lower or zero exit load is better.',
  },
  rating: {
    title: 'Fund Rating',
    info: '4-star or 5-star by CRISIL/Morningstar is good. Lower ratings indicate higher risk.',
  },
  consistency: {
    title: 'Consistency',
    info: 'Fund should beat its benchmark regularly, not just in one year.',
  },
  portfolio: {
    title: 'Portfolio Diversification',
    info: 'More than 30 stocks is well-diversified. Less is riskier.',
  },
  volatility: {
    title: 'Volatility',
    info: 'Lower volatility than peers is preferred for stability.',
  },
  sharpeRatio: {
    title: 'Sharpe Ratio',
    info: 'Risk-adjusted return. >1.5 is good, <1 is poor.',
  },
  downside: {
    title: 'Downside Capture',
    info: 'Lower downside capture ratio means less loss in market falls. <100% is good.',
  },
  upsideDownsideCapture: {
    title: 'Upside and Downside Capture Ratios',
    info: 'Upside capture >100% means fund gains more than market in uptrends. Downside capture <100% means fund loses less than market in downtrends. Both are desirable.',
  },
} as const;

export const CHECKLIST_ITEM_LABELS = {
  SHARPE_RATIO_MINE: 'Good Sharpe ratio (>2)',
  ALPHA: 'Positive alpha',
  BETA: 'Low beta (<1)',
  EXPENSE_RATIO: 'Low expense ratio (<1% for equity, <0.5% for index)',
  UPSIDE_DOWNSIDE: 'Good upside (>100%) and downside (<100%) capture ratios',
  AUM: 'Adequate AUM (>₹1000 crores)',
  FUND_HOUSE: 'Reputed and established fund house',
  RETURNS_5Y: 'Consistent returns over 5 years',
  MANAGER: 'Experienced fund manager (>5 years)',
  CATEGORY: 'Fund category matches investment goal',
  RISK: 'Risk level suitable for my profile',
  EXIT_LOAD: 'Reasonable exit load structure',
  RATING: '4-star or 5-star rating by CRISIL/Morningstar',
  CONSISTENCY: 'Beats benchmark consistently',
  PORTFOLIO: 'Well-diversified portfolio (>30 stocks)',
  VOLATILITY: 'Lower volatility than peers',
  SHARPE_RATIO: 'Good Sharpe ratio (>1.5)',
  DOWNSIDE: 'Limited downside capture ratio',
} as const;

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: ChecklistCategory;
}

export const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'sharpeRatiomine', label: CHECKLIST_ITEM_LABELS.SHARPE_RATIO_MINE, checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'alpha', label: CHECKLIST_ITEM_LABELS.ALPHA, checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'beta', label: CHECKLIST_ITEM_LABELS.BETA, checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'expenseRatio', label: CHECKLIST_ITEM_LABELS.EXPENSE_RATIO, checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'upsideDownsideCapture', label: CHECKLIST_ITEM_LABELS.UPSIDE_DOWNSIDE, checked: false, category: CHECKLIST_CATEGORIES.PERSONAL },
  { id: 'aum', label: CHECKLIST_ITEM_LABELS.AUM, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'fundHouse', label: CHECKLIST_ITEM_LABELS.FUND_HOUSE, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'returns5y', label: CHECKLIST_ITEM_LABELS.RETURNS_5Y, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'manager', label: CHECKLIST_ITEM_LABELS.MANAGER, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'category', label: CHECKLIST_ITEM_LABELS.CATEGORY, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'risk', label: CHECKLIST_ITEM_LABELS.RISK, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'exitLoad', label: CHECKLIST_ITEM_LABELS.EXIT_LOAD, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'rating', label: CHECKLIST_ITEM_LABELS.RATING, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'consistency', label: CHECKLIST_ITEM_LABELS.CONSISTENCY, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'portfolio', label: CHECKLIST_ITEM_LABELS.PORTFOLIO, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'volatility', label: CHECKLIST_ITEM_LABELS.VOLATILITY, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'sharpeRatio', label: CHECKLIST_ITEM_LABELS.SHARPE_RATIO, checked: false, category: CHECKLIST_CATEGORIES.AI },
  { id: 'downside', label: CHECKLIST_ITEM_LABELS.DOWNSIDE, checked: false, category: CHECKLIST_CATEGORIES.AI },
];

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
