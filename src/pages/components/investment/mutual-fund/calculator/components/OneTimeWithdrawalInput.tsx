import React from 'react';
import { MUTUAL_FUND_CALCULATOR_TEXTS } from '../constants/mutualFundCalculator.constants';
import type { MutualFundFormState } from './types';

interface OneTimeWithdrawalInputProps {
  formState: MutualFundFormState;
}

export const OneTimeWithdrawalInput: React.FC<OneTimeWithdrawalInputProps> = ({ formState }) => {
  const { oneTimeWithdrawal, setOneTimeWithdrawal } = formState;

  return (
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
        <p className="text-xs text-indigo-600 mt-1">Amount to withdraw after holding period (before SWP starts)</p>
      </div>
    </div>
  );
};
