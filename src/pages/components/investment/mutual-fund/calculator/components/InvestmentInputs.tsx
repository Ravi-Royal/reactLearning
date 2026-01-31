import React from 'react';
import { MUTUAL_FUND_CALCULATOR_TEXTS } from '../constants/mutualFundCalculator.constants';
import type { InvestmentInputsProps } from './types';
import { SWPInputSection } from './SWPInputSection';
import { HoldingPeriodInput } from './HoldingPeriodInput';
import { OneTimeWithdrawalInput } from './OneTimeWithdrawalInput';

export const InvestmentInputs: React.FC<InvestmentInputsProps> = ({ formState, isResetting, onReset }) => {
  const {
    investmentType,
    sipAmount,
    lumpsumAmount,
    annualReturn,
    investmentPeriod,
    handleInvestmentTypeChange,
    setSipAmount,
    setLumpsumAmount,
    setAnnualReturn,
    setInvestmentPeriod,
  } = formState;

  return (
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

      <HoldingPeriodInput formState={formState} />
      <OneTimeWithdrawalInput formState={formState} />
      <SWPInputSection formState={formState} />

      <div className="flex gap-3 mt-6">
        <button
          onClick={onReset}
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
  );
};
