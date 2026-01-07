import { useState } from 'react';
import Breadcrumbs from '../../../../navigation/Breadcrumbs';
import { RESPONSIVE_PATTERNS } from '../../../../../constants/responsive.constants';

interface StockGroup {
  id: number;
  numStocks: string;
  pricePerStock: string;
  totalProfit: string;
}

function StockProfitCalculator() {
  const [stockGroups, setStockGroups] = useState<StockGroup[]>([
    { id: 1, numStocks: '', pricePerStock: '', totalProfit: '' },
  ]);

  const addStockGroup = () => {
    const newId = Math.max(...stockGroups.map(g => g.id), 0) + 1;
    setStockGroups([...stockGroups, { id: newId, numStocks: '', pricePerStock: '', totalProfit: '' }]);
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
    const numStocks = parseFloat(group.numStocks) || 0;
    const pricePerStock = parseFloat(group.pricePerStock) || 0;
    const totalProfit = parseFloat(group.totalProfit) || 0;

    const totalInvested = numStocks * pricePerStock;
    const profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    return {
      totalInvested,
      profitPercentage,
      isValid: numStocks > 0 && pricePerStock > 0,
    };
  };

  // Calculate overall totals
  const overallTotals = stockGroups.reduce((acc, group) => {
    const result = calculateProfit(group);
    if (result.isValid) {
      acc.totalInvested += result.totalInvested;
      acc.totalProfit += parseFloat(group.totalProfit) || 0;
    }
    return acc;
  }, { totalInvested: 0, totalProfit: 0 });

  const overallProfitPercentage = overallTotals.totalInvested > 0
    ? (overallTotals.totalProfit / overallTotals.totalInvested) * 100
    : 0;

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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Stocks Purchased</label>
                <input
                  type="number"
                  min="0"
                  value={group.numStocks}
                  onChange={e => updateStockGroup(group.id, 'numStocks', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="e.g., 100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Average Price per Stock (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={group.pricePerStock}
                  onChange={e => updateStockGroup(group.id, 'pricePerStock', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="e.g., 250.50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Profit (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={group.totalProfit}
                  onChange={e => updateStockGroup(group.id, 'totalProfit', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="e.g., 5000"
                />
              </div>
            </div>

            {result.isValid && (
              <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-300">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-gray-600 text-sm font-medium mb-1">Total Invested</div>
                    <div className="text-xl font-bold text-blue-600">₹{result.totalInvested.toFixed(2)}</div>
                  </div>

                  <div className="text-center">
                    <div className="text-gray-600 text-sm font-medium mb-1">Total Profit</div>
                    <div className={`text-xl font-bold ${parseFloat(group.totalProfit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{parseFloat(group.totalProfit || '0').toFixed(2)}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-gray-600 text-sm font-medium mb-1">Profit Percentage</div>
                    <div className={`text-2xl font-bold ${result.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.profitPercentage >= 0 ? '+' : ''}{result.profitPercentage.toFixed(2)}%
                    </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          </div>
        </div>
      )}

      <div className={`${RESPONSIVE_PATTERNS.margin.section} bg-blue-50 border border-blue-200 rounded-lg ${RESPONSIVE_PATTERNS.padding.card}`}>
        <h4 className={`${RESPONSIVE_PATTERNS.text.sm} font-semibold text-blue-900 ${RESPONSIVE_PATTERNS.margin.element}`}>💡 How it works</h4>
        <p className={`${RESPONSIVE_PATTERNS.text.sm} text-blue-800 ${RESPONSIVE_PATTERNS.margin.element}`}>
          <strong>Profit Percentage</strong> = (Total Profit ÷ Total Invested) × 100
        </p>
        <p className={`${RESPONSIVE_PATTERNS.text.xs} text-blue-700`}>
          <strong>Example:</strong> If you bought 100 stocks at ₹250 each (₹25,000 invested) and made a profit of ₹5,000, your profit percentage is 20%.
        </p>
        <p className={`${RESPONSIVE_PATTERNS.text.xs} text-blue-700 mt-2`}>
          <strong>Tip:</strong> Add multiple stock groups to calculate profit percentages for different purchases and see an overall summary.
        </p>
      </div>
    </div>
  );
}

export default StockProfitCalculator;
