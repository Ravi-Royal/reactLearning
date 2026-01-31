import { memo } from 'react';
import { formatCurrency } from '@utils/currency';
import type { CalculationResult } from '../types/MutualFundCalculator.types';

interface ResultsSummaryProps {
  result: CalculationResult | null;
  investmentPeriod: string;
  postInvestmentHoldingPeriod: string;
  oneTimeWithdrawal: string;
  swpAmount: string;
  swpPeriod: string;
}

const ResultsSummary = memo(
  ({
    result,
    investmentPeriod,
    postInvestmentHoldingPeriod,
    oneTimeWithdrawal,
    swpAmount,
    swpPeriod,
  }: ResultsSummaryProps) => {
    if (!result) {
      return null;
    }

    const hasPostInvestmentHolding = parseFloat(postInvestmentHoldingPeriod) > 0;
    const hasOneTimeWithdrawal = parseFloat(oneTimeWithdrawal) > 0;
    const hasSwp = parseFloat(swpAmount) > 0 && parseFloat(swpPeriod) > 0;
    const returnOnInvestment =
      result.totalInvested > 0 ? ((result.totalReturns / result.totalInvested) * 100).toFixed(2) : '0.00';

    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl shadow-lg border-2 border-green-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">📊 Investment Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Total Invested</div>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(result.totalInvested)}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Corpus After {investmentPeriod} Years</div>
            <div className="text-2xl font-bold text-purple-700">{formatCurrency(result.corpusAfterInvestment)}</div>
          </div>

          {hasPostInvestmentHolding && (
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-1">
                Corpus After Holding ({postInvestmentHoldingPeriod} Years)
              </div>
              <div className="text-2xl font-bold text-teal-700">{formatCurrency(result.corpusAfterHoldingPeriod)}</div>
            </div>
          )}

          {hasSwp && (
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-1">Final Balance (After {swpPeriod} Years SWP)</div>
              <div className="text-2xl font-bold text-orange-700">{formatCurrency(result.finalBalance)}</div>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Total Returns</div>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(result.totalReturns)}</div>
            <div className="text-xs text-gray-500 mt-1">ROI: {returnOnInvestment}%</div>
          </div>
        </div>

        {hasSwp && (
          <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg mt-4">
            <h4 className="font-semibold text-yellow-800 mb-2">💰 SWP Analysis</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between items-center">
                <span>Minimum Sustainable SWP:</span>
                <span className="font-semibold text-green-700">{formatCurrency(result.minSWPToSustain)}/month</span>
              </div>

              {result.yearsToZero !== null ? (
                <div className="bg-orange-100 p-3 rounded-lg border border-orange-300">
                  <div className="font-semibold text-orange-800 mb-1">⚠️ Corpus Depletion Warning</div>
                  <div className="text-orange-700">
                    Your corpus will be depleted in approximately{' '}
                    <strong>
                      {result.yearsToZero} years {result.monthsToZero} months
                    </strong>
                  </div>
                  <div className="text-xs text-orange-600 mt-1">
                    Consider reducing SWP amount or increasing corpus to sustain longer.
                  </div>
                </div>
              ) : (
                <div className="bg-green-100 p-3 rounded-lg border border-green-300">
                  <div className="font-semibold text-green-800 mb-1">✅ Sustainable SWP</div>
                  <div className="text-green-700">Your SWP is sustainable indefinitely at the current parameters!</div>
                </div>
              )}
            </div>
          </div>
        )}

        {hasOneTimeWithdrawal && (
          <div className="bg-blue-50 border-2 border-blue-300 p-3 rounded-lg mt-4">
            <div className="text-sm text-blue-800">
              <strong>One-time Withdrawal:</strong> {formatCurrency(parseFloat(oneTimeWithdrawal))} will be deducted
              after the holding period.
            </div>
          </div>
        )}
      </div>
    );
  },
);

ResultsSummary.displayName = 'ResultsSummary';

export default ResultsSummary;
