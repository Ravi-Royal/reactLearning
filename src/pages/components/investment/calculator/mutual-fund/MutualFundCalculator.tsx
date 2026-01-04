import { useState, useMemo } from 'react';
import Breadcrumbs from '../../../../navigation/Breadcrumbs';
import { Link } from 'react-router-dom';

interface CalculationResult {
  finalBalance: number;
  totalInvested: number;
  totalReturns: number;
  yearsToZero: number | null;
  monthsToZero: number | null;
  minSWPToSustain: number;
}

interface YearlyBreakdown {
  year: number;
  invested: number;
  interest: number;
  totalValue: number;
  withdrawal?: number;
}

function MutualFundCalculator() {
  const [investmentType, setInvestmentType] = useState<'sip' | 'lumpsum'>('sip');
  const [sipAmount, setSipAmount] = useState<string>('');
  const [lumpsumAmount, setLumpsumAmount] = useState<string>('');
  const [annualReturn, setAnnualReturn] = useState<string>('');
  const [investmentPeriod, setInvestmentPeriod] = useState<string>('');
  const [swpAmount, setSwpAmount] = useState<string>('');
  const [swpPeriod, setSwpPeriod] = useState<string>('');

  const calculateCompoundInterest = (principal: number, rate: number, time: number): number => {
    return principal * Math.pow(1 + rate / 100, time);
  };

  const calculateSIPFutureValue = (monthlyInvestment: number, annualRate: number, years: number): number => {
    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    return futureValue;
  };

  const calculateMonthsToZero = (initialAmount: number, monthlyWithdrawal: number, annualReturn: number): { years: number | null; months: number | null } => {
    if (monthlyWithdrawal <= 0) {
      return { years: null, months: null };
    }

    const monthlyRate = annualReturn / 12 / 100;
    let balance = initialAmount;
    let totalMonths = 0;

    while (balance > 0 && totalMonths < 1200) {
      balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
      totalMonths++;

      if (balance <= 0) {
        break;
      }
    }

    if (totalMonths >= 1200) {
      return { years: null, months: null };
    }

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return { years, months };
  };

  const calculateMinSWP = (initialAmount: number, annualReturn: number): number => {
    const monthlyRate = annualReturn / 12 / 100;
    return initialAmount * monthlyRate;
  };

  // Compute result automatically using useMemo
  const result = useMemo<CalculationResult | null>(() => {
    const returnRate = parseFloat(annualReturn);
    const period = parseFloat(investmentPeriod);
    const swp = parseFloat(swpAmount) || 0;
    const swpYears = parseFloat(swpPeriod) || 0;

    if (isNaN(returnRate) || isNaN(period)) {
      return null;
    }

    let accumulatedAmount = 0;
    let totalInvested = 0;

    if (investmentType === 'sip') {
      const sip = parseFloat(sipAmount);
      if (isNaN(sip) || sip <= 0) {
        return null;
      }
      accumulatedAmount = calculateSIPFutureValue(sip, returnRate, period);
      totalInvested = sip * period * 12;
    } else {
      const lumpsum = parseFloat(lumpsumAmount);
      if (isNaN(lumpsum) || lumpsum <= 0) {
        return null;
      }
      accumulatedAmount = calculateCompoundInterest(lumpsum, returnRate, period);
      totalInvested = lumpsum;
    }

    let finalBalance = accumulatedAmount;

    if (swp > 0 && swpYears > 0) {
      let currentBalance = accumulatedAmount;
      const monthlyRate = returnRate / 12 / 100;
      const totalSwpMonths = swpYears * 12;

      for (let month = 0; month < totalSwpMonths; month++) {
        currentBalance = currentBalance * (1 + monthlyRate) - swp;
        if (currentBalance <= 0) {
          currentBalance = 0;
          break;
        }
      }

      finalBalance = currentBalance;
    }

    const { years: yearsToZero, months: monthsToZero } = swp > 0 ? calculateMonthsToZero(accumulatedAmount, swp, returnRate) : { years: null, months: null };
    const minSWP = calculateMinSWP(accumulatedAmount, returnRate);

    return {
      finalBalance,
      totalInvested,
      totalReturns: accumulatedAmount - totalInvested,
      yearsToZero,
      monthsToZero,
      minSWPToSustain: minSWP,
    };
  }, [investmentType, sipAmount, lumpsumAmount, annualReturn, investmentPeriod, swpAmount, swpPeriod]);

  const handleReset = () => {
    setSipAmount('');
    setLumpsumAmount('');
    setAnnualReturn('');
    setInvestmentPeriod('');
    setSwpAmount('');
    setSwpPeriod('');
  };

  // Calculate yearly breakdown for table
  const yearlyBreakdown = useMemo<YearlyBreakdown[]>(() => {
    const returnRate = parseFloat(annualReturn);
    const period = parseFloat(investmentPeriod);
    const swp = parseFloat(swpAmount) || 0;
    const swpYears = parseFloat(swpPeriod) || 0;

    if (isNaN(returnRate) || isNaN(period)) {
      return [];
    }

    const monthlyRate = returnRate / 12 / 100;
    const breakdown: YearlyBreakdown[] = [];

    if (investmentType === 'sip') {
      const sip = parseFloat(sipAmount);
      if (isNaN(sip) || sip <= 0) {
        return [];
      }

      let balance = 0;
      let totalInvested = 0;

      // Investment phase
      for (let year = 1; year <= period; year++) {
        for (let month = 1; month <= 12; month++) {
          balance = balance * (1 + monthlyRate) + sip;
          totalInvested += sip;
        }

        breakdown.push({
          year,
          invested: totalInvested,
          interest: balance - totalInvested,
          totalValue: balance,
        });
      }

      // SWP phase
      if (swp > 0 && swpYears > 0) {
        const totalSwpYears = Math.min(swpYears, 50); // Cap at 50 years
        for (let year = 1; year <= totalSwpYears; year++) {
          const yearStartBalance = balance;
          let yearWithdrawal = 0;

          for (let month = 1; month <= 12; month++) {
            balance = balance * (1 + monthlyRate) - swp;
            yearWithdrawal += swp;

            if (balance <= 0) {
              balance = 0;
              breakdown.push({
                year: period + year,
                invested: totalInvested,
                interest: 0,
                totalValue: 0,
                withdrawal: yearWithdrawal,
              });
              return breakdown;
            }
          }

          breakdown.push({
            year: period + year,
            invested: totalInvested,
            interest: balance - yearStartBalance + yearWithdrawal,
            totalValue: balance,
            withdrawal: yearWithdrawal,
          });
        }
      }
    } else {
      // Lumpsum
      const lumpsum = parseFloat(lumpsumAmount);
      if (isNaN(lumpsum) || lumpsum <= 0) {
        return [];
      }

      let balance = lumpsum;
      const totalInvested = lumpsum;

      // Investment phase
      for (let year = 1; year <= period; year++) {
        balance = balance * Math.pow(1 + returnRate / 100, 1);

        breakdown.push({
          year,
          invested: totalInvested,
          interest: balance - totalInvested,
          totalValue: balance,
        });
      }

      // SWP phase
      if (swp > 0 && swpYears > 0) {
        const totalSwpYears = Math.min(swpYears, 50);
        for (let year = 1; year <= totalSwpYears; year++) {
          const yearStartBalance = balance;
          let yearWithdrawal = 0;

          for (let month = 1; month <= 12; month++) {
            balance = balance * (1 + monthlyRate) - swp;
            yearWithdrawal += swp;

            if (balance <= 0) {
              balance = 0;
              breakdown.push({
                year: period + year,
                invested: totalInvested,
                interest: 0,
                totalValue: 0,
                withdrawal: yearWithdrawal,
              });
              return breakdown;
            }
          }

          breakdown.push({
            year: period + year,
            invested: totalInvested,
            interest: balance - yearStartBalance + yearWithdrawal,
            totalValue: balance,
            withdrawal: yearWithdrawal,
          });
        }
      }
    }

    return breakdown;
  }, [investmentType, sipAmount, lumpsumAmount, annualReturn, investmentPeriod, swpAmount, swpPeriod]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Breadcrumbs />
      <div className="mb-4 sm:mb-6">
        <Link
          to="/investment/calculator"
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs sm:text-sm font-medium inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 py-2 rounded-md transition-colors"
        >
          ← Back to Calculators
        </Link>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Mutual Fund Calculator</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Calculate SIP/Lumpsum returns and SWP sustainability</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Investment Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Investment Type</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="sip"
                  checked={investmentType === 'sip'}
                  onChange={(e) => setInvestmentType(e.target.value as 'sip' | 'lumpsum')}
                  className="mr-2"
                />
                <span className="text-sm">SIP (Monthly)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="lumpsum"
                  checked={investmentType === 'lumpsum'}
                  onChange={(e) => setInvestmentType(e.target.value as 'sip' | 'lumpsum')}
                  className="mr-2"
                />
                <span className="text-sm">Lumpsum</span>
              </label>
            </div>
          </div>

          {investmentType === 'sip' ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly SIP Amount (₹)</label>
              <input
                type="number"
                value={sipAmount}
                onChange={(e) => setSipAmount(e.target.value)}
                placeholder="e.g., 10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Lumpsum Amount (₹)</label>
              <input
                type="number"
                value={lumpsumAmount}
                onChange={(e) => setLumpsumAmount(e.target.value)}
                placeholder="e.g., 100000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
            <input
              type="number"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
              placeholder="e.g., 12"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Investment Period (Years)</label>
            <input
              type="number"
              value={investmentPeriod}
              onChange={(e) => setInvestmentPeriod(e.target.value)}
              placeholder="e.g., 10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Systematic Withdrawal Plan (SWP) - Optional</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly SWP Amount (₹)</label>
              <input
                type="number"
                value={swpAmount}
                onChange={(e) => setSwpAmount(e.target.value)}
                placeholder="e.g., 20000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">SWP Period (Years)</label>
              <input
                type="number"
                value={swpPeriod}
                onChange={(e) => setSwpPeriod(e.target.value)}
                placeholder="e.g., 20"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              Reset All
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Calculation Results</h2>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Invested</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(result.totalInvested)}</div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Returns</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(result.totalReturns)}</div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">
                  Final Balance {swpAmount && swpPeriod ? '(After SWP)' : '(At Maturity)'}
                </div>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(result.finalBalance)}</div>
              </div>

              {parseFloat(swpAmount) > 0 && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-md font-semibold text-gray-800 mb-3">SWP Analysis</h3>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Time Until Balance Reaches Zero</div>
                    {result.yearsToZero !== null ? (
                      <div className="text-xl font-bold text-orange-600">
                        {result.yearsToZero} years {result.monthsToZero} months
                      </div>
                    ) : (
                      <div className="text-xl font-bold text-green-600">
                        Balance will never reach zero! 🎉
                      </div>
                    )}
                  </div>

                  <div className="bg-teal-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Minimum Monthly SWP (To Sustain Forever)</div>
                    <div className="text-xl font-bold text-teal-600">{formatCurrency(result.minSWPToSustain)}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      This is the maximum amount you can withdraw monthly without depleting your principal.
                    </div>
                  </div>

                  {parseFloat(swpAmount) > result.minSWPToSustain && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="text-sm font-semibold text-red-800">Warning</div>
                          <div className="text-xs text-red-700 mt-1">
                            Your current SWP exceeds the sustainable amount. Your balance will eventually reach zero.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {parseFloat(swpAmount) <= result.minSWPToSustain && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div className="text-sm font-semibold text-green-800">Sustainable Plan</div>
                          <div className="text-xs text-green-700 mt-1">
                            Your SWP is within sustainable limits. Your balance will grow or remain stable!
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 How it works</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• <strong>SIP:</strong> Invest a fixed amount monthly. Returns compound monthly based on annual rate.</li>
          <li>• <strong>Lumpsum:</strong> One-time investment that grows with compound interest.</li>
          <li>• <strong>SWP:</strong> Systematic Withdrawal Plan - withdraw fixed amount monthly from accumulated corpus.</li>
          <li>• <strong>Minimum SWP:</strong> Maximum sustainable withdrawal (equals monthly returns, keeping principal intact).</li>
          <li>• Calculations assume returns are reinvested and rate remains constant.</li>
        </ul>
      </div>

      {yearlyBreakdown.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Year-by-Year Breakdown</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="p-2 sm:p-3 text-left font-semibold text-gray-700">Year</th>
                  <th className="p-2 sm:p-3 text-right font-semibold text-gray-700">Total Invested</th>
                  <th className="p-2 sm:p-3 text-right font-semibold text-gray-700">Interest Earned</th>
                  {yearlyBreakdown.some(row => row.withdrawal) && (
                    <th className="p-2 sm:p-3 text-right font-semibold text-gray-700">Withdrawal</th>
                  )}
                  <th className="p-2 sm:p-3 text-right font-semibold text-gray-700">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {yearlyBreakdown.map((row, index) => {
                  const isWithdrawalPhase = row.withdrawal !== undefined;
                  const isLastYear = index === yearlyBreakdown.length - 1;

                  return (
                    <tr
                      key={row.year}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        isWithdrawalPhase ? 'bg-orange-50' : ''
                      } ${isLastYear ? 'font-semibold bg-purple-50' : ''}`}
                    >
                      <td className="p-2 sm:p-3 text-left">
                        <span className={isWithdrawalPhase ? 'text-orange-700' : 'text-gray-800'}>
                          {row.year}
                          {isWithdrawalPhase && <span className="text-xs ml-1">(SWP)</span>}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 text-right text-blue-700">
                        {formatCurrency(row.invested)}
                      </td>
                      <td className="p-2 sm:p-3 text-right text-green-700">
                        {formatCurrency(row.interest)}
                      </td>
                      {yearlyBreakdown.some(r => r.withdrawal) && (
                        <td className="p-2 sm:p-3 text-right text-orange-700">
                          {row.withdrawal ? formatCurrency(row.withdrawal) : '-'}
                        </td>
                      )}
                      <td className="p-2 sm:p-3 text-right font-semibold text-purple-700">
                        {formatCurrency(row.totalValue)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="text-gray-600 mb-1">Total Years</div>
                <div className="font-semibold text-gray-800">{yearlyBreakdown.length}</div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Total Invested</div>
                <div className="font-semibold text-blue-700">
                  {formatCurrency(yearlyBreakdown[yearlyBreakdown.length - 1]?.invested || 0)}
                </div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Total Interest</div>
                <div className="font-semibold text-green-700">
                  {formatCurrency(yearlyBreakdown[yearlyBreakdown.length - 1]?.interest || 0)}
                </div>
              </div>
              <div>
                <div className="text-gray-600 mb-1">Final Value</div>
                <div className="font-semibold text-purple-700">
                  {formatCurrency(yearlyBreakdown[yearlyBreakdown.length - 1]?.totalValue || 0)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-600">
            <p>
              💡 <strong>Investment Phase:</strong> White background rows show accumulation years.
              {yearlyBreakdown.some(row => row.withdrawal) && (
                <span> <strong>Withdrawal Phase:</strong> Orange background rows show SWP withdrawal years.</span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MutualFundCalculator;
