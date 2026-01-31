import { useState, useMemo } from 'react';
import { safeParseNumber, Money } from '@utils/financial';
import {
  calculateCompoundInterest,
  calculateSIPFutureValue,
  calculateYearlySIPFutureValue,
  calculateMonthsToZero,
  calculateMinSWP,
} from '../helpers/calculations';
import type { CalculationResult } from '../types/MutualFundCalculator.types';

export const useMutualFundForm = () => {
  const [investmentType, setInvestmentType] = useState<'sip' | 'yearly-sip' | 'lumpsum'>('sip');
  const [sipAmount, setSipAmount] = useState<string>('');
  const [lumpsumAmount, setLumpsumAmount] = useState<string>('');
  const [annualReturn, setAnnualReturn] = useState<string>('');
  const [investmentPeriod, setInvestmentPeriod] = useState<string>('');
  const [postInvestmentHoldingPeriod, setPostInvestmentHoldingPeriod] = useState<string>('');
  const [oneTimeWithdrawal, setOneTimeWithdrawal] = useState<string>('');
  const [swpAmount, setSwpAmount] = useState<string>('');
  const [swpPeriod, setSwpPeriod] = useState<string>('');
  const [inflationRate, setInflationRate] = useState<string>('');
  const [inflationStartFrom, setInflationStartFrom] = useState<'current-year' | 'sip-start'>('current-year');

  // Compute result automatically using useMemo
  const result = useMemo<CalculationResult | null>(() => {
    const returnRate = safeParseNumber(annualReturn, 0);
    const investYears = safeParseNumber(investmentPeriod, 0);
    const holdingYears = safeParseNumber(postInvestmentHoldingPeriod, 0);
    const withdrawal = safeParseNumber(oneTimeWithdrawal, 0);
    const swp = safeParseNumber(swpAmount, 0);
    const swpYears = safeParseNumber(swpPeriod, 0);

    if (returnRate < 0 || investYears <= 0) {
      return null;
    }

    let accumulatedAmount = 0;
    let totalInvested = 0;

    // Step 1: Calculate corpus after investment period
    if (investmentType === 'sip') {
      const sip = safeParseNumber(sipAmount, 0);
      if (sip <= 0) {
        return null;
      }
      accumulatedAmount = calculateSIPFutureValue(sip, returnRate, investYears);
      totalInvested = Money.multiply(Money.multiply(sip, investYears), 12);
    } else if (investmentType === 'yearly-sip') {
      const yearlySip = safeParseNumber(sipAmount, 0);
      if (yearlySip <= 0) {
        return null;
      }
      accumulatedAmount = calculateYearlySIPFutureValue(yearlySip, returnRate, investYears);
      totalInvested = Money.multiply(yearlySip, investYears);
    } else {
      const lumpsum = safeParseNumber(lumpsumAmount, 0);
      if (lumpsum <= 0) {
        return null;
      }
      accumulatedAmount = calculateCompoundInterest(lumpsum, returnRate, investYears);
      totalInvested = lumpsum;
    }

    let currentBalance = accumulatedAmount;

    // Step 2: Apply post-investment holding period (corpus grows without withdrawals)
    if (holdingYears > 0) {
      currentBalance = calculateCompoundInterest(currentBalance, returnRate, holdingYears);
    }

    const corpusAfterHoldingPeriod = currentBalance;

    // Step 3: Apply one-time withdrawal if specified
    if (withdrawal > 0) {
      currentBalance = Money.max(Money.subtract(currentBalance, withdrawal), 0);
    }

    // For SWP Analysis: use balance after holding and withdrawal, but before SWP
    const balanceForSWPCalc = currentBalance;
    const minSWP = balanceForSWPCalc > 0 ? calculateMinSWP(balanceForSWPCalc, returnRate) : 0;

    // Calculate time to zero only if SWP exceeds minimum sustainable amount
    let yearsToZero: number | null = null;
    let monthsToZero: number | null = null;

    if (swp > 0 && balanceForSWPCalc > 0) {
      const inflation = safeParseNumber(inflationRate, 0);
      const annualInflationRate = Money.divide(inflation, 100);
      const yearsFromSipStart = inflationStartFrom === 'sip-start' ? Money.add(investYears, holdingYears) : 0;

      // Calculate the initial SWP amount (after applying inflation from SIP start if needed)
      let initialSwpAmount = swp;
      if (inflationStartFrom === 'sip-start' && yearsFromSipStart > 0 && inflation > 0) {
        initialSwpAmount = Money.multiply(swp, Money.pow(Money.add(1, annualInflationRate), yearsFromSipStart));
      }

      // Compare initial SWP amount with minimum sustainable amount
      if (initialSwpAmount > minSWP || inflation > 0) {
        const result = calculateMonthsToZero(balanceForSWPCalc, swp, returnRate, inflation, yearsFromSipStart);
        yearsToZero = result.years;
        monthsToZero = result.months;
      }
    }

    // Step 4: Apply SWP withdrawals for final balance (with inflation adjustment)
    let finalBalance = currentBalance;
    if (swp > 0 && swpYears > 0 && currentBalance > 0) {
      const monthlyRate = Money.divide(returnRate, 1200); // returnRate / 12 / 100
      const inflation = safeParseNumber(inflationRate, 0);
      const annualInflationRate = Money.divide(inflation, 100);
      const totalSwpMonths = Math.min(Money.multiply(swpYears, 12), 600);

      // Calculate total years passed from SIP start to SWP start (for inflation calculation)
      const yearsFromSipStart = inflationStartFrom === 'sip-start' ? Money.add(investYears, holdingYears) : 0;

      let currentSwpAmount = swp;
      // If calculating from SIP start, apply inflation for years already passed
      if (inflationStartFrom === 'sip-start' && yearsFromSipStart > 0 && inflation > 0) {
        currentSwpAmount = Money.multiply(swp, Money.pow(Money.add(1, annualInflationRate), yearsFromSipStart));
      }

      for (let month = 1; month <= totalSwpMonths; month++) {
        // Apply annual inflation AFTER first 12 months (at month 13, 25, 37...)
        if (inflation > 0 && month > 12 && (month - 1) % 12 === 0) {
          currentSwpAmount = Money.multiply(currentSwpAmount, Money.add(1, annualInflationRate));
        }

        // finalBalance = finalBalance * (1 + monthlyRate) - currentSwpAmount
        const interest = Money.multiply(finalBalance, monthlyRate);
        finalBalance = Money.add(finalBalance, interest);
        finalBalance = Money.subtract(finalBalance, currentSwpAmount);

        if (finalBalance <= 0) {
          finalBalance = 0;
          break;
        }
      }
    }

    return {
      corpusAfterInvestment: Money.max(accumulatedAmount, 0),
      corpusAfterHoldingPeriod: Money.max(corpusAfterHoldingPeriod, 0),
      finalBalance: Money.max(finalBalance, 0),
      totalInvested: Money.max(totalInvested, 0),
      totalReturns: Money.subtract(accumulatedAmount, totalInvested),
      yearsToZero,
      monthsToZero,
      minSWPToSustain: Money.max(minSWP, 0),
    };
  }, [
    investmentType,
    sipAmount,
    lumpsumAmount,
    annualReturn,
    investmentPeriod,
    postInvestmentHoldingPeriod,
    oneTimeWithdrawal,
    swpAmount,
    swpPeriod,
    inflationRate,
    inflationStartFrom,
  ]);

  const handleReset = () => {
    setSipAmount('');
    setLumpsumAmount('');
    setAnnualReturn('');
    setInvestmentPeriod('');
    setPostInvestmentHoldingPeriod('');
    setOneTimeWithdrawal('');
    setSwpAmount('');
    setSwpPeriod('');
    setInflationRate('');
    setInflationStartFrom('current-year');
  };

  // Prevent clearing values when switching investment type
  const handleInvestmentTypeChange = (type: 'sip' | 'yearly-sip' | 'lumpsum') => {
    if (type === 'lumpsum' && sipAmount && !lumpsumAmount) {
      setLumpsumAmount(sipAmount);
    } else if ((type === 'sip' || type === 'yearly-sip') && lumpsumAmount && !sipAmount) {
      setSipAmount(lumpsumAmount);
    }
    setInvestmentType(type);
  };

  return {
    // State
    investmentType,
    sipAmount,
    lumpsumAmount,
    annualReturn,
    investmentPeriod,
    postInvestmentHoldingPeriod,
    oneTimeWithdrawal,
    swpAmount,
    swpPeriod,
    inflationRate,
    inflationStartFrom,

    // Setters
    setSipAmount,
    setLumpsumAmount,
    setAnnualReturn,
    setInvestmentPeriod,
    setPostInvestmentHoldingPeriod,
    setOneTimeWithdrawal,
    setSwpAmount,
    setSwpPeriod,
    setInflationRate,
    setInflationStartFrom,

    // Handlers
    handleReset,
    handleInvestmentTypeChange,

    // Result
    result,
  };
};
