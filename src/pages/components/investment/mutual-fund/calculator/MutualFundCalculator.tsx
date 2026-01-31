import Breadcrumbs from '@pages/navigation/Breadcrumbs';
import { Link } from 'react-router-dom';
import { useRef, useMemo, useState } from 'react';
import { formatCurrency } from '@utils/currency';
import { feedback } from '@utils/userFeedback';
import { MUTUAL_FUND_CALCULATOR_TEXTS } from './constants/mutualFundCalculator.constants';
import { useMutualFundForm } from './hooks/useMutualFundForm';
import { useYearlyBreakdown, useBreakdownView } from './hooks/useYearlyBreakdown';

function MutualFundCalculator() {
  // Use custom hooks for form state and calculations
  const formState = useMutualFundForm();
  const {
    investmentType,
    handleInvestmentTypeChange,
    sipAmount,
    setSipAmount,
    lumpsumAmount,
    setLumpsumAmount,
    annualReturn,
    setAnnualReturn,
    investmentPeriod,
    setInvestmentPeriod,
    postInvestmentHoldingPeriod,
    setPostInvestmentHoldingPeriod,
    oneTimeWithdrawal,
    setOneTimeWithdrawal,
    swpAmount,
    setSwpAmount,
    swpPeriod,
    setSwpPeriod,
    inflationRate,
    setInflationRate,
    inflationStartFrom,
    setInflationStartFrom,
    handleReset,
    result,
  } = formState;
  const [breakdownView, setBreakdownView] = useBreakdownView();
  const [isResetting, setIsResetting] = useState(false);

  // Ref for scrolling to SWP start row
  const swpStartRowRef = useRef<HTMLTableRowElement>(null);

  // Calculate breakdown for table based on selected view
  const yearlyBreakdown = useYearlyBreakdown(
    formState.investmentType,
    formState.sipAmount,
    formState.lumpsumAmount,
    formState.annualReturn,
    formState.investmentPeriod,
    formState.postInvestmentHoldingPeriod,
    formState.oneTimeWithdrawal,
    formState.swpAmount,
    formState.swpPeriod,
    formState.inflationRate,
    formState.inflationStartFrom,
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

  // Enhanced reset handler with feedback
  const handleResetWithFeedback = () => {
    setIsResetting(true);
    setTimeout(() => {
      handleReset();
      feedback.success.reset();
      setIsResetting(false);
    }, 300);
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
        <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-lg shadow-lg p-4 sm:p-6 border-2 border-purple-200">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            💰 Investment Details
          </h2>

          <div className="mb-4">
            <fieldset>
              <legend className="block text-sm font-medium text-purple-700 mb-2">Investment Type</legend>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="sip"
                    checked={investmentType === 'sip'}
                    onChange={() => handleInvestmentTypeChange('sip')}
                    className="mr-2"
                  />
                  <span className="text-sm">SIP (Monthly)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="yearly-sip"
                    checked={investmentType === 'yearly-sip'}
                    onChange={() => handleInvestmentTypeChange('yearly-sip')}
                    className="mr-2"
                  />
                  <span className="text-sm">SIP (Yearly)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="lumpsum"
                    checked={investmentType === 'lumpsum'}
                    onChange={() => handleInvestmentTypeChange('lumpsum')}
                    className="mr-2"
                  />
                  <span className="text-sm">Lumpsum</span>
                </label>
              </div>
            </fieldset>
          </div>

          {investmentType === 'sip' || investmentType === 'yearly-sip' ? (
            <div className="mb-4">
              <label htmlFor="sip-amount" className="block text-sm font-medium text-purple-700 mb-2">
                💵 {investmentType === 'sip' ? 'Monthly' : 'Yearly'} SIP Amount (₹)
              </label>
              <input
                id="sip-amount"
                type="number"
                value={sipAmount}
                onChange={(e) => setSipAmount(e.target.value)}
                placeholder={
                  investmentType === 'sip'
                    ? MUTUAL_FUND_CALCULATOR_TEXTS.SIP_INPUTS.MONTHLY_AMOUNT_PLACEHOLDER
                    : MUTUAL_FUND_CALCULATOR_TEXTS.SIP_INPUTS.YEARLY_AMOUNT_PLACEHOLDER
                }
                step="1"
                min="0"
                className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label htmlFor="lumpsum-amount" className="block text-sm font-medium text-purple-700 mb-2">
                💰 Lumpsum Amount (₹)
              </label>
              <input
                id="lumpsum-amount"
                type="number"
                value={lumpsumAmount}
                onChange={(e) => setLumpsumAmount(e.target.value)}
                placeholder={MUTUAL_FUND_CALCULATOR_TEXTS.LUMPSUM_INPUTS.INVESTMENT_AMOUNT_PLACEHOLDER}
                step="1"
                min="0"
                className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="annual-return" className="block text-sm font-medium text-purple-700 mb-2">
              📈 Expected Annual Return (%)
            </label>
            <input
              id="annual-return"
              type="number"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
              placeholder={MUTUAL_FUND_CALCULATOR_TEXTS.COMMON_INPUTS.ANNUAL_RETURN_PLACEHOLDER}
              step="1"
              min="0"
              className="w-full px-3 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="investment-period" className="block text-sm font-medium text-purple-700 mb-2">
              ⏱️ Investment Period (Years)
            </label>
            <input
              id="investment-period"
              type="number"
              value={investmentPeriod}
              onChange={(e) => setInvestmentPeriod(e.target.value)}
              placeholder={MUTUAL_FUND_CALCULATOR_TEXTS.COMMON_INPUTS.INVESTMENT_PERIOD_PLACEHOLDER}
              step="1"
              min="0"
              className="w-full px-3 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          <div className="border-t-2 border-teal-200 pt-4 mt-4 bg-teal-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 rounded-lg">
            <h3 className="text-md font-semibold text-teal-700 mb-3">🕐 Post-Investment Holding Period - Optional</h3>
            <p className="text-xs text-teal-600 mb-3">
              After investment period ends, let your corpus grow without any withdrawals
            </p>

            <div className="mb-4">
              <label htmlFor="post-holding-period" className="block text-sm font-medium text-teal-700 mb-2">
                Post-Investment Holding Period (Years)
              </label>
              <input
                id="post-holding-period"
                type="number"
                value={postInvestmentHoldingPeriod}
                onChange={(e) => setPostInvestmentHoldingPeriod(e.target.value)}
                placeholder={MUTUAL_FUND_CALCULATOR_TEXTS.OPTIONAL_INPUTS.POST_INVESTMENT_HOLDING_PLACEHOLDER}
                step="1"
                min="0"
                className="w-full px-3 py-2 border-2 border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
              />
              <p className="text-xs text-teal-600 mt-1">
                Years to hold before starting withdrawals (corpus continues to grow)
              </p>
            </div>
          </div>

          <div className="border-t-2 border-indigo-200 pt-4 mt-4 bg-indigo-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 rounded-lg">
            <h3 className="text-md font-semibold text-indigo-700 mb-3">💰 One-Time Withdrawal - Optional</h3>
            <p className="text-xs text-indigo-600 mb-3">Withdraw a lump sum amount before starting SWP</p>

            <div className="mb-4">
              <label htmlFor="one-time-withdrawal" className="block text-sm font-medium text-indigo-700 mb-2">
                One-Time Withdrawal Amount (₹)
              </label>
              <input
                id="one-time-withdrawal"
                type="number"
                value={oneTimeWithdrawal}
                onChange={(e) => setOneTimeWithdrawal(e.target.value)}
                placeholder={MUTUAL_FUND_CALCULATOR_TEXTS.OPTIONAL_INPUTS.ONE_TIME_WITHDRAWAL_PLACEHOLDER}
                step="1"
                min="0"
                className="w-full px-3 py-2 border-2 border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
              <p className="text-xs text-indigo-600 mt-1">
                Amount to withdraw after holding period (before SWP starts)
              </p>
            </div>
          </div>

          <div className="border-t-2 border-orange-200 pt-4 mt-4 bg-orange-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 rounded-lg">
            <h3 className="text-md font-semibold text-orange-700 mb-3">
              💸 Systematic Withdrawal Plan (SWP) - Optional
            </h3>
            <p className="text-xs text-orange-600 mb-3">Set up regular monthly withdrawals after holding period</p>

            <div className="mb-4">
              <label htmlFor="swp-amount" className="block text-sm font-medium text-orange-700 mb-2">
                Monthly SWP Amount (₹)
              </label>
              <input
                id="swp-amount"
                type="number"
                value={swpAmount}
                onChange={(e) => setSwpAmount(e.target.value)}
                placeholder="e.g., 20000"
                step="1"
                min="0"
                className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="swp-period" className="block text-sm font-medium text-orange-700 mb-2">
                SWP Duration (Years)
              </label>
              <input
                id="swp-period"
                type="number"
                value={swpPeriod}
                onChange={(e) => setSwpPeriod(e.target.value)}
                placeholder="e.g., 20"
                step="1"
                min="0"
                className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              />
              <p className="text-xs text-orange-600 mt-1">How many years to continue monthly withdrawals</p>
            </div>

            <div className="mb-4">
              <label htmlFor="inflation-rate" className="block text-sm font-medium text-orange-700 mb-2">
                📊 Inflation Rate (%) - Optional
              </label>
              <input
                id="inflation-rate"
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                placeholder="e.g., 6"
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              />
              <p className="text-xs text-orange-600 mt-1">SWP amount will increase annually by this rate</p>
            </div>

            <div className="mb-4">
              <fieldset>
                <legend className="block text-sm font-medium text-orange-700 mb-2">
                  Inflation Calculation Start From
                </legend>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="current-year"
                      checked={inflationStartFrom === 'current-year'}
                      onChange={(e) => setInflationStartFrom(e.target.value as 'current-year' | 'sip-start')}
                      className="mr-2"
                    />
                    <span className="text-sm">Current Year (SWP Start)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="sip-start"
                      checked={inflationStartFrom === 'sip-start'}
                      onChange={(e) => setInflationStartFrom(e.target.value as 'current-year' | 'sip-start')}
                      className="mr-2"
                    />
                    <span className="text-sm">SIP Start Year</span>
                  </label>
                </div>
              </fieldset>
              <p className="text-xs text-orange-600 mt-1">
                Choose when to start calculating inflation: from when SWP begins or from when SIP investment started
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleResetWithFeedback}
              disabled={isResetting}
              className={`w-full px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                isResetting ? 'opacity-70 cursor-not-allowed' : 'hover:from-red-600 hover:to-pink-600'
              }`}
            >
              {isResetting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Resetting...
                </>
              ) : (
                <>🔄 Reset All</>
              )}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-gradient-to-br from-green-50 via-white to-teal-50 rounded-lg shadow-lg p-4 sm:p-6 border-2 border-green-200">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
              📊 Calculation Results
            </h2>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200 shadow-sm">
                <div className="text-sm text-blue-700 font-medium mb-1">💵 Total Invested</div>
                <div className="text-2xl font-bold text-blue-700">{formatCurrency(result.totalInvested)}</div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-2 border-green-200 shadow-sm">
                <div className="text-sm text-green-700 font-medium mb-1">📈 Total Returns</div>
                <div className="text-2xl font-bold text-green-700">{formatCurrency(result.totalReturns)}</div>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-lg border-2 border-teal-200 shadow-sm">
                <div className="text-sm text-teal-700 font-medium mb-1">🎯 Corpus After Investment</div>
                <div className="text-2xl font-bold text-teal-700">{formatCurrency(result.corpusAfterInvestment)}</div>
                <div className="text-xs text-teal-600 mt-1">Amount accumulated at the end of investment period</div>
              </div>

              {parseFloat(postInvestmentHoldingPeriod) > 0 && (
                <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 p-4 rounded-lg border-2 border-cyan-200 shadow-sm">
                  <div className="text-sm text-cyan-700 font-medium mb-1">🕐 Corpus After Holding Period</div>
                  <div className="text-2xl font-bold text-cyan-700">
                    {formatCurrency(result.corpusAfterHoldingPeriod)}
                  </div>
                  <div className="text-xs text-cyan-600 mt-1">
                    Amount after {postInvestmentHoldingPeriod} years of holding (compounded growth)
                  </div>
                </div>
              )}

              {parseFloat(swpAmount) > 0 && parseFloat(swpPeriod) > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border-2 border-purple-200 shadow-sm">
                  <div className="text-sm text-purple-700 font-medium mb-1">💰 Final Balance (After SWP)</div>
                  <div className="text-2xl font-bold text-purple-700">{formatCurrency(result.finalBalance)}</div>
                  <div className="text-xs text-purple-600 mt-1">
                    Balance remaining after {swpPeriod} years of withdrawals
                  </div>
                </div>
              )}

              {parseFloat(swpAmount) > 0 && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-md font-semibold text-gray-800 mb-3">SWP Analysis</h3>
                    {parseFloat(inflationRate) > 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-3">
                        <div className="flex items-start gap-2">
                          <svg
                            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-blue-800">
                              Inflation Applied: {inflationRate}% annually
                            </div>
                            <div className="text-xs text-blue-700 mt-1">
                              SWP amount increases each year to account for inflation, starting from{' '}
                              {inflationStartFrom === 'current-year' ? 'when SWP begins' : 'SIP start year'}.
                            </div>
                            {(() => {
                              const swp = parseFloat(swpAmount);
                              const inflation = parseFloat(inflationRate) / 100;
                              const investYears = parseFloat(investmentPeriod) || 0;
                              const holdingYears = parseFloat(postInvestmentHoldingPeriod) || 0;
                              const swpYears = parseFloat(swpPeriod) || 0;
                              const yearsFromSipStart =
                                inflationStartFrom === 'sip-start' ? investYears + holdingYears : 0;

                              const initialSwp =
                                inflationStartFrom === 'sip-start' && yearsFromSipStart > 0
                                  ? swp * Math.pow(1 + inflation, yearsFromSipStart)
                                  : swp;

                              const finalSwp = initialSwp * Math.pow(1 + inflation, swpYears - 1);

                              return (
                                <>
                                  {inflationStartFrom === 'sip-start' && yearsFromSipStart > 0 && (
                                    <div className="bg-amber-50 border border-amber-300 rounded p-2 mt-2 mb-2">
                                      <div className="text-xs font-semibold text-amber-800 mb-1">
                                        💡 Understanding "SIP Start Year" Mode:
                                      </div>
                                      <div className="text-xs text-amber-700 space-y-1">
                                        <div>
                                          • Your input:{' '}
                                          <span className="font-semibold">{formatCurrency(swp)}/month</span> represents
                                          the value in <span className="font-semibold">today's money</span> (at SIP
                                          start)
                                        </div>
                                        <div>
                                          • After {yearsFromSipStart} years of {inflationRate}% inflation, this equals{' '}
                                          <span className="font-semibold">{formatCurrency(initialSwp)}/month</span> when
                                          SWP begins
                                        </div>
                                        <div>
                                          • This ensures your withdrawals maintain the same purchasing power throughout
                                        </div>

                                        {(() => {
                                          const sustainableInTodaysTerms =
                                            result.minSWPToSustain / Math.pow(1 + inflation, yearsFromSipStart);
                                          const currentSwpValue = parseFloat(swpAmount);
                                          const isOverSustainable = currentSwpValue > sustainableInTodaysTerms;

                                          return (
                                            <div
                                              className={`mt-2 pt-2 border-t ${isOverSustainable ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'} rounded p-2`}
                                            >
                                              <div className="text-xs font-bold">
                                                {isOverSustainable ? '⚠️ Current Entry' : '✅ Sustainable Entry'}:
                                              </div>
                                              <div className="text-xs mt-1">
                                                • To sustain forever: Enter max{' '}
                                                <span className="font-bold text-green-700">
                                                  {formatCurrency(sustainableInTodaysTerms)}
                                                </span>
                                              </div>
                                              <div className="text-xs">
                                                • You entered:{' '}
                                                <span
                                                  className={`font-bold ${isOverSustainable ? 'text-red-700' : 'text-green-700'}`}
                                                >
                                                  {formatCurrency(currentSwpValue)}
                                                </span>
                                                {isOverSustainable && (
                                                  <span className="text-red-700">
                                                    {' '}
                                                    (Exceeds sustainable by{' '}
                                                    {formatCurrency(currentSwpValue - sustainableInTodaysTerms)})
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })()}
                                      </div>
                                    </div>
                                  )}
                                  <div className="text-xs text-blue-600 mt-2 space-y-1">
                                    <div>
                                      • {inflationStartFrom === 'sip-start' ? 'Actual first' : 'Initial'} monthly
                                      withdrawal: <span className="font-semibold">{formatCurrency(initialSwp)}</span>
                                    </div>
                                    <div>
                                      • Final monthly withdrawal (Year {swpYears}):{' '}
                                      <span className="font-semibold">{formatCurrency(finalSwp)}</span>
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Time Until Balance Reaches Zero</div>
                    {result.yearsToZero !== null ? (
                      <div className="text-xl font-bold text-orange-600">
                        {result.yearsToZero} years {result.monthsToZero} months
                      </div>
                    ) : (
                      <div className="text-xl font-bold text-green-600">Balance will never reach zero! 🎉</div>
                    )}
                  </div>

                  <div className="bg-teal-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Minimum Monthly SWP (To Sustain Forever)</div>
                    <div className="text-xl font-bold text-teal-600">{formatCurrency(result.minSWPToSustain)}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      {parseFloat(inflationRate) > 0
                        ? 'This is the maximum initial monthly withdrawal that keeps your corpus stable (interest = withdrawal).'
                        : 'This is the maximum amount you can withdraw monthly without depleting your principal.'}
                    </div>
                    {parseFloat(inflationRate) > 0 && (
                      <>
                        {inflationStartFrom === 'sip-start' &&
                          parseFloat(investmentPeriod) > 0 &&
                          parseFloat(postInvestmentHoldingPeriod) >= 0 && (
                            <div className="bg-blue-50 border border-blue-300 rounded p-2 mt-2">
                              <div className="text-xs font-semibold text-blue-800 mb-1">
                                💡 In "SIP Start Year" Mode:
                              </div>
                              <div className="text-xs text-blue-700 space-y-1">
                                {(() => {
                                  const inflation = parseFloat(inflationRate) / 100;
                                  const investYears = parseFloat(investmentPeriod) || 0;
                                  const holdingYears = parseFloat(postInvestmentHoldingPeriod) || 0;
                                  const yearsFromSipStart = investYears + holdingYears;
                                  const minSwpInTodaysTerms =
                                    result.minSWPToSustain / Math.pow(1 + inflation, yearsFromSipStart);

                                  return (
                                    <>
                                      <div>
                                        • Sustainable withdrawal in <span className="font-semibold">today's terms</span>
                                        : {formatCurrency(minSwpInTodaysTerms)}/month
                                      </div>
                                      <div>
                                        • This grows to{' '}
                                        <span className="font-semibold">
                                          {formatCurrency(result.minSWPToSustain)}/month
                                        </span>{' '}
                                        when SWP starts (after {yearsFromSipStart} years)
                                      </div>
                                      <div>• Then increases {inflationRate}% annually to maintain purchasing power</div>
                                      <div className="mt-2 pt-2 border-t border-blue-300">
                                        <div className="font-semibold text-blue-900">📝 To sustain forever, enter:</div>
                                        <div className="bg-white rounded px-2 py-1 mt-1 border border-blue-400">
                                          <span className="font-bold text-green-700">
                                            {formatCurrency(minSwpInTodaysTerms)}
                                          </span>{' '}
                                          in "Monthly SWP Amount" field
                                        </div>
                                        <div className="text-xs mt-1 italic">
                                          This will be inflation-adjusted to {formatCurrency(result.minSWPToSustain)}
                                          /month when SWP starts
                                        </div>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          )}
                        {inflationStartFrom === 'current-year' && (
                          <div className="text-xs text-amber-600 mt-2">
                            <div>⚠️ Important: With {inflationRate}% inflation growing each year:</div>
                            <div className="mt-1">
                              • Sustainable starting amount ≈{' '}
                              {formatCurrency(result.minSWPToSustain * (1 - parseFloat(inflationRate) / 100))}/month
                            </div>
                            <div>
                              • Your corpus will slowly deplete if you start with{' '}
                              {formatCurrency(result.minSWPToSustain)}/month and apply inflation
                            </div>
                            <div className="mt-2 pt-2 border-t border-amber-400">
                              <div className="font-semibold text-amber-900">
                                📝 To sustain forever, enter approximately:
                              </div>
                              <div className="bg-white rounded px-2 py-1 mt-1 border border-amber-500">
                                <span className="font-bold text-green-700">
                                  {formatCurrency(result.minSWPToSustain * (1 - parseFloat(inflationRate) / 100))}
                                </span>{' '}
                                in "Monthly SWP Amount" field
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {result.yearsToZero !== null && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <div className="text-sm font-semibold text-red-800">Warning</div>
                          <div className="text-xs text-red-700 mt-1">
                            Your current SWP{parseFloat(inflationRate) > 0 ? ' (with inflation adjustments)' : ''}{' '}
                            exceeds the sustainable amount. Your balance will reach zero in {result.yearsToZero} years{' '}
                            {result.monthsToZero} months.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.yearsToZero === null && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <div className="text-sm font-semibold text-green-800">Sustainable Plan</div>
                          <div className="text-xs text-green-700 mt-1">
                            Your SWP{parseFloat(inflationRate) > 0 ? ' (even with inflation adjustments)' : ''} is
                            within sustainable limits. Your balance will grow or remain stable!
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 How it works</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>
            • <strong>SIP:</strong> Invest a fixed amount monthly. Returns compound monthly based on annual rate.
          </li>
          <li>
            • <strong>Lumpsum:</strong> One-time investment that grows with compound interest.
          </li>
          <li>
            • <strong>SWP:</strong> Systematic Withdrawal Plan - withdraw fixed amount monthly from accumulated corpus.
          </li>
          <li>
            • <strong>Minimum SWP:</strong> Maximum sustainable withdrawal (equals monthly returns, keeping principal
            intact).
          </li>
          <li>• Calculations assume returns are reinvested and rate remains constant.</li>
        </ul>
      </div>

      {yearlyBreakdown.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Period-by-Period Breakdown</h2>

            <div className="flex gap-2 items-center">
              {swpStartIndex !== -1 && (
                <button
                  className="px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors border border-orange-600"
                  onClick={() => {
                    setTimeout(() => {
                      swpStartRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 0);
                  }}
                >
                  Jump to SWP Start
                </button>
              )}
              <button
                onClick={() => setBreakdownView('monthly')}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                  breakdownView === 'monthly'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBreakdownView('quarterly')}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                  breakdownView === 'quarterly'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Quarterly
              </button>
              <button
                onClick={() => setBreakdownView('yearly')}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                  breakdownView === 'yearly'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[500px] relative">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="p-2 sm:p-3 text-left font-semibold text-gray-700 bg-gray-100">
                    {breakdownView === 'monthly' ? 'Month' : breakdownView === 'quarterly' ? 'Quarter' : 'Year'}
                  </th>
                  <th className="p-2 sm:p-3 text-right font-semibold text-gray-700 bg-gray-100">Opening Balance</th>
                  <th className="p-2 sm:p-3 text-right font-semibold text-gray-700 bg-gray-100">Period Investment</th>
                  <th className="p-2 sm:p-3 text-right font-semibold text-gray-700 bg-gray-100">Period Interest</th>
                  {yearlyBreakdown.some((row) => row.withdrawal) && (
                    <th className="p-2 sm:p-3 text-right font-semibold text-gray-700 bg-gray-100">Withdrawal</th>
                  )}
                  <th className="p-2 sm:p-3 text-right font-semibold text-gray-700 bg-gray-100">Closing Balance</th>
                  <th className="p-2 sm:p-3 text-right font-semibold text-gray-700 bg-gray-100">Total Invested</th>
                  <th className="p-2 sm:p-3 text-right font-semibold text-gray-700 bg-gray-100">Total Interest</th>
                  <th className="p-2 sm:p-3 text-right font-semibold text-gray-700 bg-gray-100">Value at Term End</th>
                </tr>
              </thead>
              <tbody>
                {yearlyBreakdown.map((row, index) => {
                  const investYears = parseFloat(investmentPeriod) || 0;
                  const holdingYears = parseFloat(postInvestmentHoldingPeriod) || 0;
                  const periodsPerYear = breakdownView === 'monthly' ? 12 : breakdownView === 'quarterly' ? 4 : 1;
                  const investPeriods = investYears * periodsPerYear;
                  const holdingPeriods = holdingYears * periodsPerYear;

                  const isInvestmentPhase = index < investPeriods;
                  const isHoldingPhase = index >= investPeriods && index < investPeriods + holdingPeriods;
                  const isWithdrawalPhase = row.withdrawal !== undefined && row.withdrawal > 0;
                  const isLastYear = index === yearlyBreakdown.length - 1;

                  // Attach ref to first SWP row
                  const rowProps = index === swpStartIndex && isWithdrawalPhase ? { ref: swpStartRowRef } : {};

                  return (
                    <tr
                      key={row.year}
                      {...rowProps}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        isWithdrawalPhase
                          ? 'bg-orange-50'
                          : isHoldingPhase
                            ? 'bg-teal-50'
                            : isInvestmentPhase
                              ? 'bg-blue-50'
                              : ''
                      } ${isLastYear ? 'font-semibold bg-purple-50' : ''}`}
                    >
                      <td className="p-2 sm:p-3 text-left">
                        <span
                          className={
                            isWithdrawalPhase
                              ? 'text-orange-700'
                              : isHoldingPhase
                                ? 'text-teal-700'
                                : isInvestmentPhase
                                  ? 'text-blue-700'
                                  : 'text-gray-800'
                          }
                        >
                          {row.year}
                          {isHoldingPhase && <span className="text-xs ml-1">(Holding)</span>}
                          {isWithdrawalPhase && <span className="text-xs ml-1">(SWP)</span>}
                          {row.withdrawal && !isWithdrawalPhase && <span className="text-xs ml-1">(Withdrawal)</span>}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 text-right text-gray-700">{formatCurrency(row.openingBalance)}</td>
                      <td className="p-2 sm:p-3 text-right text-indigo-700">
                        {row.periodInvestment > 0 ? formatCurrency(row.periodInvestment) : '-'}
                      </td>
                      <td className="p-2 sm:p-3 text-right text-green-600">{formatCurrency(row.periodInterest)}</td>
                      {yearlyBreakdown.some((r) => r.withdrawal) && (
                        <td className="p-2 sm:p-3 text-right text-orange-700">
                          {row.withdrawal ? formatCurrency(row.withdrawal) : '-'}
                        </td>
                      )}
                      <td className="p-2 sm:p-3 text-right font-semibold text-purple-700">
                        {formatCurrency(row.closingBalance)}
                      </td>
                      <td className="p-2 sm:p-3 text-right text-blue-700">{formatCurrency(row.invested)}</td>
                      <td className="p-2 sm:p-3 text-right text-green-700">{formatCurrency(row.interest)}</td>
                      <td className="p-2 sm:p-3 text-right text-teal-700">
                        {row.periodInvestment > 0 && !isWithdrawalPhase
                          ? (() => {
                              const annualRate = parseFloat(annualReturn) || 0;
                              const monthsPerPeriod =
                                breakdownView === 'monthly' ? 1 : breakdownView === 'quarterly' ? 3 : 12;
                              const totalInvestmentPeriods =
                                (parseFloat(investmentPeriod) || 0) * (12 / monthsPerPeriod);
                              const periodsCompleted = index + 1;
                              const remainingPeriods = Math.max(0, totalInvestmentPeriods - periodsCompleted);
                              const remainingMonths = remainingPeriods * monthsPerPeriod;
                              const monthlyRate = annualRate / 12 / 100;
                              const fv = row.periodInvestment * Math.pow(1 + monthlyRate, remainingMonths);
                              return formatCurrency(fv);
                            })()
                          : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-2 border-gray-300 shadow-sm sticky bottom-0 z-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="text-gray-600 mb-1">Total Periods</div>
                <div className="font-semibold text-gray-800">{yearlyBreakdown.length}</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Total Invested</div>
                <div className="font-semibold text-blue-700">
                  {formatCurrency(yearlyBreakdown[yearlyBreakdown.length - 1]?.invested || 0)}
                </div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Total Interest</div>
                <div className="font-semibold text-green-700">
                  {formatCurrency(yearlyBreakdown[yearlyBreakdown.length - 1]?.interest || 0)}
                </div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Final Value</div>
                <div className="font-semibold text-purple-700">
                  {formatCurrency(yearlyBreakdown[yearlyBreakdown.length - 1]?.totalValue || 0)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-600 space-y-2">
            <p>
              💡 <strong>Investment Phase:</strong> Blue background rows show accumulation periods.
              {parseFloat(postInvestmentHoldingPeriod) > 0 && (
                <span>
                  {' '}
                  <strong>Holding Phase:</strong> Teal background rows show post-investment holding periods.
                </span>
              )}
              {yearlyBreakdown.some((row) => row.withdrawal && row.withdrawal > 0) && (
                <span>
                  {' '}
                  <strong>SWP Phase:</strong> Orange background rows show SWP withdrawal periods.
                </span>
              )}
              {yearlyBreakdown.some((row) => row.withdrawal && row.withdrawal < 0) && (
                <span>
                  {' '}
                  <strong>One-time Withdrawal:</strong> Rows with withdrawal amounts show lump sum withdrawals.
                </span>
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div>
                <strong>Opening Balance:</strong> Balance at the start of period
              </div>
              <div>
                <strong>Period Investment:</strong> Amount invested during this period
              </div>
              <div>
                <strong>Period Interest:</strong> Interest earned during this period only
              </div>
              <div>
                <strong>Closing Balance:</strong> Balance at the end of period
              </div>
              <div>
                <strong>Total Invested:</strong> Cumulative invested till this period
              </div>
              <div>
                <strong>Total Interest:</strong> Cumulative interest earned till this period
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MutualFundCalculator;
