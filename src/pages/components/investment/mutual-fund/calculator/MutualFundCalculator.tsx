import Breadcrumbs from '@pages/navigation/Breadcrumbs';
import { Link } from 'react-router-dom';
import { useRef, useMemo, useState } from 'react';
import { feedback } from '@utils/userFeedback';
import { MUTUAL_FUND_CALCULATOR_TEXTS } from './constants/mutualFundCalculator.constants';
import { useMutualFundForm } from './hooks/useMutualFundForm';
import { useYearlyBreakdown, useBreakdownView } from './hooks/useYearlyBreakdown';
import { InvestmentInputs } from './components/InvestmentInputs';
import { InvestmentResult } from './components/InvestmentResult';
import { BreakdownTable } from './components/BreakdownTable';
import type { BreakdownView } from './types/MutualFundCalculator.types';

function MutualFundCalculator() {
  const formState = useMutualFundForm();
  const {
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
    handleReset,
    result,
  } = formState;

  const [breakdownView, setBreakdownView] = useBreakdownView();
  const [isResetting, setIsResetting] = useState(false);

  // Ref for scrolling to SWP start row
  const swpStartRowRef = useRef<HTMLTableRowElement>(null);

  // Calculate breakdown for table based on selected view
  const yearlyBreakdown = useYearlyBreakdown(
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
  );

  // Calculate SWP start index for scrolling
  const swpStartIndex = useMemo(() => {
    if (!result || parseFloat(swpAmount) <= 0) {
      return -1;
    }
    const investYears = parseInt(investmentPeriod || '0', 10);
    const holdingYears = parseInt(postInvestmentHoldingPeriod || '0', 10);
    return investYears + holdingYears;
  }, [result, swpAmount, investmentPeriod, postInvestmentHoldingPeriod]);

  const handleResetWithFeedback = () => {
    setIsResetting(true);
    handleReset();
    feedback.success.reset();
    setIsResetting(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Breadcrumbs />
      <div className="mb-4 sm:mb-6">
        <Link
          to="/investment/mutual-fund"
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs sm:text-sm font-medium inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 py-2 rounded-md transition-colors"
        >
          ← Back to Mutual Funds
        </Link>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          {MUTUAL_FUND_CALCULATOR_TEXTS.PAGE_TITLE}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Calculate SIP/Lumpsum returns and SWP sustainability</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InvestmentInputs formState={formState} isResetting={isResetting} onReset={handleResetWithFeedback} />
        {result && <InvestmentResult result={result} formState={formState} />}
      </div>

      {result && (
        <BreakdownTable
          yearlyBreakdown={yearlyBreakdown}
          swpStartIndex={swpStartIndex}
          swpStartRowRef={swpStartRowRef}
          breakdownView={breakdownView as BreakdownView}
          setBreakdownView={setBreakdownView}
          formState={formState}
        />
      )}
    </div>
  );
}

export default MutualFundCalculator;
