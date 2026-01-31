/**
 * Financial calculation utilities using Decimal.js for precision
 * All monetary calculations MUST use these utilities to avoid floating-point errors
 */

import Decimal from 'decimal.js';

// Configure Decimal.js for financial precision
Decimal.set({
  precision: 20,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -9,
  toExpPos: 9,
});

/**
 * Money class for precise financial calculations
 */
export class Money {
  /**
   * Add two numbers with precision
   */
  static add(a: number, b: number): number {
    if (!isFinite(a) || !isFinite(b)) {
      throw new Error('Invalid number in addition');
    }
    return new Decimal(a).plus(b).toNumber();
  }

  /**
   * Subtract b from a with precision
   */
  static subtract(a: number, b: number): number {
    if (!isFinite(a) || !isFinite(b)) {
      throw new Error('Invalid number in subtraction');
    }
    return new Decimal(a).minus(b).toNumber();
  }

  /**
   * Multiply two numbers with precision
   */
  static multiply(a: number, b: number): number {
    if (!isFinite(a) || !isFinite(b)) {
      throw new Error('Invalid number in multiplication');
    }
    return new Decimal(a).times(b).toNumber();
  }

  /**
   * Divide a by b with precision
   * @throws Error if b is zero
   */
  static divide(a: number, b: number): number {
    if (b === 0 || !isFinite(b)) {
      throw new Error('Division by zero or invalid divisor');
    }
    if (!isFinite(a)) {
      throw new Error('Invalid dividend');
    }
    return new Decimal(a).div(b).toNumber();
  }

  /**
   * Calculate percentage of a number
   * @param amount The base amount
   * @param percentage The percentage (e.g., 12 for 12%)
   */
  static percentage(amount: number, percentage: number): number {
    return new Decimal(amount).times(percentage).div(100).toNumber();
  }

  /**
   * Round to specified decimal places
   * @param value The value to round
   * @param decimals Number of decimal places (default: 2)
   */
  static round(value: number, decimals: number = 2): number {
    return new Decimal(value).toDecimalPlaces(decimals).toNumber();
  }

  /**
   * Calculate sum of an array of numbers with precision
   */
  static sum(numbers: number[]): number {
    return numbers.reduce((sum, num) => Money.add(sum, num), 0);
  }

  /**
   * Calculate compound interest
   * FV = PV * (1 + r)^n
   * @param principal Initial amount
   * @param rate Annual interest rate as percentage (e.g., 12 for 12%)
   * @param years Time period in years
   */
  static compoundInterest(principal: number, rate: number, years: number): number {
    const rateDecimal = new Decimal(rate).div(100);
    const multiplier = new Decimal(1).plus(rateDecimal);
    const result = new Decimal(principal).times(multiplier.pow(years));
    return result.toNumber();
  }

  /**
   * Calculate SIP (Systematic Investment Plan) future value
   * FV = P × [(1 + r)^n - 1] / r × (1 + r)
   * @param monthlyInvestment Monthly SIP amount
   * @param annualRate Expected annual return rate as percentage
   * @param years Investment period in years
   */
  static sipFutureValue(monthlyInvestment: number, annualRate: number, years: number): number {
    const monthlyRate = new Decimal(annualRate).div(12).div(100);
    const months = new Decimal(years).times(12);

    // FV = P × [(1 + r)^n - 1] / r × (1 + r)
    const onePlusRate = new Decimal(1).plus(monthlyRate);
    const numerator = onePlusRate.pow(months).minus(1);
    const futureValue = new Decimal(monthlyInvestment).times(numerator).div(monthlyRate).times(onePlusRate);

    return futureValue.toNumber();
  }

  /**
   * Calculate yearly SIP future value
   * @param yearlyInvestment Yearly SIP amount
   * @param annualRate Expected annual return rate as percentage
   * @param years Investment period in years
   */
  static yearlySipFutureValue(yearlyInvestment: number, annualRate: number, years: number): number {
    const yearlyRate = new Decimal(annualRate).div(100);
    const onePlusRate = new Decimal(1).plus(yearlyRate);
    const numerator = onePlusRate.pow(years).minus(1);
    const futureValue = new Decimal(yearlyInvestment).times(numerator).div(yearlyRate).times(onePlusRate);

    return futureValue.toNumber();
  }

  /**
   * Calculate power with precision
   */
  static pow(base: number, exponent: number): number {
    return new Decimal(base).pow(exponent).toNumber();
  }

  /**
   * Calculate annualized return
   * Annualized Return = (1 + Total Return)^(1/years) - 1
   * @param totalReturn Total return as decimal (e.g., 0.5 for 50%)
   * @param years Time period in years
   */
  static annualizedReturn(totalReturn: number, years: number): number {
    if (years <= 0) {
      return 0;
    }
    const onePlusReturn = new Decimal(1).plus(totalReturn);
    const annualized = onePlusReturn.pow(new Decimal(1).div(years)).minus(1);
    return annualized.toNumber();
  }

  /**
   * Check if two monetary values are equal within tolerance
   * @param a First value
   * @param b Second value
   * @param tolerance Maximum difference considered equal (default: 0.01 = 1 paisa)
   */
  static equals(a: number, b: number, tolerance: number = 0.01): boolean {
    return Math.abs(a - b) < tolerance;
  }

  /**
   * Ensure value is non-negative
   */
  static max(value: number, minimum: number = 0): number {
    return Math.max(value, minimum);
  }
}

/**
 * Validate and parse monetary input
 * @param value Input string
 * @param fieldName Field name for error messages
 * @returns Parsed number or null if empty
 * @throws Error if invalid
 */
export function parseMoneyInput(value: string, fieldName: string = 'Value'): number | null {
  if (!value || value.trim() === '') {
    return null;
  }

  const parsed = Number(value);

  if (isNaN(parsed)) {
    throw new Error(`${fieldName} must be a valid number`);
  }

  if (!isFinite(parsed)) {
    throw new Error(`${fieldName} must be a finite number`);
  }

  if (parsed < 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }

  return parsed;
}

/**
 * Safe parse that returns default value instead of throwing
 * @param value Input string
 * @param defaultValue Value to return if invalid (default: 0)
 */
export function safeParseNumber(value: string, defaultValue: number = 0): number {
  if (!value || value.trim() === '') {
    return defaultValue;
  }

  const parsed = Number(value);

  if (isNaN(parsed) || !isFinite(parsed) || parsed < 0) {
    return defaultValue;
  }

  return parsed;
}

/**
 * Validate percentage input
 * @param value Input string
 * @param fieldName Field name for error messages
 * @param max Maximum allowed percentage
 */
export function parsePercentageInput(
  value: string,
  fieldName: string = 'Percentage',
  max: number = 1000,
): number | null {
  const parsed = parseMoneyInput(value, fieldName);

  if (parsed === null) {
    return null;
  }

  if (parsed > max) {
    throw new Error(`${fieldName} cannot exceed ${max}%`);
  }

  return parsed;
}
