import React from 'react';
import { formatCurrency } from '@utils/currency';
import type { YearlyBreakdown } from '../types/MutualFundCalculator.types';

interface BreakdownSummaryProps {
  yearlyBreakdown: YearlyBreakdown[];
}

export const BreakdownSummary: React.FC<BreakdownSummaryProps> = ({ yearlyBreakdown }) => {
  if (yearlyBreakdown.length === 0) {
    return null;
  }

  const lastRow = yearlyBreakdown[yearlyBreakdown.length - 1];

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-2 border-gray-300 shadow-sm sticky bottom-0 z-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <div className="text-gray-600 mb-1">Total Periods</div>
          <div className="font-semibold text-gray-800">{yearlyBreakdown.length}</div>
        </div>
        <div>
          <div className="text-gray-600 mb-1">Total Invested</div>
          <div className="font-semibold text-blue-700">{formatCurrency(lastRow?.invested || 0)}</div>
        </div>
        <div>
          <div className="text-gray-600 mb-1">Total Interest</div>
          <div className="font-semibold text-green-700">{formatCurrency(lastRow?.interest || 0)}</div>
        </div>
        <div>
          <div className="text-gray-600 mb-1">Final Value</div>
          <div className="font-semibold text-purple-700">{formatCurrency(lastRow?.totalValue || 0)}</div>
        </div>
      </div>
    </div>
  );
};
