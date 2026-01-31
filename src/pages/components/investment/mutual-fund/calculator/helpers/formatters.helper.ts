/**
 * Formats a number as Indian Rupee currency
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Gets the period label based on breakdown view
 * @param view - Breakdown view type
 * @returns Period label string
 */
export const getPeriodLabel = (view: 'monthly' | 'quarterly' | 'yearly'): string => {
  switch (view) {
    case 'monthly':
      return 'Month';
    case 'quarterly':
      return 'Quarter';
    case 'yearly':
      return 'Year';
  }
};

/**
 * Gets the number of months per period based on breakdown view
 * @param view - Breakdown view type
 * @returns Number of months per period
 */
export const getMonthsPerPeriod = (view: 'monthly' | 'quarterly' | 'yearly'): number => {
  switch (view) {
    case 'monthly':
      return 1;
    case 'quarterly':
      return 3;
    case 'yearly':
      return 12;
  }
};
