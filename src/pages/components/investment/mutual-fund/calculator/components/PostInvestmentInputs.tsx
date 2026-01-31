import { memo } from 'react';

interface PostInvestmentInputsProps {
  postInvestmentHoldingPeriod: string;
  oneTimeWithdrawal: string;
  swpAmount: string;
  swpPeriod: string;
  inflationRate: string;
  inflationStartFrom: 'current-year' | 'sip-start';
  onPostInvestmentHoldingPeriodChange: (value: string) => void;
  onOneTimeWithdrawalChange: (value: string) => void;
  onSwpAmountChange: (value: string) => void;
  onSwpPeriodChange: (value: string) => void;
  onInflationRateChange: (value: string) => void;
  onInflationStartFromChange: (value: 'current-year' | 'sip-start') => void;
}

const PostInvestmentInputs = memo(
  ({
    postInvestmentHoldingPeriod,
    oneTimeWithdrawal,
    swpAmount,
    swpPeriod,
    inflationRate,
    inflationStartFrom,
    onPostInvestmentHoldingPeriodChange,
    onOneTimeWithdrawalChange,
    onSwpAmountChange,
    onSwpPeriodChange,
    onInflationRateChange,
    onInflationStartFromChange,
  }: PostInvestmentInputsProps) => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="postInvestmentHoldingPeriod" className="block text-sm font-semibold text-gray-700">
            Post-Investment Holding Period (Years) <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <input
            id="postInvestmentHoldingPeriod"
            type="number"
            value={postInvestmentHoldingPeriod}
            onChange={(e) => onPostInvestmentHoldingPeriodChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder="e.g., 5"
            min="0"
            max="50"
            step="1"
          />
          <p className="text-xs text-gray-600">
            Additional years to hold investments after the investment period ends (no new investments, only growth).
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="oneTimeWithdrawal" className="block text-sm font-semibold text-gray-700">
            One-time Withdrawal (₹) <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <input
            id="oneTimeWithdrawal"
            type="number"
            value={oneTimeWithdrawal}
            onChange={(e) => onOneTimeWithdrawalChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder="e.g., 50000"
            min="0"
            step="10000"
          />
          <p className="text-xs text-gray-600">
            One-time withdrawal after holding period (deducted before SWP calculation).
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="swpAmount" className="block text-sm font-semibold text-gray-700">
            SWP Monthly Amount (₹) <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <input
            id="swpAmount"
            type="number"
            value={swpAmount}
            onChange={(e) => onSwpAmountChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder="e.g., 10000"
            min="0"
            step="1000"
          />
          <p className="text-xs text-gray-600">Systematic Withdrawal Plan - monthly withdrawal after holding period.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="swpPeriod" className="block text-sm font-semibold text-gray-700">
            SWP Period (Years) <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <input
            id="swpPeriod"
            type="number"
            value={swpPeriod}
            onChange={(e) => onSwpPeriodChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder="e.g., 20"
            min="0"
            max="50"
            step="1"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="inflationRate" className="block text-sm font-semibold text-gray-700">
            Annual Inflation Rate (%) <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <input
            id="inflationRate"
            type="number"
            value={inflationRate}
            onChange={(e) => onInflationRateChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder="e.g., 6"
            min="0"
            max="20"
            step="0.1"
          />
          <p className="text-xs text-gray-600">Inflation rate to adjust SWP withdrawals annually.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="inflation-start" className="block text-sm font-semibold text-gray-700">
            Inflation Calculation Start
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="inflationStartFrom"
                value="current-year"
                checked={inflationStartFrom === 'current-year'}
                onChange={(e) => onInflationStartFromChange(e.target.value as 'current-year' | 'sip-start')}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">From Current Year</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="inflationStartFrom"
                value="sip-start"
                checked={inflationStartFrom === 'sip-start'}
                onChange={(e) => onInflationStartFromChange(e.target.value as 'current-year' | 'sip-start')}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">From SIP Start</span>
            </label>
          </div>
        </div>
      </div>
    );
  },
);

PostInvestmentInputs.displayName = 'PostInvestmentInputs';

export default PostInvestmentInputs;
