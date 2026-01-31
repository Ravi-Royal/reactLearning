/**
 * Stock Profit Calculator Constants
 * Centralized configuration and text strings
 */

export const PROFIT_CALCULATOR_TEXTS = {
  PAGE_TITLE: 'Stock Profit Calculator',
  PAGE_SUBTITLE: 'Calculate profit percentage and track multiple stock groups',

  STOCK_GROUP: {
    GROUP_LABEL: 'Stock Group',
    ADD_GROUP: 'Add Stock Group',
    REMOVE_GROUP: 'Remove Group',
    DEFAULT_NAME: 'Stock Group',
  },

  PURCHASE_DETAILS: {
    SECTION_TITLE: 'Purchase Details',
    QUANTITY_LABEL: 'Quantity',
    QUANTITY_PLACEHOLDER: 'e.g., 100',
    PURCHASE_PRICE_LABEL: 'Purchase Price (₹)',
    PURCHASE_PRICE_PLACEHOLDER: 'e.g., 250.50',
  },

  CURRENT_DETAILS: {
    SECTION_TITLE: 'Current Details',
    CURRENT_PRICE_LABEL: 'Current Price (₹)',
    INVESTED_AMOUNT_LABEL: 'Invested Amount (₹)',
    INVESTED_AMOUNT_PLACEHOLDER: 'e.g., 5000',
    CURRENT_QUANTITY_LABEL: 'Current Quantity',
    CURRENT_QUANTITY_PLACEHOLDER: 'e.g., 10',
    SELLING_PRICE_LABEL: 'Selling Price (₹)',
    SELLING_PRICE_PLACEHOLDER: 'e.g., 405.8',
    HOLDING_DAYS_LABEL: 'Holding Period (days)',
    HOLDING_DAYS_PLACEHOLDER: 'e.g., 365',
  },

  RESULTS: {
    TOTAL_INVESTMENT: 'Total Investment',
    CURRENT_VALUE: 'Current Value',
    PROFIT_LOSS: 'Profit/Loss',
    PROFIT_PERCENTAGE: 'Profit %',
    ANNUALIZED_RETURN: 'Annualized Return',
  },

  SIMULATOR: {
    TITLE: 'Profit Simulator',
    SIMULATE_BUTTON: 'Simulate Profit',
    AMOUNT_LABEL: 'Enter amount (₹)',
    AMOUNT_PLACEHOLDER: 'Enter amount (₹)',
    QUANTITY_LABEL: 'Enter quantity',
    QUANTITY_PLACEHOLDER: 'Enter quantity',
    CALCULATE_BUTTON: 'Calculate',
    CLOSE_BUTTON: 'Close',
  },

  BUTTONS: {
    CALCULATE: 'Calculate Profit',
    RESET: 'Reset',
    ADD_GROUP: 'Add Group',
  },
} as const;

export const DEFAULT_VALUES = {
  QUANTITY: '',
  PURCHASE_PRICE: '',
  CURRENT_PRICE: '',
  INVESTED_AMOUNT: '',
  HOLDING_DAYS: '',
} as const;

export const CALCULATION_CONSTANTS = {
  MIN_QUANTITY: 1,
  MIN_PRICE: 0.01,
  DECIMAL_PLACES: 2,
  DAYS_IN_YEAR: 365,
} as const;
