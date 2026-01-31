import React from 'react';
import { formatCurrency } from '@utils/currency';
import type { MutualFundFormState } from './types';
import type { YearlyBreakdown, BreakdownView } from '../types/MutualFundCalculator.types';
import { BreakdownSummary } from './BreakdownSummary';
import { BreakdownLegend } from './BreakdownLegend';

interface BreakdownTableProps {
  yearlyBreakdown: YearlyBreakdown[];
  swpStartIndex: number;
  swpStartRowRef: React.RefObject<HTMLTableRowElement | null>;
  breakdownView: BreakdownView;
  setBreakdownView: (view: BreakdownView) => void;
  formState: MutualFundFormState;
}

export const BreakdownTable: React.FC<BreakdownTableProps> = ({
  yearlyBreakdown,
  swpStartIndex,
  swpStartRowRef,
  breakdownView,
  setBreakdownView,
  formState,
}) => {
  const { investmentPeriod, postInvestmentHoldingPeriod, annualReturn } = formState;

  if (yearlyBreakdown.length === 0) {
    return null;
  }

  return (
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
              breakdownView === 'monthly' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBreakdownView('quarterly')}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
              breakdownView === 'quarterly' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Quarterly
          </button>
          <button
            onClick={() => setBreakdownView('yearly')}
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
                          const totalInvestmentPeriods = (parseFloat(investmentPeriod) || 0) * (12 / monthsPerPeriod);
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

      <BreakdownSummary yearlyBreakdown={yearlyBreakdown} />
      <BreakdownLegend yearlyBreakdown={yearlyBreakdown} postInvestmentHoldingPeriod={postInvestmentHoldingPeriod} />
    </div>
  );
};
