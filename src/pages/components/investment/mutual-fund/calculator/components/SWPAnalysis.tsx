import React from 'react';
import { formatCurrency } from '@utils/currency';
import type { MutualFundFormState } from './types';
import type { CalculationResult } from '../types/MutualFundCalculator.types';

interface SWPAnalysisProps {
  result: CalculationResult;
  formState: MutualFundFormState;
}

export const SWPAnalysis: React.FC<SWPAnalysisProps> = ({ result, formState }) => {
  const { swpAmount, swpPeriod, inflationRate, inflationStartFrom, investmentPeriod, postInvestmentHoldingPeriod } =
    formState;

  if (parseFloat(swpAmount) <= 0) {
    return null;
  }

  return (
    <>
      <div className="border-t pt-4 mt-4">
        <h3 className="text-md font-semibold text-gray-800 mb-3">SWP Analysis</h3>
        {parseFloat(inflationRate) > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-3">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <div className="text-sm font-semibold text-blue-800">Inflation Applied: {inflationRate}% annually</div>
                <div className="text-xs text-blue-700 mt-1">
                  SWP amount increases each year to account for inflation, starting from{' '}
                  {inflationStartFrom === 'current-year' ? 'when SWP begins' : 'SIP start year'}.
                </div>
                {(() => {
                  const swp = parseFloat(swpAmount);
                  const inflation = parseFloat(inflationRate) / 100;
                  const investYears = parseFloat(investmentPeriod) || 0;
                  const holdingYears = parseFloat(postInvestmentHoldingPeriod) || 0;
                  const swpYears = parseFloat(swpPeriod) || 0;
                  const yearsFromSipStart = inflationStartFrom === 'sip-start' ? investYears + holdingYears : 0;

                  const initialSwp =
                    inflationStartFrom === 'sip-start' && yearsFromSipStart > 0
                      ? swp * Math.pow(1 + inflation, yearsFromSipStart)
                      : swp;

                  const finalSwp = initialSwp * Math.pow(1 + inflation, swpYears - 1);

                  return (
                    <>
                      {inflationStartFrom === 'sip-start' && yearsFromSipStart > 0 && (
                        <div className="bg-amber-50 border border-amber-300 rounded p-2 mt-2 mb-2">
                          <div className="text-xs font-semibold text-amber-800 mb-1">
                            💡 Understanding "SIP Start Year" Mode:
                          </div>
                          <div className="text-xs text-amber-700 space-y-1">
                            <div>
                              • Your input: <span className="font-semibold">{formatCurrency(swp)}/month</span>{' '}
                              represents the value in <span className="font-semibold">today's money</span> (at SIP
                              start)
                            </div>
                            <div>
                              • After {yearsFromSipStart} years of {inflationRate}% inflation, this equals{' '}
                              <span className="font-semibold">{formatCurrency(initialSwp)}/month</span> when SWP begins
                            </div>
                            <div>• This ensures your withdrawals maintain the same purchasing power throughout</div>

                            {(() => {
                              const sustainableInTodaysTerms =
                                result.minSWPToSustain / Math.pow(1 + inflation, yearsFromSipStart);
                              const currentSwpValue = parseFloat(swpAmount);
                              const isOverSustainable = currentSwpValue > sustainableInTodaysTerms;

                              return (
                                <div
                                  className={`mt-2 pt-2 border-t ${isOverSustainable ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'} rounded p-2`}
                                >
                                  <div className="text-xs font-bold">
                                    {isOverSustainable ? '⚠️ Current Entry' : '✅ Sustainable Entry'}:
                                  </div>
                                  <div className="text-xs mt-1">
                                    • To sustain forever: Enter max{' '}
                                    <span className="font-bold text-green-700">
                                      {formatCurrency(sustainableInTodaysTerms)}
                                    </span>
                                  </div>
                                  <div className="text-xs">
                                    • You entered:{' '}
                                    <span
                                      className={`font-bold ${isOverSustainable ? 'text-red-700' : 'text-green-700'}`}
                                    >
                                      {formatCurrency(currentSwpValue)}
                                    </span>
                                    {isOverSustainable && (
                                      <span className="text-red-700">
                                        {' '}
                                        (Exceeds sustainable by{' '}
                                        {formatCurrency(currentSwpValue - sustainableInTodaysTerms)})
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                      <div className="text-xs text-blue-600 mt-2 space-y-1">
                        <div>
                          • {inflationStartFrom === 'sip-start' ? 'Actual first' : 'Initial'} monthly withdrawal:{' '}
                          <span className="font-semibold">{formatCurrency(initialSwp)}</span>
                        </div>
                        <div>
                          • Final monthly withdrawal (Year {swpYears}):{' '}
                          <span className="font-semibold">{formatCurrency(finalSwp)}</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-orange-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600 mb-1">Time Until Balance Reaches Zero</div>
        {result.yearsToZero !== null ? (
          <div className="text-xl font-bold text-orange-600">
            {result.yearsToZero} years {result.monthsToZero} months
          </div>
        ) : (
          <div className="text-xl font-bold text-green-600">Balance will never reach zero! 🎉</div>
        )}
      </div>

      <div className="bg-teal-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600 mb-2">Minimum Monthly SWP (To Sustain Forever)</div>
        <div className="text-xl font-bold text-teal-600">{formatCurrency(result.minSWPToSustain)}</div>
        <div className="text-xs text-gray-500 mt-2">
          {parseFloat(inflationRate) > 0
            ? 'This is the maximum initial monthly withdrawal that keeps your corpus stable (interest = withdrawal).'
            : 'This is the maximum amount you can withdraw monthly without depleting your principal.'}
        </div>
        {parseFloat(inflationRate) > 0 && (
          <>
            {inflationStartFrom === 'sip-start' &&
              parseFloat(investmentPeriod) > 0 &&
              parseFloat(postInvestmentHoldingPeriod) >= 0 && (
                <div className="bg-blue-50 border border-blue-300 rounded p-2 mt-2">
                  <div className="text-xs font-semibold text-blue-800 mb-1">💡 In "SIP Start Year" Mode:</div>
                  <div className="text-xs text-blue-700 space-y-1">
                    {(() => {
                      const inflation = parseFloat(inflationRate) / 100;
                      const investYears = parseFloat(investmentPeriod) || 0;
                      const holdingYears = parseFloat(postInvestmentHoldingPeriod) || 0;
                      const yearsFromSipStart = investYears + holdingYears;
                      const minSwpInTodaysTerms = result.minSWPToSustain / Math.pow(1 + inflation, yearsFromSipStart);

                      return (
                        <>
                          <div>
                            • Sustainable withdrawal in <span className="font-semibold">today's terms</span>:{' '}
                            {formatCurrency(minSwpInTodaysTerms)}/month
                          </div>
                          <div>
                            • This grows to{' '}
                            <span className="font-semibold">{formatCurrency(result.minSWPToSustain)}/month</span> when
                            SWP starts (after {yearsFromSipStart} years)
                          </div>
                          <div>• Then increases {inflationRate}% annually to maintain purchasing power</div>
                          <div className="mt-2 pt-2 border-t border-blue-300">
                            <div className="font-semibold text-blue-900">📝 To sustain forever, enter:</div>
                            <div className="bg-white rounded px-2 py-1 mt-1 border border-blue-400">
                              <span className="font-bold text-green-700">{formatCurrency(minSwpInTodaysTerms)}</span> in
                              "Monthly SWP Amount" field
                            </div>
                            <div className="text-xs mt-1 italic">
                              This will be inflation-adjusted to {formatCurrency(result.minSWPToSustain)}
                              /month when SWP starts
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            {inflationStartFrom === 'current-year' && (
              <div className="text-xs text-amber-600 mt-2">
                <div>⚠️ Important: With {inflationRate}% inflation growing each year:</div>
                <div className="mt-1">
                  • Sustainable starting amount ≈{' '}
                  {formatCurrency(result.minSWPToSustain * (1 - parseFloat(inflationRate) / 100))}/month
                </div>
                <div>
                  • Your corpus will slowly deplete if you start with {formatCurrency(result.minSWPToSustain)}/month and
                  apply inflation
                </div>
                <div className="mt-2 pt-2 border-t border-amber-400">
                  <div className="font-semibold text-amber-900">📝 To sustain forever, enter approximately:</div>
                  <div className="bg-white rounded px-2 py-1 mt-1 border border-amber-500">
                    <span className="font-bold text-green-700">
                      {formatCurrency(result.minSWPToSustain * (1 - parseFloat(inflationRate) / 100))}
                    </span>{' '}
                    in "Monthly SWP Amount" field
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {result.yearsToZero !== null && (
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <div className="text-sm font-semibold text-red-800">Warning</div>
              <div className="text-xs text-red-700 mt-1">
                Your current SWP{parseFloat(inflationRate) > 0 ? ' (with inflation adjustments)' : ''} exceeds the
                sustainable amount. Your balance will reach zero in {result.yearsToZero} years {result.monthsToZero}{' '}
                months.
              </div>
            </div>
          </div>
        </div>
      )}

      {result.yearsToZero === null && (
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <div className="text-sm font-semibold text-green-800">Sustainable Plan</div>
              <div className="text-xs text-green-700 mt-1">
                Your SWP{parseFloat(inflationRate) > 0 ? ' (even with inflation adjustments)' : ''} is within
                sustainable limits. Your balance will grow or remain stable!
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
