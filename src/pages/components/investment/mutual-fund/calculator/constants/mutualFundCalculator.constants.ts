/**
 * Mutual Fund Calculator Constants
 * Centralized configuration and text strings
 */

export const MUTUAL_FUND_CALCULATOR_TEXTS = {
  PAGE_TITLE: 'Mutual Fund Calculator',
  PAGE_SUBTITLE: 'Calculate SIP/Lumpsum returns, SWP duration, and sustainable withdrawal amounts',

  CALCULATOR_MODES: {
    SIP_RETURNS: 'SIP Returns',
    LUMPSUM_RETURNS: 'Lumpsum Returns',
    SWP_DURATION: 'SWP Duration',
    SUSTAINABLE_SWP: 'Sustainable SWP',
  },

  SIP_INPUTS: {
    MONTHLY_INVESTMENT: 'Monthly Investment (₹)',
    MONTHLY_INVESTMENT_PLACEHOLDER: 'e.g., 5000',
    MONTHLY_AMOUNT_PLACEHOLDER: 'e.g., 10000',
    YEARLY_AMOUNT_PLACEHOLDER: 'e.g., 120000',
    DURATION_YEARS: 'Investment Duration (Years)',
    DURATION_YEARS_PLACEHOLDER: 'e.g., 10',
    EXPECTED_RETURN: 'Expected Return Rate (%)',
    EXPECTED_RETURN_PLACEHOLDER: 'e.g., 12',
  },

  COMMON_INPUTS: {
    ANNUAL_RETURN_PLACEHOLDER: 'e.g., 12',
    INVESTMENT_PERIOD_PLACEHOLDER: 'e.g., 10',
  },

  OPTIONAL_INPUTS: {
    POST_INVESTMENT_HOLDING_PLACEHOLDER: 'e.g., 3',
    ONE_TIME_WITHDRAWAL_PLACEHOLDER: 'e.g., 100000',
  },

  LUMPSUM_INPUTS: {
    INVESTMENT_AMOUNT: 'Investment Amount (₹)',
    INVESTMENT_AMOUNT_PLACEHOLDER: 'e.g., 100000',
    DURATION_YEARS: 'Investment Duration (Years)',
    DURATION_YEARS_PLACEHOLDER: 'e.g., 10',
    EXPECTED_RETURN: 'Expected Return Rate (%)',
    EXPECTED_RETURN_PLACEHOLDER: 'e.g., 12',
  },

  SWP_DURATION_INPUTS: {
    CORPUS_AMOUNT: 'Corpus Amount (₹)',
    CORPUS_AMOUNT_PLACEHOLDER: 'e.g., 1000000',
    MONTHLY_WITHDRAWAL: 'Monthly Withdrawal (₹)',
    MONTHLY_WITHDRAWAL_PLACEHOLDER: 'e.g., 10000',
    EXPECTED_RETURN: 'Expected Return Rate (%)',
    EXPECTED_RETURN_PLACEHOLDER: 'e.g., 8',
  },

  SUSTAINABLE_SWP_INPUTS: {
    CORPUS_AMOUNT: 'Corpus Amount (₹)',
    CORPUS_AMOUNT_PLACEHOLDER: 'e.g., 1000000',
    DURATION_YEARS: 'Withdrawal Duration (Years)',
    DURATION_YEARS_PLACEHOLDER: 'e.g., 20',
    EXPECTED_RETURN: 'Expected Return Rate (%)',
    EXPECTED_RETURN_PLACEHOLDER: 'e.g., 8',
  },

  RESULTS: {
    TOTAL_INVESTED: 'Total Invested',
    MATURITY_VALUE: 'Maturity Value',
    CAPITAL_GAINS: 'Capital Gains',
    WITHDRAWAL_DURATION: 'Withdrawal Duration',
    MONTHS: 'months',
    YEARS: 'years',
    SUSTAINABLE_WITHDRAWAL: 'Sustainable Monthly Withdrawal',
  },

  BUTTONS: {
    CALCULATE: 'Calculate',
    RESET: 'Reset',
    SWITCH_MODE: 'Switch Mode',
  },

  TOOLTIPS: {
    SIP: 'Systematic Investment Plan - Regular monthly investments',
    LUMPSUM: 'One-time investment amount',
    SWP: 'Systematic Withdrawal Plan - Regular monthly withdrawals',
    RETURN_RATE: 'Annual percentage return expected from the investment',
  },
} as const;

export const DEFAULT_VALUES = {
  MONTHLY_INVESTMENT: '',
  INVESTMENT_AMOUNT: '',
  CORPUS_AMOUNT: '',
  MONTHLY_WITHDRAWAL: '',
  DURATION_YEARS: '',
  EXPECTED_RETURN: '',
} as const;

export const CALCULATION_CONSTANTS = {
  MIN_AMOUNT: 100,
  MIN_DURATION: 1,
  MIN_RETURN_RATE: 0.01,
  MAX_RETURN_RATE: 100,
  DECIMAL_PLACES: 2,
  MONTHS_IN_YEAR: 12,
} as const;
