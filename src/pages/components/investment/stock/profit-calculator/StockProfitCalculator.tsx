import { useState, useMemo } from 'react';
import ProfitSimulatorModal from './ProfitSimulatorModal';
import { PROFIT_CALCULATOR_TEXTS } from './constants/profitCalculator.constants';
import Breadcrumbs from '../../../../navigation/Breadcrumbs';
import { RESPONSIVE_PATTERNS } from '../../../../../constants/responsive.constants';
import { Money, safeParseNumber } from '../../../../../utils/financial';
import type { StockGroup } from './types/StockProfitCalculator.types';

function StockProfitCalculator() {
  const [stockGroups, setStockGroups] = useState<StockGroup[]>([
    { id: 1, numStocks: '', pricePerStock: '', profitInputType: 'total', totalProfit: '', profitPerShare: '', currentPricePerShare: '', age: '', ageUnit: 'days' },
  ]);
  const [simModal, setSimModal] = useState<{ open: boolean; price: number; profit: number } | null>(null);

  const addStockGroup = () => {
    const newId = Math.max(...stockGroups.map(g => g.id), 0) + 1;
    setStockGroups([
      ...stockGroups,
      { id: newId, numStocks: '', pricePerStock: '', profitInputType: 'total', totalProfit: '', profitPerShare: '', currentPricePerShare: '', age: '', ageUnit: 'days' },
    ]);
  };

  const removeStockGroup = (id: number) => {
    if (stockGroups.length > 1) {
      setStockGroups(stockGroups.filter(group => group.id !== id));
    }
  };

  const updateStockGroup = (id: number, field: keyof StockGroup, value: string) => {
    setStockGroups(stockGroups.map(group =>
      group.id === id ? { ...group, [field]: value } : group,
    ));
  };

  const calculateProfit = (group: StockGroup) => {
    const numStocks = safeParseNumber(group.numStocks, 0);
    const pricePerStock = safeParseNumber(group.pricePerStock, 0);
    const currentPricePerShare = safeParseNumber(group.currentPricePerShare || '', 0);
    const totalProfitInput = safeParseNumber(group.totalProfit, 0);
    const profitPerShareInput = safeParseNumber(group.profitPerShare, 0);
    let totalProfit = 0;
    // Use only the selected input type
    if (group.profitInputType === 'currentPrice' && currentPricePerShare > 0) {
      // totalProfit = (currentPricePerShare - pricePerStock) * numStocks
      const profitPerShare = Money.subtract(currentPricePerShare, pricePerStock);
      totalProfit = Money.multiply(profitPerShare, numStocks);
    } else if (group.profitInputType === 'total' && totalProfitInput !== 0) {
      totalProfit = totalProfitInput;
    } else if (group.profitInputType === 'perShare' && profitPerShareInput !== 0) {
      totalProfit = Money.multiply(profitPerShareInput, numStocks);
    } else {
      totalProfit = 0;
    }
    const age = safeParseNumber(group.age, 0);

    const totalInvested = Money.multiply(numStocks, pricePerStock);
    const profitPercentage = totalInvested > 0 ? Money.multiply(Money.divide(totalProfit, totalInvested), 100) : 0;

    let annualizedReturn: number | null = null;
    if (age > 0 && totalInvested > 0) {
      const years = group.ageUnit === 'days' ? Money.divide(age, 365) : Money.divide(age, 12);
      const totalReturn = Money.divide(totalProfit, totalInvested);
      annualizedReturn = Money.multiply(Money.annualizedReturn(totalReturn, years), 100);
    }

    return {
      totalInvested,
      profitPercentage,
      annualizedReturn,
      isValid: numStocks > 0 && pricePerStock > 0,
      totalProfit,
    };
  };

  // Calculate overall totals with useMemo for performance
  const overallTotals = useMemo(() => {
    return stockGroups.reduce((acc, group) => {
      const result = calculateProfit(group);
      if (result.isValid) {
        acc.totalInvested = Money.add(acc.totalInvested, result.totalInvested);
        acc.totalProfit = Money.add(acc.totalProfit, result.totalProfit);
      }
      return acc;
    }, { totalInvested: 0, totalProfit: 0 });
  }, [stockGroups]);

  const overallProfitPercentage = overallTotals.totalInvested > 0
    ? Money.multiply(Money.divide(overallTotals.totalProfit, overallTotals.totalInvested), 100)
    : 0;

  // Compute XIRR (money-weighted IRR) across groups when age is provided
  const computeXIRR = useMemo(() => {
    const flows: { amount: number; years: number }[] = [];

    stockGroups.forEach(group => {
      const numStocks = safeParseNumber(group.numStocks, 0);
      const pricePerStock = safeParseNumber(group.pricePerStock, 0);
      const totalProfit = safeParseNumber(group.totalProfit, 0);
      const age = safeParseNumber(group.age, 0);

      const invested = Money.multiply(numStocks, pricePerStock);
      if (invested > 0 && age > 0) {
        const years = group.ageUnit === 'days' ? Money.divide(age, 365) : Money.divide(age, 12);
        flows.push({ amount: -invested, years: 0 });
        flows.push({ amount: Money.add(invested, totalProfit), years });
      }
    });

    if (flows.length === 0) {return null;}

    // Validate: must have both inflow and outflow
    const hasOutflow = flows.some(f => f.amount < 0);
    const hasInflow = flows.some(f => f.amount > 0);
    if (!hasOutflow || !hasInflow) {return null;}

    const npv = (rate: number) => flows.reduce((s, f) => Money.add(s, Money.divide(f.amount, Money.pow(1 + rate, f.years))), 0);

    let low = -0.9999;
    let high = 10;
    let fLow = npv(low);
    let fHigh = npv(high);

    if (isNaN(fLow) || isNaN(fHigh) || !isFinite(fLow) || !isFinite(fHigh)) {return null;}

    // If signs are same, try expanding high
    let attempts = 0;
    while (fLow * fHigh > 0 && attempts < 50) {
      high *= 2;
      fHigh = npv(high);
      attempts += 1;
      if (!isFinite(fHigh)) {return null;}
    }

    if (fLow * fHigh > 0) {return null;}

    // Bisection with tighter tolerance for financial accuracy
    let mid = 0;
    for (let i = 0; i < 100; i++) {
      mid = (low + high) / 2;
      const fMid = npv(mid);
      if (Math.abs(fMid) < 1e-12) {break;} // Tighter tolerance
      if (fLow * fMid <= 0) {
        high = mid;
        fHigh = fMid;
      } else {
        low = mid;
        fLow = fMid;
      }
    }

    return mid * 100; // percentage
  }, [stockGroups]);

  const overallXIRR = computeXIRR;

  return (
    <div className={`bg-white rounded-lg shadow-md ${RESPONSIVE_PATTERNS.padding.cardLg} border border-gray-200`}>
      <Breadcrumbs />

      <h1 className={`${RESPONSIVE_PATTERNS.text.xl} font-bold text-gray-800 mb-2`}>Stock Profit Percentage Calculator</h1>
      <p className={`text-gray-600 ${RESPONSIVE_PATTERNS.text.sm} mb-6`}>Calculate profit percentage for your stock investments. Add multiple stock groups to track different purchases.</p>

      {stockGroups.map((group, index) => {
        const result = calculateProfit(group);

        return (
          <div
            key={group.id}
            className={`bg-gradient-to-br from-gray-50 via-white to-blue-50 rounded-lg shadow-md ${RESPONSIVE_PATTERNS.padding.card} border-2 border-gray-200 ${index > 0 ? 'mt-6' : ''}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`${RESPONSIVE_PATTERNS.text.lg} font-semibold bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent`}>
                📊 Stock Group {index + 1}
              </h2>
              <div className="flex gap-2 items-center">
                <button
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors flex items-center gap-1 border border-blue-200 px-2 py-1 rounded"
                  title="Simulate Profit"
                  onClick={() => {
                    const price = safeParseNumber(group.pricePerStock, 0);
                    const profit = safeParseNumber(group.totalProfit, 0);
                    const numStocks = Math.max(safeParseNumber(group.numStocks, 1), 1);
                    setSimModal({ open: true, price, profit: Money.divide(profit, numStocks) });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" /></svg>
                  Simulate Profit
                </button>
                {stockGroups.length > 1 && (
                  <button
                    onClick={() => removeStockGroup(group.id)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors flex items-center gap-1"
                    title="Remove this stock group"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Stocks Purchased</label>
                <input
                  type="number"
                  min="0"
                  value={group.numStocks}
                  onChange={e => updateStockGroup(group.id, 'numStocks', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder={PROFIT_CALCULATOR_TEXTS.PURCHASE_DETAILS.QUANTITY_PLACEHOLDER}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Average Price per Stock (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={group.pricePerStock}
                  onChange={e => updateStockGroup(group.id, 'pricePerStock', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder={PROFIT_CALCULATOR_TEXTS.PURCHASE_DETAILS.PURCHASE_PRICE_PLACEHOLDER}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profit Input</label>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <button
                    type="button"
                    className={`flex-1 min-w-[110px] px-3 py-2 rounded-lg transition-all duration-200 ${
                      group.profitInputType === 'total'
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    } text-xs font-semibold`}
                    onClick={() => updateStockGroup(group.id, 'profitInputType', 'total')}
                  >
                    Total Profit (₹)
                  </button>
                  <button
                    type="button"
                    className={`flex-1 min-w-[110px] px-3 py-2 rounded-lg transition-all duration-200 ${
                      group.profitInputType === 'perShare'
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    } text-xs font-semibold`}
                    onClick={() => updateStockGroup(group.id, 'profitInputType', 'perShare')}
                  >
                    Profit per Share (₹)
                  </button>
                  <button
                    type="button"
                    className={`flex-1 min-w-[110px] px-3 py-2 rounded-lg transition-all duration-200 ${
                      group.profitInputType === 'currentPrice'
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    } text-xs font-semibold`}
                    onClick={() => updateStockGroup(group.id, 'profitInputType', 'currentPrice')}
                  >
                    Current Price per Share (₹)
                  </button>
                </div>
                {group.profitInputType === 'total' && (
                  <input
                    type="number"
                    value={group.totalProfit}
                    onChange={e => updateStockGroup(group.id, 'totalProfit', e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                    placeholder={PROFIT_CALCULATOR_TEXTS.CURRENT_DETAILS.INVESTED_AMOUNT_PLACEHOLDER}
                  />
                )}
                {group.profitInputType === 'perShare' && (
                  <input
                    type="number"
                    value={group.profitPerShare}
                    onChange={e => updateStockGroup(group.id, 'profitPerShare', e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                    placeholder={PROFIT_CALCULATOR_TEXTS.CURRENT_DETAILS.CURRENT_QUANTITY_PLACEHOLDER}
                  />
                )}
                {group.profitInputType === 'currentPrice' && (
                  <input
                    type="number"
                    value={group.currentPricePerShare || ''}
                    onChange={e => updateStockGroup(group.id, 'currentPricePerShare', e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 transition-all"
                    placeholder={PROFIT_CALCULATOR_TEXTS.CURRENT_DETAILS.SELLING_PRICE_PLACEHOLDER}
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  min="0"
                  value={group.age}
                  onChange={e => updateStockGroup(group.id, 'age', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder={PROFIT_CALCULATOR_TEXTS.CURRENT_DETAILS.HOLDING_DAYS_PLACEHOLDER}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <select
                  value={group.ageUnit}
                  onChange={e => updateStockGroup(group.id, 'ageUnit', e.target.value as 'days' | 'months')}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            {result.isValid && (
              <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-300 relative">
                <button
                  className="absolute top-2 right-2 flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm px-3 py-1 rounded border border-blue-200 bg-white shadow transition-colors duration-150 z-10"
                  onClick={() => {
                    const price = safeParseNumber(group.pricePerStock, 0);
                    const profit = safeParseNumber(group.totalProfit, 0);
                    const numStocks = Math.max(safeParseNumber(group.numStocks, 1), 1);
                    setSimModal({ open: true, price, profit: Money.divide(profit, numStocks) });
                  }}
                  title="Simulate Profit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" /></svg>
                  Simulate Profit
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-gray-600 text-sm font-medium mb-1">Total Invested</div>
                    <div className="text-xl font-bold text-blue-600">₹{result.totalInvested.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 text-sm font-medium mb-1">Total Profit</div>
                    <div className={`text-xl font-bold ${result.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{result.totalProfit.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 text-sm font-medium mb-1">Profit Percentage</div>
                    <div className={`text-2xl font-bold ${result.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>{result.profitPercentage >= 0 ? '+' : ''}{result.profitPercentage.toFixed(2)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 text-sm font-medium mb-1">Annualized Return</div>
                    <div className={`text-2xl font-bold ${result.annualizedReturn !== null && result.annualizedReturn >= 0 ? 'text-green-600' : result.annualizedReturn !== null ? 'text-red-600' : 'text-gray-400'}`}>{result.annualizedReturn !== null ? `${result.annualizedReturn >= 0 ? '+' : ''}${result.annualizedReturn.toFixed(2)}%` : '--'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-6 flex justify-center">
        <button
          onClick={addStockGroup}
          className={`inline-flex items-center justify-center ${RESPONSIVE_PATTERNS.button.md} rounded-lg font-medium transition-colors bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md`}
        >
          <svg className={`${RESPONSIVE_PATTERNS.icon.sm} mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Another Stock Group
        </button>
      </div>

      {stockGroups.length > 1 && overallTotals.totalInvested > 0 && (
        <div className={`${RESPONSIVE_PATTERNS.margin.section} bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-lg ${RESPONSIVE_PATTERNS.padding.card}`}>
          <h3 className={`${RESPONSIVE_PATTERNS.text.lg} font-bold text-purple-800 mb-4`}>📈 Overall Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-gray-600 text-sm font-medium mb-1">Total Invested (All Groups)</div>
              <div className="text-2xl font-bold text-blue-600">₹{overallTotals.totalInvested.toFixed(2)}</div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-gray-600 text-sm font-medium mb-1">Total Profit (All Groups)</div>
              <div className={`text-2xl font-bold ${overallTotals.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{overallTotals.totalProfit.toFixed(2)}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-gray-600 text-sm font-medium mb-1">Overall Profit %</div>
              <div className={`text-3xl font-bold ${overallProfitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {overallProfitPercentage >= 0 ? '+' : ''}{overallProfitPercentage.toFixed(2)}%
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-gray-600 text-sm font-medium mb-1">Overall XIRR</div>
              <div className={`text-2xl font-bold ${overallXIRR !== null && overallXIRR >= 0 ? 'text-green-600' : overallXIRR !== null ? 'text-red-600' : 'text-gray-400'}`}>
                {overallXIRR !== null ? `${overallXIRR >= 0 ? '+' : ''}${overallXIRR.toFixed(2)}%` : '--'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`${RESPONSIVE_PATTERNS.margin.section} bg-blue-50 border border-blue-200 rounded-lg ${RESPONSIVE_PATTERNS.padding.card}`}>
        <h4 className={`${RESPONSIVE_PATTERNS.text.sm} font-semibold text-blue-900 ${RESPONSIVE_PATTERNS.margin.element}`}>💡 How it works</h4>
        <p className={`${RESPONSIVE_PATTERNS.text.sm} text-blue-800 ${RESPONSIVE_PATTERNS.margin.element}`}>
          <strong>Profit Percentage</strong> = (Total Profit ÷ Total Invested) × 100
        </p>
        <p className={`${RESPONSIVE_PATTERNS.text.sm} text-blue-800 ${RESPONSIVE_PATTERNS.margin.element}`}>
          <strong>Annualized Return</strong> = [(1 + Total Return)^(1/Years) - 1] × 100 (shown when age is entered)
        </p>
        <p className={`${RESPONSIVE_PATTERNS.text.xs} text-blue-700`}>
          <strong>Example:</strong> If you bought 100 stocks at ₹250 each (₹25,000 invested) and made a profit of ₹5,000, your profit percentage is 20%.
        </p>
        <p className={`${RESPONSIVE_PATTERNS.text.xs} text-blue-700 mt-2`}>
          <strong>Tip:</strong> Add multiple stock groups to calculate profit percentages for different purchases and see an overall summary. Enter the holding period to see annualized returns.
        </p>
      </div>

      {simModal?.open && (
        <ProfitSimulatorModal
          isOpen={simModal.open}
          onClose={() => setSimModal(null)}
          pricePerStock={simModal.price}
          profitPerStock={simModal.profit}
        />
      )}
    </div>
  );
}

export default StockProfitCalculator;
