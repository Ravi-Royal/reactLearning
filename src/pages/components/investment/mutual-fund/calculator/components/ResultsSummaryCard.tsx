import { formatCurrency } from '@utils/currency';
import type { CalculationResult } from '../types/MutualFundCalculator.types';

interface ResultsSummaryCardProps {
  result: CalculationResult;
  postInvestmentHoldingPeriod: string;
  swpAmount: string;
  swpPeriod: string;
}

export const ResultsSummaryCard = ({
  result,
  postInvestmentHoldingPeriod,
  swpAmount,
  swpPeriod,
}: ResultsSummaryCardProps) => {
  return (
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
            <div className="text-2xl font-bold text-cyan-700">{formatCurrency(result.corpusAfterHoldingPeriod)}</div>
            <div className="text-xs text-cyan-600 mt-1">
              Amount after {postInvestmentHoldingPeriod} years of holding (compounded growth)
            </div>
          </div>
        )}

        {parseFloat(swpAmount) > 0 && parseFloat(swpPeriod) > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border-2 border-purple-200 shadow-sm">
            <div className="text-sm text-purple-700 font-medium mb-1">💰 Final Balance (After SWP)</div>
            <div className="text-2xl font-bold text-purple-700">{formatCurrency(result.finalBalance)}</div>
            <div className="text-xs text-purple-600 mt-1">Balance remaining after {swpPeriod} years of withdrawals</div>
          </div>
        )}
      </div>
    </div>
  );
};
