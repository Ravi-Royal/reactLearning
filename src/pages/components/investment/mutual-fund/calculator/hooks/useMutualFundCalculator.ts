import { useState, useRef, useCallback } from 'react';
import type { BreakdownView } from '../types/MutualFundCalculator.types';

export const useMutualFundCalculator = () => {
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
  const [breakdownView, setBreakdownView] = useState<BreakdownView>('yearly');

  const swpStartRowRef = useRef<HTMLTableRowElement | null>(null);

  const handleReset = useCallback(() => {
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
  }, []);

  const handleInvestmentTypeChange = useCallback(
    (type: 'sip' | 'yearly-sip' | 'lumpsum') => {
      if (type === 'lumpsum' && sipAmount && !lumpsumAmount) {
        setLumpsumAmount(sipAmount);
      } else if ((type === 'sip' || type === 'yearly-sip') && lumpsumAmount && !sipAmount) {
        setSipAmount(lumpsumAmount);
      }
      setInvestmentType(type);
    },
    [sipAmount, lumpsumAmount],
  );

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
    breakdownView,
    swpStartRowRef,
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
    setBreakdownView,
    // Handlers
    handleReset,
    handleInvestmentTypeChange,
  };
};
