import { useMemo, useState } from 'react';
import { safeParseNumber, Money } from '@utils/financial';
import type { YearlyBreakdown, BreakdownView } from '../types/MutualFundCalculator.types';

export const useYearlyBreakdown = (
  investmentType: 'sip' | 'yearly-sip' | 'lumpsum',
  sipAmount: string,
  lumpsumAmount: string,
  annualReturn: string,
  investmentPeriod: string,
  postInvestmentHoldingPeriod: string,
  oneTimeWithdrawal: string,
  swpAmount: string,
  swpPeriod: string,
  inflationRate: string,
  inflationStartFrom: 'current-year' | 'sip-start',
  breakdownView: BreakdownView,
) => {
  return useMemo<YearlyBreakdown[]>(() => {
    const returnRate = safeParseNumber(annualReturn, 0);
    const investYears = safeParseNumber(investmentPeriod, 0);
    const holdingYears = safeParseNumber(postInvestmentHoldingPeriod, 0);
    const withdrawal = safeParseNumber(oneTimeWithdrawal, 0);
    const swp = safeParseNumber(swpAmount, 0);
    const swpYears = safeParseNumber(swpPeriod, 0);

    if (returnRate < 0 || investYears <= 0) {
      return [];
    }

    const monthlyRate = Money.divide(returnRate, 1200);
    const breakdown: YearlyBreakdown[] = [];

    const monthsPerPeriod = breakdownView === 'monthly' ? 1 : breakdownView === 'quarterly' ? 3 : 12;
    const periodsPerYear = Money.divide(12, monthsPerPeriod);
    const maxMonths = 600;
    const maxPeriods = Math.floor(Money.divide(maxMonths, monthsPerPeriod));

    if (investmentType === 'sip') {
      const sip = safeParseNumber(sipAmount, 0);
      if (sip <= 0) {
        return [];
      }

      let balance = 0;
      let totalInvested = 0;
      let cumulativeInterest = 0;
      let periodCounter = 1;

      const totalInvestmentPeriods = Money.multiply(investYears, periodsPerYear);
      for (let i = 1; i <= totalInvestmentPeriods; i++) {
        const openingBalance = balance;
        let periodInvestment = 0;
        const startingBalance = balance;

        for (let month = 1; month <= monthsPerPeriod; month++) {
          balance = Money.add(balance, sip);
          const interest = Money.multiply(balance, monthlyRate);
          balance = Money.add(balance, interest);
          totalInvested = Money.add(totalInvested, sip);
          periodInvestment = Money.add(periodInvestment, sip);
        }

        const periodInterest = Money.subtract(Money.subtract(balance, startingBalance), periodInvestment);
        cumulativeInterest = Money.add(cumulativeInterest, periodInterest);

        breakdown.push({
          year: periodCounter++,
          invested: totalInvested,
          interest: cumulativeInterest,
          totalValue: balance,
          openingBalance,
          periodInvestment,
          periodInterest,
          closingBalance: balance,
        });
      }

      // Holding phase
      if (holdingYears > 0) {
        const totalHoldingPeriods = holdingYears * periodsPerYear;
        for (let i = 1; i <= totalHoldingPeriods; i++) {
          const openingBalance = balance;
          const startingBalance = balance;

          for (let month = 1; month <= monthsPerPeriod; month++) {
            balance = balance * (1 + monthlyRate);
          }

          const periodInterest = balance - startingBalance;
          cumulativeInterest += periodInterest;

          breakdown.push({
            year: periodCounter++,
            invested: totalInvested,
            interest: cumulativeInterest,
            totalValue: balance,
            openingBalance,
            periodInvestment: 0,
            periodInterest,
            closingBalance: balance,
          });
        }
      }

      // One-time withdrawal
      if (withdrawal > 0) {
        const openingBalance = balance;
        balance = Math.max(0, balance - withdrawal);

        breakdown.push({
          year: periodCounter++,
          invested: totalInvested,
          interest: cumulativeInterest,
          totalValue: balance,
          openingBalance,
          periodInvestment: 0,
          periodInterest: 0,
          closingBalance: balance,
          withdrawal: withdrawal,
        });
      }

      // SWP phase
      if (swp > 0 && swpYears > 0 && balance > 0) {
        const inflation = parseFloat(inflationRate) || 0;
        const annualInflationRate = inflation / 100;
        const yearsFromSipStart = inflationStartFrom === 'sip-start' ? investYears + holdingYears : 0;

        let currentSwpAmount = swp;
        if (inflationStartFrom === 'sip-start' && yearsFromSipStart > 0 && inflation > 0) {
          currentSwpAmount = swp * Math.pow(1 + annualInflationRate, yearsFromSipStart);
        }

        const totalSwpPeriods = Math.min(swpYears * periodsPerYear, maxPeriods - breakdown.length);
        for (let i = 1; i <= totalSwpPeriods; i++) {
          if (inflation > 0 && i > 1 && (i - 1) % periodsPerYear === 0) {
            currentSwpAmount = currentSwpAmount * (1 + annualInflationRate);
          }

          const openingBalance = balance;
          const startingBalance = balance;
          let periodWithdrawal = 0;

          for (let month = 1; month <= monthsPerPeriod; month++) {
            balance = balance * (1 + monthlyRate) - currentSwpAmount;
            periodWithdrawal += currentSwpAmount;
            if (balance <= 0) {
              balance = 0;
              break;
            }
          }

          const periodInterest = balance - startingBalance + periodWithdrawal;
          cumulativeInterest += periodInterest;

          breakdown.push({
            year: periodCounter++,
            invested: totalInvested,
            interest: cumulativeInterest,
            totalValue: balance,
            openingBalance,
            periodInvestment: 0,
            periodInterest,
            closingBalance: balance,
            withdrawal: periodWithdrawal,
          });

          if (balance <= 0) {
            break;
          }
        }
      }
    } else if (investmentType === 'yearly-sip') {
      const yearlySip = parseFloat(sipAmount);
      if (isNaN(yearlySip) || yearlySip <= 0) {
        return [];
      }

      let balance = 0;
      let totalInvested = 0;
      let cumulativeInterest = 0;
      let periodCounter = 1;

      const totalInvestmentPeriods = investYears * periodsPerYear;
      for (let i = 1; i <= totalInvestmentPeriods; i++) {
        const openingBalance = balance;
        let periodInvestment = 0;
        const startingBalance = balance;

        const isYearStart = (i - 1) % periodsPerYear === 0;
        if (isYearStart) {
          balance += yearlySip;
          totalInvested += yearlySip;
          periodInvestment = yearlySip;
        }

        for (let month = 1; month <= monthsPerPeriod; month++) {
          balance = balance * (1 + monthlyRate);
        }

        const periodInterest = balance - startingBalance - periodInvestment;
        cumulativeInterest += periodInterest;

        breakdown.push({
          year: periodCounter++,
          invested: totalInvested,
          interest: cumulativeInterest,
          totalValue: balance,
          openingBalance,
          periodInvestment,
          periodInterest,
          closingBalance: balance,
        });
      }

      // Similar holding, withdrawal, and SWP logic as SIP
      if (holdingYears > 0) {
        const totalHoldingPeriods = holdingYears * periodsPerYear;
        for (let i = 1; i <= totalHoldingPeriods; i++) {
          const openingBalance = balance;
          const startingBalance = balance;

          for (let month = 1; month <= monthsPerPeriod; month++) {
            balance = balance * (1 + monthlyRate);
          }

          const periodInterest = balance - startingBalance;
          cumulativeInterest += periodInterest;

          breakdown.push({
            year: periodCounter++,
            invested: totalInvested,
            interest: cumulativeInterest,
            totalValue: balance,
            openingBalance,
            periodInvestment: 0,
            periodInterest,
            closingBalance: balance,
          });
        }
      }

      if (withdrawal > 0) {
        const openingBalance = balance;
        balance = Math.max(0, balance - withdrawal);

        breakdown.push({
          year: periodCounter++,
          invested: totalInvested,
          interest: cumulativeInterest,
          totalValue: balance,
          openingBalance,
          periodInvestment: 0,
          periodInterest: 0,
          closingBalance: balance,
          withdrawal: withdrawal,
        });
      }

      if (swp > 0 && swpYears > 0 && balance > 0) {
        const inflation = parseFloat(inflationRate) || 0;
        const annualInflationRate = inflation / 100;
        const yearsFromSipStart = inflationStartFrom === 'sip-start' ? investYears + holdingYears : 0;

        let currentSwpAmount = swp;
        if (inflationStartFrom === 'sip-start' && yearsFromSipStart > 0 && inflation > 0) {
          currentSwpAmount = swp * Math.pow(1 + annualInflationRate, yearsFromSipStart);
        }

        const totalSwpPeriods = Math.min(swpYears * periodsPerYear, maxPeriods - breakdown.length);
        for (let i = 1; i <= totalSwpPeriods; i++) {
          if (inflation > 0 && i > 1 && (i - 1) % periodsPerYear === 0) {
            currentSwpAmount = currentSwpAmount * (1 + annualInflationRate);
          }

          const openingBalance = balance;
          const startingBalance = balance;
          let periodWithdrawal = 0;

          for (let month = 1; month <= monthsPerPeriod; month++) {
            balance = balance * (1 + monthlyRate) - currentSwpAmount;
            periodWithdrawal += currentSwpAmount;
            if (balance <= 0) {
              balance = 0;
              break;
            }
          }

          const periodInterest = balance - startingBalance + periodWithdrawal;
          cumulativeInterest += periodInterest;

          breakdown.push({
            year: periodCounter++,
            invested: totalInvested,
            interest: cumulativeInterest,
            totalValue: balance,
            openingBalance,
            periodInvestment: 0,
            periodInterest,
            closingBalance: balance,
            withdrawal: periodWithdrawal,
          });

          if (balance <= 0) {
            break;
          }
        }
      }
    } else if (investmentType === 'lumpsum') {
      const lumpsum = parseFloat(lumpsumAmount);
      if (isNaN(lumpsum) || lumpsum <= 0) {
        return [];
      }

      let balance = lumpsum;
      const totalInvested = lumpsum;
      let cumulativeInterest = 0;
      let periodCounter = 1;

      const openingBalance = 0;
      const startingBalance = balance;

      for (let month = 1; month <= monthsPerPeriod; month++) {
        balance = balance * (1 + monthlyRate);
      }

      const periodInterest = balance - startingBalance;
      cumulativeInterest += periodInterest;

      breakdown.push({
        year: periodCounter++,
        invested: totalInvested,
        interest: cumulativeInterest,
        totalValue: balance,
        openingBalance,
        periodInvestment: totalInvested,
        periodInterest,
        closingBalance: balance,
      });

      if (investYears > 1) {
        const remainingPeriods = (investYears - 1) * periodsPerYear;
        for (let i = 1; i <= remainingPeriods; i++) {
          const openingBalance = balance;
          const startingBalance = balance;

          for (let month = 1; month <= monthsPerPeriod; month++) {
            balance = balance * (1 + monthlyRate);
          }

          const periodInterest = balance - startingBalance;
          cumulativeInterest += periodInterest;

          breakdown.push({
            year: periodCounter++,
            invested: totalInvested,
            interest: cumulativeInterest,
            totalValue: balance,
            openingBalance,
            periodInvestment: 0,
            periodInterest,
            closingBalance: balance,
          });
        }
      }

      if (holdingYears > 0) {
        const totalHoldingPeriods = holdingYears * periodsPerYear;
        for (let i = 1; i <= totalHoldingPeriods; i++) {
          const openingBalance = balance;
          const startingBalance = balance;

          for (let month = 1; month <= monthsPerPeriod; month++) {
            balance = balance * (1 + monthlyRate);
          }

          const periodInterest = balance - startingBalance;
          cumulativeInterest += periodInterest;

          breakdown.push({
            year: periodCounter++,
            invested: totalInvested,
            interest: cumulativeInterest,
            totalValue: balance,
            openingBalance,
            periodInvestment: 0,
            periodInterest,
            closingBalance: balance,
          });
        }
      }

      if (withdrawal > 0) {
        const openingBalance = balance;
        balance = Math.max(0, balance - withdrawal);

        breakdown.push({
          year: periodCounter++,
          invested: totalInvested,
          interest: cumulativeInterest,
          totalValue: balance,
          openingBalance,
          periodInvestment: 0,
          periodInterest: 0,
          closingBalance: balance,
          withdrawal: withdrawal,
        });
      }

      if (swp > 0 && swpYears > 0 && balance > 0) {
        const inflation = parseFloat(inflationRate) || 0;
        const annualInflationRate = inflation / 100;
        const yearsFromSipStart = inflationStartFrom === 'sip-start' ? investYears + holdingYears : 0;

        let currentSwpAmount = swp;
        if (inflationStartFrom === 'sip-start' && yearsFromSipStart > 0 && inflation > 0) {
          currentSwpAmount = swp * Math.pow(1 + annualInflationRate, yearsFromSipStart);
        }

        const totalSwpPeriods = Math.min(swpYears * periodsPerYear, maxPeriods - breakdown.length);
        for (let i = 1; i <= totalSwpPeriods; i++) {
          if (inflation > 0 && i > 1 && (i - 1) % periodsPerYear === 0) {
            currentSwpAmount = currentSwpAmount * (1 + annualInflationRate);
          }

          const openingBalance = balance;
          const startingBalance = balance;
          let periodWithdrawal = 0;

          for (let month = 1; month <= monthsPerPeriod; month++) {
            balance = balance * (1 + monthlyRate) - currentSwpAmount;
            periodWithdrawal += currentSwpAmount;
            if (balance <= 0) {
              balance = 0;
              break;
            }
          }

          const periodInterest = balance - startingBalance + periodWithdrawal;
          cumulativeInterest += periodInterest;

          breakdown.push({
            year: periodCounter++,
            invested: totalInvested,
            interest: cumulativeInterest,
            totalValue: balance,
            openingBalance,
            periodInvestment: 0,
            periodInterest,
            closingBalance: balance,
            withdrawal: periodWithdrawal,
          });

          if (balance <= 0) {
            break;
          }
        }
      }
    }

    return breakdown;
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
    breakdownView,
  ]);
};

export const useBreakdownView = () => {
  return useState<BreakdownView>('yearly');
};
