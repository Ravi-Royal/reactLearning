/**
 * Currency formatting utilities
 * Centralized formatting to ensure consistency across the application
 */

export interface CurrencyFormatOptions {
  /**
   * Number of decimal places (default: 2)
   */
  decimals?: number;

  /**
   * Use compact notation for large numbers (default: false)
   * e.g., ₹1.2L instead of ₹1,20,000
   */
  compact?: boolean;

  /**
   * Show currency symbol (default: true)
   */
  showSymbol?: boolean;

  /**
   * Minimum decimal places to show (default: same as decimals)
   */
  minimumDecimals?: number;
}

/**
 * Format a number as Indian Rupee currency
 * @param amount The amount to format
 * @param options Formatting options
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56) // "₹1,234.56"
 * formatCurrency(1234.56, { decimals: 0 }) // "₹1,235"
 * formatCurrency(150000, { compact: true }) // "₹1.5L"
 */
export function formatCurrency(
  amount: number,
  options: CurrencyFormatOptions = {},
): string {
  // Guard against invalid numbers
  if (!isFinite(amount) || isNaN(amount)) {
    return options.showSymbol !== false ? '₹0.00' : '0.00';
  }

  const {
    decimals = 2,
    compact = false,
    showSymbol = true,
    minimumDecimals = decimals,
  } = options;

  // Handle compact notation for large numbers (Indian system)
  if (compact && amount >= 100000) {
    return formatCompactCurrency(amount, decimals, showSymbol);
  }

  // Standard formatting
  const formatted = new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    minimumFractionDigits: minimumDecimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return formatted;
}

/**
 * Format currency in compact notation (Indian system)
 * @param amount The amount to format
 * @param decimals Number of decimal places
 * @param showSymbol Whether to show currency symbol
 */
function formatCompactCurrency(
  amount: number,
  decimals: number,
  showSymbol: boolean,
): string {
  const symbol = showSymbol ? '₹' : '';

  // Crore (1,00,00,000)
  if (amount >= 10000000) {
    const crores = amount / 10000000;
    return `${symbol}${crores.toFixed(decimals)}Cr`;
  }

  // Lakh (1,00,000)
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `${symbol}${lakhs.toFixed(decimals)}L`;
  }

  // Thousand (1,000)
  if (amount >= 1000) {
    const thousands = amount / 1000;
    return `${symbol}${thousands.toFixed(decimals)}K`;
  }

  return `${symbol}${amount.toFixed(decimals)}`;
}

/**
 * Format a number as percentage
 * @param value The value to format (0.15 for 15%)
 * @param decimals Number of decimal places (default: 2)
 *
 * @example
 * formatPercentage(0.1234) // "12.34%"
 * formatPercentage(0.1234, 1) // "12.3%"
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a number as percentage from percentage value
 * @param value The percentage value (12 for 12%)
 * @param decimals Number of decimal places (default: 2)
 *
 * @example
 * formatPercentageValue(12.34) // "12.34%"
 * formatPercentageValue(12.34, 0) // "12%"
 */
export function formatPercentageValue(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a large number with Indian number system separators
 * @param value The number to format
 *
 * @example
 * formatNumber(1234567) // "12,34,567"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

/**
 * Format duration in years and months
 * @param years Number of years
 * @param months Number of months
 *
 * @example
 * formatDuration(5, 3) // "5 years 3 months"
 * formatDuration(0, 11) // "11 months"
 * formatDuration(1, 0) // "1 year"
 */
export function formatDuration(years: number, months: number): string {
  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  }

  return parts.join(' ') || '0 months';
}
