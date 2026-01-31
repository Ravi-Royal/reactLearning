import { Money } from '@utils/financial';

/**
 * Calculate compound interest for a principal amount
 * FV = P × (1 + r)^t
 */
export const calculateCompoundInterest = (principal: number, rate: number, time: number): number => {
  return Money.compoundInterest(principal, rate, time);
};

/**
 * SIP calculation using annuity due formula (payment at beginning of period)
 * FV = P × [(1 + r)^n - 1] / r × (1 + r)
 * where r = monthly rate, n = months, P = monthly investment
 */
export const calculateSIPFutureValue = (monthlyInvestment: number, annualRate: number, years: number): number => {
  return Money.sipFutureValue(monthlyInvestment, annualRate, years);
};

/**
 * Yearly SIP calculation using annuity due formula (payment at beginning of period)
 * FV = P × [(1 + r)^n - 1] / r × (1 + r)
 * where r = annual rate, n = years, P = yearly investment
 */
export const calculateYearlySIPFutureValue = (yearlyInvestment: number, annualRate: number, years: number): number => {
  return Money.yearlySipFutureValue(yearlyInvestment, annualRate, years);
};

/**
 * Calculate how many months until balance reaches zero with monthly withdrawals
 */
export const calculateMonthsToZero = (
  initialAmount: number,
  monthlyWithdrawal: number,
  annualReturn: number,
  inflationRate: number = 0,
  applyInflationYears: number = 0,
): { years: number | null; months: number | null } => {
  if (monthlyWithdrawal <= 0) {
    return { years: null, months: null };
  }

  const monthlyRate = Money.divide(annualReturn, 1200); // annualReturn / 12 / 100
  const annualInflationRate = Money.divide(inflationRate, 100);
  let balance = initialAmount;
  let totalMonths = 0;
  let currentWithdrawal = monthlyWithdrawal;

  // If inflation starts from SIP start, apply initial inflation
  if (applyInflationYears > 0 && inflationRate > 0) {
    currentWithdrawal = Money.multiply(
      monthlyWithdrawal,
      Money.pow(Money.add(1, annualInflationRate), applyInflationYears),
    );
  }

  while (balance > 0 && totalMonths < 1200) {
    // Apply annual inflation AFTER first 12 months, then every 12 months
    if (inflationRate > 0 && totalMonths > 12 && (totalMonths - 1) % 12 === 0) {
      currentWithdrawal = Money.multiply(currentWithdrawal, Money.add(1, annualInflationRate));
    }

    // balance = balance * (1 + monthlyRate) - currentWithdrawal
    const interest = Money.multiply(balance, monthlyRate);
    balance = Money.add(balance, interest);
    balance = Money.subtract(balance, currentWithdrawal);
    totalMonths++;

    if (balance <= 0) {
      break;
    }
  }

  if (totalMonths >= 1200) {
    return { years: null, months: null };
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return { years, months };
};

/**
 * Calculate minimum SWP amount to sustain forever (principal remains intact)
 */
export const calculateMinSWP = (initialAmount: number, annualReturn: number): number => {
  const monthlyRate = Money.divide(annualReturn, 1200); // annualReturn / 12 / 100
  return Money.multiply(initialAmount, monthlyRate);
};
