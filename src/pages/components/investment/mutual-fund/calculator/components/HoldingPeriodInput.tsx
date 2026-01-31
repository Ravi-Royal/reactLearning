import React from 'react';
import { MUTUAL_FUND_CALCULATOR_TEXTS } from '../constants/mutualFundCalculator.constants';
import type { MutualFundFormState } from './types';

interface HoldingPeriodInputProps {
  formState: MutualFundFormState;
}

export const HoldingPeriodInput: React.FC<HoldingPeriodInputProps> = ({ formState }) => {
  const { postInvestmentHoldingPeriod, setPostInvestmentHoldingPeriod } = formState;

  return (
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
  );
};
