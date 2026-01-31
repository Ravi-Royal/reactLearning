import React from 'react';
import type { YearlyBreakdown } from '../types/MutualFundCalculator.types';

interface BreakdownLegendProps {
  yearlyBreakdown: YearlyBreakdown[];
  postInvestmentHoldingPeriod: string;
}

export const BreakdownLegend: React.FC<BreakdownLegendProps> = ({ yearlyBreakdown, postInvestmentHoldingPeriod }) => {
  const hasWithdrawal = yearlyBreakdown.some((row) => row.withdrawal && row.withdrawal > 0);
  const hasLumpSumWithdrawal = yearlyBreakdown.some((row) => row.withdrawal && row.withdrawal < 0);
  const holdingPeriod = parseFloat(postInvestmentHoldingPeriod) || 0;

  return (
    <div className="mt-3 text-xs text-gray-600 space-y-2">
      <p>
        💡 <strong>Investment Phase:</strong> Blue background rows show accumulation periods.
        {holdingPeriod > 0 && (
          <span>
            {' '}
            <strong>Holding Phase:</strong> Teal background rows show post-investment holding periods.
          </span>
        )}
        {hasWithdrawal && (
          <span>
            {' '}
            <strong>SWP Phase:</strong> Orange background rows show SWP withdrawal periods.
          </span>
        )}
        {hasLumpSumWithdrawal && (
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
  );
};
