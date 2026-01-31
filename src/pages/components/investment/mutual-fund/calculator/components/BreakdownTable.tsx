import { memo } from 'react';
import { formatCurrency } from '@utils/currency';
import type { YearlyBreakdown, BreakdownView } from '../types/MutualFundCalculator.types';

interface BreakdownTableProps {
  yearlyBreakdown: YearlyBreakdown[];
  breakdownView: BreakdownView;
  investmentPeriod: string;
  postInvestmentHoldingPeriod: string;
  annualReturn: string;
  swpStartIndex: number | null;
  swpStartRowRef: React.RefObject<HTMLTableRowElement>;
  onBreakdownViewChange: (view: BreakdownView) => void;
}

const BreakdownTable = memo(
  ({
    yearlyBreakdown,
    breakdownView,
    investmentPeriod,
    postInvestmentHoldingPeriod,
    annualReturn,
    swpStartIndex,
    swpStartRowRef,
    onBreakdownViewChange,
  }: BreakdownTableProps) => {
    if (yearlyBreakdown.length === 0) {
      return null;
    }

    const periodLabel = breakdownView === 'monthly' ? 'Month' : breakdownView === 'quarterly' ? 'Quarter' : 'Year';

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h3 className="text-xl font-bold text-gray-800">📈 Detailed Breakdown</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onBreakdownViewChange('monthly')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                breakdownView === 'monthly' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => onBreakdownViewChange('quarterly')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                breakdownView === 'quarterly'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Quarterly
            </button>
            <button
              type="button"
              onClick={() => onBreakdownViewChange('yearly')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                breakdownView === 'yearly' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                <th className="p-2 sm:p-3 text-left font-semibold text-gray-700 bg-gray-100">{periodLabel}</th>
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
                            const totalInvestmentPeriods = investYears * (12 / monthsPerPeriod);
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

        <BreakdownTableSummary yearlyBreakdown={yearlyBreakdown} />
        <BreakdownLegend yearlyBreakdown={yearlyBreakdown} postInvestmentHoldingPeriod={postInvestmentHoldingPeriod} />
      </div>
    );
  },
);

BreakdownTable.displayName = 'BreakdownTable';

const BreakdownTableSummary = memo(({ yearlyBreakdown }: { yearlyBreakdown: YearlyBreakdown[] }) => {
  const lastRow = yearlyBreakdown[yearlyBreakdown.length - 1];
  if (!lastRow) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-2 border-gray-300 shadow-sm sticky bottom-0 z-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <div className="text-gray-600 mb-1">Total Periods</div>
          <div className="font-semibold text-gray-800">{yearlyBreakdown.length}</div>
        </div>
        <div>
          <div className="text-gray-600 mb-1">Total Invested</div>
          <div className="font-semibold text-blue-700">{formatCurrency(lastRow.invested)}</div>
        </div>
        <div>
          <div className="text-gray-600 mb-1">Total Interest</div>
          <div className="font-semibold text-green-700">{formatCurrency(lastRow.interest)}</div>
        </div>
        <div>
          <div className="text-gray-600 mb-1">Final Value</div>
          <div className="font-semibold text-purple-700">{formatCurrency(lastRow.totalValue)}</div>
        </div>
      </div>
    </div>
  );
});

BreakdownTableSummary.displayName = 'BreakdownTableSummary';

const BreakdownLegend = memo(
  ({
    yearlyBreakdown,
    postInvestmentHoldingPeriod,
  }: {
    yearlyBreakdown: YearlyBreakdown[];
    postInvestmentHoldingPeriod: string;
  }) => {
    return (
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
    );
  },
);

BreakdownLegend.displayName = 'BreakdownLegend';

export default BreakdownTable;
