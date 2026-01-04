/**
 * Calculates compound interest for lumpsum investments
 * @param principal - Initial investment amount
 * @param rate - Annual interest rate (percentage)
 * @param time - Time period in years
 * @returns Future value after compound interest
 */
export const calculateCompoundInterest = (
  principal: number,
  rate: number,
  time: number,
): number => {
  return principal * Math.pow(1 + rate / 100, time);
};

/**
 * Calculates future value of SIP (Systematic Investment Plan)
 * Uses month-by-month compounding
 * @param monthlyInvestment - Monthly SIP amount
 * @param annualRate - Expected annual return rate (percentage)
 * @param years - Investment period in years
 * @returns Future value of SIP
 */
export const calculateSIPFutureValue = (
  monthlyInvestment: number,
  annualRate: number,
  years: number,
): number => {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  const futureValue =
    monthlyInvestment *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
    (1 + monthlyRate);
  return futureValue;
};

/**
 * Calculates how many months until balance reaches zero with SWP
 * @param initialAmount - Starting corpus amount
 * @param monthlyWithdrawal - Monthly withdrawal amount
 * @param annualReturn - Expected annual return rate (percentage)
 * @returns Object with years and months until balance reaches zero, or null if sustainable
 */
export const calculateMonthsToZero = (
  initialAmount: number,
  monthlyWithdrawal: number,
  annualReturn: number,
): { years: number | null; months: number | null } => {
  if (monthlyWithdrawal <= 0) {
    return { years: null, months: null };
  }

  const monthlyRate = annualReturn / 12 / 100;
  let balance = initialAmount;
  let totalMonths = 0;

  // Limit to 100 years (1200 months) to avoid infinite loops
  while (balance > 0 && totalMonths < 1200) {
    balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
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
 * Calculates minimum sustainable monthly SWP amount
 * This is the amount that can be withdrawn indefinitely without depleting principal
 * @param initialAmount - Starting corpus amount
 * @param annualReturn - Expected annual return rate (percentage)
 * @returns Minimum sustainable monthly withdrawal amount
 */
export const calculateMinSWP = (
  initialAmount: number,
  annualReturn: number,
): number => {
  const monthlyRate = annualReturn / 12 / 100;
  return initialAmount * monthlyRate;
};
