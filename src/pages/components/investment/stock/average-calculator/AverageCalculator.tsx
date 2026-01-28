import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../../../navigation/Breadcrumbs';
import { RESPONSIVE_PATTERNS } from '../../../../../constants/responsive.constants';
import { Money, safeParseNumber } from '../../../../../utils/financial';

interface CalculationResult {
  newAvgPrice: number | null;
  requiredQuantity: number | null;
}

function AverageCalculator() {
  const [calculationMode, setCalculationMode] = useState<'purchase' | 'target'>('purchase');
  const [currentInputMode, setCurrentInputMode] = useState<'price' | 'total'>('price');
  const [buyInputMode, setBuyInputMode] = useState<'price' | 'total'>('price');
  const [currentQuantity, setCurrentQuantity] = useState<string>('');
  const [currentAvgPrice, setCurrentAvgPrice] = useState<string>('');
  const [currentTotalPrice, setCurrentTotalPrice] = useState<string>('');
  const [buyQuantity, setBuyQuantity] = useState<string>('');
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [buyTotalPrice, setBuyTotalPrice] = useState<string>('');
  const [targetAvgPrice, setTargetAvgPrice] = useState<string>('');
  const [currentMarketPrice, setCurrentMarketPrice] = useState<string>('');

  // Calculate result using useMemo with precise decimal arithmetic
  const calculationResult = useMemo<CalculationResult>(() => {
    const currQty = safeParseNumber(currentQuantity, 0);
    const addQty = safeParseNumber(buyQuantity, 0);

    let currPrice = 0;

    if (currentInputMode === 'price') {
      currPrice = safeParseNumber(currentAvgPrice, 0);
    } else {
      const currTotal = safeParseNumber(currentTotalPrice, 0);
      currPrice = currQty > 0 ? Money.divide(currTotal, currQty) : 0;
    }

    if (calculationMode === 'purchase') {
      let addPrice = 0;

      if (buyInputMode === 'price') {
        addPrice = safeParseNumber(buyPrice, 0);
      } else {
        const addTotal = safeParseNumber(buyTotalPrice, 0);
        addPrice = addQty > 0 ? Money.divide(addTotal, addQty) : 0;
      }

      const hasCurrentData = currentInputMode === 'price'
        ? currentQuantity && currentAvgPrice
        : currentQuantity && currentTotalPrice;

      const hasBuyData = buyInputMode === 'price'
        ? buyQuantity && buyPrice
        : buyQuantity && buyTotalPrice;

      if (hasCurrentData && hasBuyData && currQty >= 0 && currPrice >= 0 && addQty > 0 && addPrice > 0) {
        // totalCost = (currQty * currPrice) + (addQty * addPrice)
        const currentCost = Money.multiply(currQty, currPrice);
        const addCost = Money.multiply(addQty, addPrice);
        const totalCost = Money.add(currentCost, addCost);
        const totalQuantity = Money.add(currQty, addQty);
        const newAvg = totalQuantity > 0 ? Money.divide(totalCost, totalQuantity) : 0;
        return { newAvgPrice: newAvg, requiredQuantity: null };
      } else {
        return { newAvgPrice: null, requiredQuantity: null };
      }
    } else {
      const targetAvg = safeParseNumber(targetAvgPrice, 0);
      const marketPrice = safeParseNumber(currentMarketPrice, 0);

      const hasCurrentData = currentInputMode === 'price'
        ? currentQuantity && currentAvgPrice
        : currentQuantity && currentTotalPrice;

      if (hasCurrentData && targetAvgPrice && currentMarketPrice && currQty >= 0 && currPrice >= 0 && targetAvg > 0 && marketPrice > 0) {
        const denominator = Money.subtract(targetAvg, marketPrice);

        if (Math.abs(denominator) > 0.01) {
          // requiredQty = currQty * (currPrice - targetAvg) / denominator
          const numerator = Money.multiply(currQty, Money.subtract(currPrice, targetAvg));
          const requiredQty = Money.divide(numerator, denominator);

          if (requiredQty > 0) {
            return { newAvgPrice: targetAvg, requiredQuantity: requiredQty };
          } else {
            return { newAvgPrice: null, requiredQuantity: null };
          }
        } else {
          return { newAvgPrice: null, requiredQuantity: null };
        }
      } else {
        return { newAvgPrice: null, requiredQuantity: null };
      }
    }
  }, [calculationMode, currentInputMode, buyInputMode, currentQuantity, currentAvgPrice, currentTotalPrice, buyQuantity, buyPrice, buyTotalPrice, targetAvgPrice, currentMarketPrice]);

  const handleCurrentQuantityChange = (value: string) => {
    setCurrentQuantity(value);
    // In total mode, update total automatically
    if (currentInputMode === 'total' && currentAvgPrice) {
      const qty = safeParseNumber(value, 0);
      const total = safeParseNumber(currentTotalPrice, 0);
      if (qty > 0 && total > 0) {
        setCurrentAvgPrice((Money.divide(total, qty)).toString());
      }
    }
  };

  const handleCurrentPriceChange = (value: string) => {
    setCurrentAvgPrice(value);
    // Just store the value, computedCurrentTotal will handle calculation
  };

  const handleCurrentTotalPriceChange = (value: string) => {
    setCurrentTotalPrice(value);
    // Update average price when in total mode
    if (currentQuantity) {
      const qty = safeParseNumber(currentQuantity, 0);
      const total = safeParseNumber(value, 0);
      if (qty > 0) {
        setCurrentAvgPrice((Money.divide(total, qty)).toString());
      }
    }
  };

  const handleBuyQuantityChange = (value: string) => {
    setBuyQuantity(value);
    // In total mode, update total automatically
    if (buyInputMode === 'total' && buyPrice) {
      const qty = safeParseNumber(value, 0);
      const total = safeParseNumber(buyTotalPrice, 0);
      if (qty > 0 && total > 0) {
        setBuyPrice((Money.divide(total, qty)).toString());
      }
    }
  };

  const handleBuyPriceChange = (value: string) => {
    setBuyPrice(value);
    // Just store the value, computedBuyTotal will handle calculation
  };

  const handleBuyTotalPriceChange = (value: string) => {
    setBuyTotalPrice(value);
    // Update average price when in total mode
    if (buyQuantity) {
      const qty = safeParseNumber(buyQuantity, 0);
      const total = safeParseNumber(value, 0);
      if (qty > 0) {
        setBuyPrice((Money.divide(total, qty)).toString());
      }
    }
  };

  const toggleCurrentInputMode = () => {
    setCurrentInputMode(prevMode => prevMode === 'price' ? 'total' : 'price');
  };

  const toggleBuyInputMode = () => {
    setBuyInputMode(prevMode => prevMode === 'price' ? 'total' : 'price');
  };

  const handleReset = () => {
    setCurrentQuantity('');
    setCurrentAvgPrice('');
    setCurrentTotalPrice('');
    setBuyQuantity('');
    setBuyPrice('');
    setBuyTotalPrice('');
    setTargetAvgPrice('');
    setCurrentMarketPrice('');
  };

  const toggleCalculationMode = () => {
    setCalculationMode(prevMode => prevMode === 'purchase' ? 'target' : 'purchase');
    setBuyQuantity('');
    setBuyPrice('');
    setBuyTotalPrice('');
    setTargetAvgPrice('');
    setCurrentMarketPrice('');
  };

  return (
    <div className={RESPONSIVE_PATTERNS.padding.page}>
      <Breadcrumbs />
      <div className={RESPONSIVE_PATTERNS.margin.section}>
        <Link
          to="/investment/stock"
          className={`text-blue-600 hover:text-blue-800 hover:bg-blue-50 ${RESPONSIVE_PATTERNS.text.sm} font-medium inline-flex items-center ${RESPONSIVE_PATTERNS.gap.xs} ${RESPONSIVE_PATTERNS.margin.subsection} px-3 py-2 rounded-md transition-colors`}
        >
          ← Back to Stock
        </Link>
        <h1 className={`${RESPONSIVE_PATTERNS.text['3xl']} font-bold text-gray-800`}>Average Price Calculator</h1>
        <p className={`${RESPONSIVE_PATTERNS.text.base} text-gray-600 mt-1`}>Calculate your new average price after accumulating more shares</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className={`bg-white rounded-lg shadow-md ${RESPONSIVE_PATTERNS.padding.cardLg} border border-gray-200`}>
          <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${RESPONSIVE_PATTERNS.margin.section} ${RESPONSIVE_PATTERNS.gap.sm}`}>
            <h2 className={`${RESPONSIVE_PATTERNS.text.xl} font-semibold text-gray-800`}>Current Holdings</h2>
            <div className="flex">
              <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() => currentInputMode !== 'price' && toggleCurrentInputMode()}
                  className={`${RESPONSIVE_PATTERNS.button.sm} font-medium transition-colors ${currentInputMode === 'price' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Price
                </button>
                <button
                  type="button"
                  onClick={() => currentInputMode !== 'total' && toggleCurrentInputMode()}
                  className={`${RESPONSIVE_PATTERNS.button.sm} font-medium transition-colors border-l border-gray-300 ${currentInputMode === 'total' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Total
                </button>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 ${RESPONSIVE_PATTERNS.gap.lg} ${RESPONSIVE_PATTERNS.margin.section}`}>
            <div>
              <label htmlFor="currentQuantity" className={`block ${RESPONSIVE_PATTERNS.text.sm} font-medium text-gray-700 ${RESPONSIVE_PATTERNS.margin.element}`}>
                  Current Holding Quantity <span title="How many shares you currently own.">ℹ️</span>
              </label>
              <input
                type="number"
                id="currentQuantity"
                value={currentQuantity}
                onChange={(e) => handleCurrentQuantityChange(e.target.value)}
                placeholder="e.g., 100"
                min="0"
                step="1"
                className={`w-full ${RESPONSIVE_PATTERNS.padding.md} ${RESPONSIVE_PATTERNS.text.base} border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              />
            </div>

            {currentInputMode === 'price' ? (
              <div>
                <label htmlFor="currentAvgPrice" className={`block ${RESPONSIVE_PATTERNS.text.sm} font-medium text-gray-700 ${RESPONSIVE_PATTERNS.margin.element}`}>
                  Current Average Price (₹) <span title="Your average buy price per share so far.">ℹ️</span>
                </label>
                <input
                  type="number"
                  id="currentAvgPrice"
                  value={currentAvgPrice}
                  onChange={(e) => handleCurrentPriceChange(e.target.value)}
                  placeholder="e.g., 150.50"
                  min="0"
                  step="0.01"
                  className={`w-full ${RESPONSIVE_PATTERNS.padding.md} ${RESPONSIVE_PATTERNS.text.base} border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="currentTotalPrice" className={`block ${RESPONSIVE_PATTERNS.text.sm} font-medium text-gray-700 ${RESPONSIVE_PATTERNS.margin.element}`}>
                  Total Amount Invested (₹) <span title="Total money spent on your current holdings.">ℹ️</span>
                </label>
                <input
                  type="number"
                  id="currentTotalPrice"
                  value={currentTotalPrice}
                  onChange={(e) => handleCurrentTotalPriceChange(e.target.value)}
                  placeholder="e.g., 15050.00"
                  min="0"
                  step="0.01"
                  className={`w-full ${RESPONSIVE_PATTERNS.padding.md} ${RESPONSIVE_PATTERNS.text.base} border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                />
              </div>
            )}
          </div>

          <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${RESPONSIVE_PATTERNS.margin.section} border-t border-gray-200 pt-4 sm:pt-6 ${RESPONSIVE_PATTERNS.gap.sm}`}>
            <h2 className={`${RESPONSIVE_PATTERNS.text.xl} font-semibold text-gray-800`}>
              {calculationMode === 'purchase' ? 'New Purchase Details' : 'Target Average Price'}
            </h2>
            <div className="flex justify-start sm:justify-end">
              <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() => calculationMode !== 'purchase' && toggleCalculationMode()}
                  className={`${RESPONSIVE_PATTERNS.button.sm} font-medium transition-colors ${calculationMode === 'purchase' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Purchase
                </button>
                <button
                  type="button"
                  onClick={() => calculationMode !== 'target' && toggleCalculationMode()}
                  className={`${RESPONSIVE_PATTERNS.button.sm} font-medium transition-colors border-l border-gray-300 ${calculationMode === 'target' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Target
                </button>
              </div>
            </div>
          </div>

          {calculationMode === 'purchase' ? (
            <>
              <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 ${RESPONSIVE_PATTERNS.gap.sm}`}>
                <p className={`${RESPONSIVE_PATTERNS.text.sm} text-gray-600`}>Enter your purchase details</p>
                <div className="flex">
                  <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => buyInputMode !== 'price' && toggleBuyInputMode()}
                      className={`${RESPONSIVE_PATTERNS.button.sm} font-medium transition-colors ${buyInputMode === 'price' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      Price
                    </button>
                    <button
                      type="button"
                      onClick={() => buyInputMode !== 'total' && toggleBuyInputMode()}
                      className={`${RESPONSIVE_PATTERNS.button.sm} font-medium transition-colors border-l border-gray-300 ${buyInputMode === 'total' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      Total
                    </button>
                  </div>
                </div>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 ${RESPONSIVE_PATTERNS.gap.lg} ${RESPONSIVE_PATTERNS.margin.section}`}>
                <div>
                  <label htmlFor="buyQuantity" className={`block ${RESPONSIVE_PATTERNS.text.sm} font-medium text-gray-700 ${RESPONSIVE_PATTERNS.margin.element}`}>
                    Quantity to Buy <span title="How many new shares you want to purchase.">ℹ️</span>
                  </label>
                  <input
                    type="number"
                    id="buyQuantity"
                    value={buyQuantity}
                    onChange={(e) => handleBuyQuantityChange(e.target.value)}
                    placeholder="e.g., 50"
                    min="0"
                    step="1"
                    className={`w-full ${RESPONSIVE_PATTERNS.padding.md} ${RESPONSIVE_PATTERNS.text.base} border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                  />
                </div>

                {buyInputMode === 'price' ? (
                  <div>
                    <label htmlFor="buyPrice" className={`block ${RESPONSIVE_PATTERNS.text.sm} font-medium text-gray-700 ${RESPONSIVE_PATTERNS.margin.element}`}>
                      Purchase Average Price (₹) <span title="Expected price per share for your new purchase.">ℹ️</span>
                    </label>
                    <input
                      type="number"
                      id="buyPrice"
                      value={buyPrice}
                      onChange={(e) => handleBuyPriceChange(e.target.value)}
                      placeholder="e.g., 140.00"
                      min="0"
                      step="0.01"
                      className={`w-full ${RESPONSIVE_PATTERNS.padding.md} ${RESPONSIVE_PATTERNS.text.base} border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="buyTotalPrice" className={`block ${RESPONSIVE_PATTERNS.text.sm} font-medium text-gray-700 ${RESPONSIVE_PATTERNS.margin.element}`}>
                      Total Amount to Invest (₹) <span title="Total money you plan to spend on this new purchase.">ℹ️</span>
                    </label>
                    <input
                      type="number"
                      id="buyTotalPrice"
                      value={buyTotalPrice}
                      onChange={(e) => handleBuyTotalPriceChange(e.target.value)}
                      placeholder="e.g., 7000.00"
                      min="0"
                      step="0.01"
                      className={`w-full ${RESPONSIVE_PATTERNS.padding.md} ${RESPONSIVE_PATTERNS.text.base} border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <p className={`${RESPONSIVE_PATTERNS.text.sm} text-gray-600 mb-4`}>Enter target average price and current market price to calculate quantity needed</p>
              <div className={`grid grid-cols-1 md:grid-cols-2 ${RESPONSIVE_PATTERNS.gap.lg} ${RESPONSIVE_PATTERNS.margin.section}`}>
                <div>
                  <label htmlFor="currentMarketPrice" className={`block ${RESPONSIVE_PATTERNS.text.sm} font-medium text-gray-700 ${RESPONSIVE_PATTERNS.margin.element}`}>
                    Current Market Price Per Share (₹)
                  </label>
                  <input
                    type="number"
                    id="currentMarketPrice"
                    value={currentMarketPrice}
                    onChange={(e) => setCurrentMarketPrice(e.target.value)}
                    placeholder="e.g., 140.00"
                    min="0"
                    step="0.01"
                    className={`w-full ${RESPONSIVE_PATTERNS.padding.md} ${RESPONSIVE_PATTERNS.text.base} border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label htmlFor="targetAvgPrice" className={`block ${RESPONSIVE_PATTERNS.text.sm} font-medium text-gray-700 ${RESPONSIVE_PATTERNS.margin.element}`}>
                    Target Average Price (₹)
                  </label>
                  <input
                    type="number"
                    id="targetAvgPrice"
                    value={targetAvgPrice}
                    onChange={(e) => setTargetAvgPrice(e.target.value)}
                    placeholder="e.g., 145.00"
                    min="0"
                    step="0.01"
                    className={`w-full ${RESPONSIVE_PATTERNS.padding.md} ${RESPONSIVE_PATTERNS.text.base} border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                </div>
              </div>

              {calculationResult.requiredQuantity !== null && (
                <>
                  {/* Quantity to Buy card at the top */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-white border-2 border-indigo-200 rounded-xl shadow-lg px-8 py-6 flex flex-col items-center max-w-xs w-full">
                      <div className="text-indigo-600 text-base font-semibold mb-2">Quantity to Buy</div>
                      <div className="text-4xl font-extrabold text-indigo-700 mb-1">{calculationResult.requiredQuantity.toFixed(0)} shares</div>
                      <div className="text-gray-500 text-xs">This is the number of shares you need to buy to reach your target average.</div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}


          <div className={`flex ${RESPONSIVE_PATTERNS.gap.md} ${RESPONSIVE_PATTERNS.margin.section}`}>
            <button
              onClick={handleReset}
              className={`flex-1 ${RESPONSIVE_PATTERNS.button.md} border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors`}
            >
              Reset
            </button>
          </div>

          {/* Result card row for Target mode, below Reset button */}
          {calculationMode === 'target' && calculationResult.requiredQuantity !== null && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-lg px-2 py-6 sm:py-8 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                  <div className="text-gray-600 text-sm mb-1 flex items-center gap-1">Total Quantity <span title="Total shares after your new purchase." className="text-blue-400">ℹ️</span></div>
                  <div className="text-2xl font-bold text-gray-800">{((parseFloat(currentQuantity) || 0) + calculationResult.requiredQuantity).toFixed(0)}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                  <div className="text-gray-600 text-sm mb-1 flex items-center gap-1">Total Investment <span title="Sum of your previous and new investments." className="text-blue-400">ℹ️</span></div>
                  <div className="text-2xl font-bold text-gray-800">
                    ₹{(() => {
                      const currQty = safeParseNumber(currentQuantity, 0);
                      const currPrice = currentInputMode === 'price'
                        ? safeParseNumber(currentAvgPrice, 0)
                        : Money.divide(safeParseNumber(currentTotalPrice, 0), Math.max(currQty, 1));
                      const marketPrice = safeParseNumber(currentMarketPrice, 0);
                      const currentInvestment = Money.multiply(currQty, currPrice);
                      const newInvestment = Money.multiply(calculationResult.requiredQuantity || 0, marketPrice);
                      return Money.add(currentInvestment, newInvestment).toFixed(2);
                    })()}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                  <div className="text-indigo-700 text-sm mb-1 flex items-center gap-1">New Purchase Amount <span title="Amount needed for this new purchase only." className="text-blue-400">ℹ️</span></div>
                  <div className="text-2xl font-bold text-indigo-700">
                    ₹{Money.multiply(calculationResult.requiredQuantity || 0, safeParseNumber(currentMarketPrice, 0)).toFixed(2)}
                  </div>
                </div>
                <div className="bg-orange-100 rounded-lg shadow p-4 flex flex-col items-center border-2 border-orange-300">
                  <div className="text-orange-600 text-sm font-medium mb-1 flex items-center gap-1">New Average Price <span title="Your new average price per share after this purchase." className="text-blue-400">ℹ️</span></div>
                  <div className="text-3xl font-bold text-orange-600">₹{targetAvgPrice}</div>
                </div>
              </div>
            </div>
          )}

          {calculationMode === 'purchase' && calculationResult.newAvgPrice !== null && (
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-lg px-2 py-6 sm:py-8 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                  <div className="text-gray-600 text-sm mb-1 flex items-center gap-1">Total Quantity <span title="Total shares after your new purchase." className="text-blue-400">ℹ️</span></div>
                  <div className="text-2xl font-bold text-gray-800">{((parseFloat(currentQuantity) || 0) + (parseFloat(buyQuantity) || 0)).toFixed(0)}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                  <div className="text-gray-600 text-sm mb-1 flex items-center gap-1">Total Investment <span title="Sum of your previous and new investments." className="text-blue-400">ℹ️</span></div>
                  <div className="text-2xl font-bold text-gray-800">
                    ₹{(() => {
                      const currQty = safeParseNumber(currentQuantity, 0);
                      const currPrice = currentInputMode === 'price'
                        ? safeParseNumber(currentAvgPrice, 0)
                        : Money.divide(safeParseNumber(currentTotalPrice, 0), Math.max(currQty, 1));
                      const currentInvestment = Money.multiply(currQty, currPrice);
                      const newInvestment = buyInputMode === 'price'
                        ? Money.multiply(safeParseNumber(buyQuantity, 0), safeParseNumber(buyPrice, 0))
                        : safeParseNumber(buyTotalPrice, 0);
                      return Money.add(currentInvestment, newInvestment).toFixed(2);
                    })()}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                  <div className="text-indigo-700 text-sm mb-1 flex items-center gap-1">New Purchase Amount <span title="Amount needed for this new purchase only." className="text-blue-400">ℹ️</span></div>
                  <div className="text-2xl font-bold text-indigo-700">
                    ₹{(() => {
                      return buyInputMode === 'price'
                        ? Money.multiply(safeParseNumber(buyQuantity, 0), safeParseNumber(buyPrice, 0)).toFixed(2)
                        : safeParseNumber(buyTotalPrice, 0).toFixed(2);
                    })()}
                  </div>
                </div>
                <div className="bg-orange-100 rounded-lg shadow p-4 flex flex-col items-center border-2 border-orange-300">
                  <div className="text-orange-600 text-sm font-medium mb-1 flex items-center gap-1">New Average Price <span title="Your new average price per share after this purchase." className="text-blue-400">ℹ️</span></div>
                  <div className="text-3xl font-bold text-orange-600">₹{calculationResult.newAvgPrice.toFixed(2)}</div>
                </div>
              </div>
              <div className="mt-4 text-center text-gray-700 text-base">
                After buying <span className="font-semibold">{safeParseNumber(buyQuantity, 0).toFixed(0)}</span> shares for ₹<span className="font-semibold">{(() => {
                  return buyInputMode === 'price'
                    ? Money.multiply(safeParseNumber(buyQuantity, 0), safeParseNumber(buyPrice, 0)).toFixed(2)
                    : safeParseNumber(buyTotalPrice, 0).toFixed(2);
                })()}</span>, your new average price will be <span className="font-semibold text-orange-600">₹{calculationResult.newAvgPrice.toFixed(2)}</span> for a total of <span className="font-semibold">{Money.add(safeParseNumber(currentQuantity, 0), safeParseNumber(buyQuantity, 0)).toFixed(0)}</span> shares.
              </div>
            </div>
          )}
        </div>

        <div className={`${RESPONSIVE_PATTERNS.margin.section} bg-blue-50 border border-blue-200 rounded-lg ${RESPONSIVE_PATTERNS.padding.card}`}>
          <h4 className={`${RESPONSIVE_PATTERNS.text.sm} font-semibold text-blue-900 ${RESPONSIVE_PATTERNS.margin.element}`}>💡 How it works</h4>
          <p className={`${RESPONSIVE_PATTERNS.text.sm} text-blue-800 ${RESPONSIVE_PATTERNS.margin.element}`}>
            New Average Price = (Current Quantity × Current Avg Price + Buy Quantity × Buy Price) ÷ (Current Quantity + Buy Quantity)
          </p>
          <p className={`${RESPONSIVE_PATTERNS.text.xs} text-blue-700`}>
            <strong>Tip:</strong> Toggle between "Price" and "Total" mode to enter data based on average price per share or total amount invested.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AverageCalculator;
