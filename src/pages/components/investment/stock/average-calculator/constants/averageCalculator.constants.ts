/**
 * Stock Average Calculator Constants
 * Centralized configuration and text strings
 */

export const AVERAGE_CALCULATOR_TEXTS = {
  PAGE_TITLE: 'Stock Average Calculator',
  PAGE_SUBTITLE: 'Calculate the average purchase price when accumulating stock positions',

  INITIAL_INVESTMENT: {
    SECTION_TITLE: 'Initial Investment',
    QUANTITY_LABEL: 'Initial Quantity',
    QUANTITY_PLACEHOLDER: 'e.g., 100',
    PRICE_LABEL: 'Initial Purchase Price (₹)',
    PRICE_PLACEHOLDER: 'e.g., 150.50',
    TOTAL_LABEL: 'Initial Total Investment (₹)',
    TOTAL_PLACEHOLDER: 'e.g., 15050.00',
  },

  ADDITIONAL_PURCHASES: {
    SECTION_TITLE: 'Additional Purchases',
    ADD_BUTTON: 'Add Purchase',
    REMOVE_BUTTON: 'Remove',
    QUANTITY_LABEL: 'Quantity',
    QUANTITY_PLACEHOLDER: 'e.g., 50',
    PRICE_LABEL: 'Purchase Price (₹)',
    PRICE_PLACEHOLDER: 'e.g., 140.00',
    TOTAL_LABEL: 'Total (₹)',
    TOTAL_PLACEHOLDER: 'e.g., 7000.00',
  },

  RESULTS: {
    SECTION_TITLE: 'Results',
    TOTAL_QUANTITY: 'Total Quantity',
    TOTAL_INVESTED: 'Total Amount Invested',
    AVERAGE_PRICE: 'Average Purchase Price',
    SHARES: 'shares',
  },

  TARGET_ANALYSIS: {
    SECTION_TITLE: 'Target Analysis',
    CURRENT_PRICE_LABEL: 'Current Market Price (₹)',
    CURRENT_PRICE_PLACEHOLDER: 'e.g., 140.00',
    TARGET_PRICE_LABEL: 'Target Price (₹)',
    TARGET_PRICE_PLACEHOLDER: 'e.g., 145.00',
    CURRENT_VALUE: 'Current Value',
    PROFIT_LOSS: 'Profit/Loss',
    PROFIT_LOSS_PERCENTAGE: 'Profit/Loss %',
    TARGET_VALUE: 'Target Value',
    POTENTIAL_PROFIT: 'Potential Profit',
    POTENTIAL_PROFIT_PERCENTAGE: 'Potential Profit %',
  },

  BUTTONS: {
    CALCULATE: 'Calculate',
    RESET: 'Reset All',
    ADD_MORE: 'Add More',
  },
} as const;

export const DEFAULT_VALUES = {
  INITIAL_QUANTITY: '',
  INITIAL_PRICE: '',
  ADDITIONAL_QUANTITY: '',
  ADDITIONAL_PRICE: '',
} as const;

export const CALCULATION_CONSTANTS = {
  MIN_QUANTITY: 1,
  MIN_PRICE: 0.01,
  DECIMAL_PLACES: 2,
} as const;
