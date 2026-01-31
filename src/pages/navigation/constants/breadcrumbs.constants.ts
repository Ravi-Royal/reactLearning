// Breadcrumb navigation constants
export const BREADCRUMB_LABELS = {
  // Root
  HOME: 'Home',

  // Main Sections
  INVESTMENT: 'Investment',
  HOOKS: 'React Hooks',

  // Stock Section
  STOCK: 'Stock',
  STOCK_ANALYSIS: 'P&L Analysis',
  STOCK_ZERODHA: 'Zerodha',
  STOCK_FAVORITES: 'My Favorites',
  STOCK_CHECKLIST: 'Stock Checklist',
  STOCK_AVERAGE_CALCULATOR: 'Average Calculator',
  STOCK_PROFIT_CALCULATOR: 'Stock Profit Calculator',

  // Mutual Fund Section
  MUTUAL_FUND: 'Mutual Fund',
  MUTUAL_FUND_CHECKLIST: 'Mutual Fund Checklist',
  MUTUAL_FUND_CALCULATOR: 'Mutual Fund Calculator',

  // Bonds Section
  BONDS: 'Bonds & Fixed Income',
  BONDS_BEFORE_STARTING: 'Before Starting Checklist',
  BONDS_CHECKLIST: 'Bond Investment Checklist',

  // Commodities Section
  COMMODITIES: 'Commodities',
  GOLD_SILVER_RATIO: 'Gold vs Silver Ratio',

  // Calculator Section
  CALCULATOR: 'Calculator',
} as const;

export const BREADCRUMB_PATHS = {
  // Root
  HOME: '/',

  // Main Sections
  INVESTMENT: '/investment',
  HOOKS: '/hooks',

  // Stock Section
  STOCK: '/investment/stock',
  STOCK_ANALYSIS: '/investment/stock/analysis',
  STOCK_ZERODHA: '/investment/stock/analysis/zerodha',
  STOCK_FAVORITES: '/investment/stock/favorites',
  STOCK_CHECKLIST: '/investment/stock/checklist',
  STOCK_AVERAGE_CALCULATOR: '/investment/stock/average-calculator',
  STOCK_PROFIT_CALCULATOR: '/investment/stock/profit-calculator',

  // Mutual Fund Section
  MUTUAL_FUND: '/investment/mutual-fund',
  MUTUAL_FUND_CHECKLIST: '/investment/mutual-fund/checklist',
  MUTUAL_FUND_CALCULATOR: '/investment/mutual-fund/calculator',

  // Bonds Section
  BONDS: '/investment/bonds',
  BONDS_BEFORE_STARTING: '/investment/bonds/before-starting',
  BONDS_CHECKLIST: '/investment/bonds/checklist',

  // Commodities Section
  COMMODITIES: '/investment/commodities',
  GOLD_SILVER_RATIO: '/investment/commodities/gold-silver-ratio',

  // Calculator Section
  CALCULATOR: '/investment/calculator',
  CALCULATOR_STOCK_AVERAGE: '/investment/calculator/stock-average',
  CALCULATOR_STOCK_PROFIT: '/investment/calculator/stock-profit',
  CALCULATOR_MUTUAL_FUND: '/investment/mutual-fund/calculator',
} as const;

export const BREADCRUMB_ARIA_LABELS = {
  NAVIGATION: 'Breadcrumb',
} as const;

// Path segment identifiers
export const PATH_SEGMENTS = {
  INVESTMENT: 'investment',
  STOCK: 'stock',
  ANALYSIS: 'analysis',
  ZERODHA: 'zerodha',
  FAVORITES: 'favorites',
  CHECKLIST: 'checklist',
  AVERAGE_CALCULATOR: 'average-calculator',
  PROFIT_CALCULATOR: 'profit-calculator',
  MUTUAL_FUND: 'mutual-fund',
  CALCULATOR: 'calculator',
  BONDS: 'bonds',
  BEFORE_STARTING: 'before-starting',
  COMMODITIES: 'commodities',
  GOLD_SILVER_RATIO: 'gold-silver-ratio',
  STOCK_AVERAGE: 'stock-average',
  STOCK_PROFIT: 'stock-profit',
  HOOKS: 'hooks',
  USE: 'use',
} as const;
