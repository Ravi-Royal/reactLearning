import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../../../navigation/Breadcrumbs';

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

  // Calculate result using useMemo to avoid cascading renders
  const calculationResult = useMemo<CalculationResult>(() => {
    const currQty = parseFloat(currentQuantity) || 0;
    const addQty = parseFloat(buyQuantity) || 0;

    let currPrice = 0;

    if (currentInputMode === 'price') {
      currPrice = parseFloat(currentAvgPrice) || 0;
    } else {
      const currTotal = parseFloat(currentTotalPrice) || 0;
      currPrice = currQty > 0 ? currTotal / currQty : 0;
    }

    if (calculationMode === 'purchase') {
      let addPrice = 0;

      if (buyInputMode === 'price') {
        addPrice = parseFloat(buyPrice) || 0;
      } else {
        const addTotal = parseFloat(buyTotalPrice) || 0;
        addPrice = addQty > 0 ? addTotal / addQty : 0;
      }

      const hasCurrentData = currentInputMode === 'price'
        ? currentQuantity && currentAvgPrice
        : currentQuantity && currentTotalPrice;

      const hasBuyData = buyInputMode === 'price'
        ? buyQuantity && buyPrice
        : buyQuantity && buyTotalPrice;

      if (hasCurrentData && hasBuyData && currQty >= 0 && currPrice >= 0 && addQty > 0 && addPrice > 0) {
        const totalCost = (currQty * currPrice) + (addQty * addPrice);
        const totalQuantity = currQty + addQty;
        const newAvg = totalQuantity > 0 ? totalCost / totalQuantity : 0;
        return { newAvgPrice: newAvg, requiredQuantity: null };
      } else {
        return { newAvgPrice: null, requiredQuantity: null };
      }
    } else {
      const targetAvg = parseFloat(targetAvgPrice) || 0;
      const marketPrice = parseFloat(currentMarketPrice) || 0;

      const hasCurrentData = currentInputMode === 'price'
        ? currentQuantity && currentAvgPrice
        : currentQuantity && currentTotalPrice;

      if (hasCurrentData && targetAvgPrice && currentMarketPrice && currQty >= 0 && currPrice >= 0 && targetAvg > 0 && marketPrice > 0) {
        const denominator = targetAvg - marketPrice;

        if (Math.abs(denominator) > 0.01) {
          const requiredQty = currQty * (currPrice - targetAvg) / denominator;

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
    // Update total price if in price mode
    if (currentInputMode === 'price' && currentAvgPrice) {
      const qty = parseFloat(value) || 0;
      const price = parseFloat(currentAvgPrice) || 0;
      setCurrentTotalPrice((qty * price).toFixed(2));
    }
  };

  const handleCurrentPriceChange = (value: string) => {
    setCurrentAvgPrice(value);
    // Update total price
    if (currentQuantity) {
      const qty = parseFloat(currentQuantity) || 0;
      const price = parseFloat(value) || 0;
      setCurrentTotalPrice((qty * price).toFixed(2));
    }
  };

  const handleCurrentTotalPriceChange = (value: string) => {
    setCurrentTotalPrice(value);
    // Update average price
    if (currentQuantity) {
      const qty = parseFloat(currentQuantity) || 0;
      const total = parseFloat(value) || 0;
      setCurrentAvgPrice(qty > 0 ? (total / qty).toFixed(2) : '0');
    }
  };

  const handleBuyQuantityChange = (value: string) => {
    setBuyQuantity(value);
    // Update total price if in price mode
    if (buyInputMode === 'price' && buyPrice) {
      const qty = parseFloat(value) || 0;
      const price = parseFloat(buyPrice) || 0;
      setBuyTotalPrice((qty * price).toFixed(2));
    }
  };

  const handleBuyPriceChange = (value: string) => {
    setBuyPrice(value);
    // Update total price
    if (buyQuantity) {
      const qty = parseFloat(buyQuantity) || 0;
      const price = parseFloat(value) || 0;
      setBuyTotalPrice((qty * price).toFixed(2));
    }
  };

  const handleBuyTotalPriceChange = (value: string) => {
    setBuyTotalPrice(value);
    // Update average price
    if (buyQuantity) {
      const qty = parseFloat(buyQuantity) || 0;
      const total = parseFloat(value) || 0;
      setBuyPrice(qty > 0 ? (total / qty).toFixed(2) : '0');
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
    <div className="p-6">
      <Breadcrumbs />
      <div className="mb-6">
        <Link
          to="/investment/stock"
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-sm font-medium flex items-center gap-2 mb-4 px-3 py-2 rounded-md transition-colors w-fit"
        >
          ← Back to Stock
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Average Price Calculator</h1>
        <p className="text-gray-600 mt-1">Calculate your new average price after accumulating more shares</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Current Holdings</h2>
            <button
              onClick={toggleCurrentInputMode}
              className={`relative inline-flex items-center h-7 rounded-full w-28 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${currentInputMode === 'price' ? 'bg-blue-600' : 'bg-green-600'
              }`}
            >
              <span
                className={`inline-block w-14 h-6 transform rounded-full bg-white shadow-lg transition-transform ${currentInputMode === 'price' ? 'translate-x-0.5' : 'translate-x-[52px]'
                }`}
              />
              <span className="absolute left-2 text-xs font-medium text-white">Price</span>
              <span className="absolute right-2 text-xs font-medium text-white">Total</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="currentQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                Current Holding Quantity
              </label>
              <input
                type="number"
                id="currentQuantity"
                value={currentQuantity}
                onChange={(e) => handleCurrentQuantityChange(e.target.value)}
                placeholder="e.g., 100"
                min="0"
                step="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {currentInputMode === 'price' ? (
              <div>
                <label htmlFor="currentAvgPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Average Price (₹)
                </label>
                <input
                  type="number"
                  id="currentAvgPrice"
                  value={currentAvgPrice}
                  onChange={(e) => handleCurrentPriceChange(e.target.value)}
                  placeholder="e.g., 150.50"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="currentTotalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount Invested (₹)
                </label>
                <input
                  type="number"
                  id="currentTotalPrice"
                  value={currentTotalPrice}
                  onChange={(e) => handleCurrentTotalPriceChange(e.target.value)}
                  placeholder="e.g., 15050.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {calculationMode === 'purchase' ? 'New Purchase Details' : 'Target Average Price'}
            </h2>
            <button
              onClick={toggleCalculationMode}
              className={`relative inline-flex items-center h-7 rounded-full w-32 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${calculationMode === 'purchase' ? 'bg-purple-600' : 'bg-indigo-600'
              }`}
            >
              <span
                className={`inline-block w-16 h-6 transform rounded-full bg-white shadow-lg transition-transform ${calculationMode === 'purchase' ? 'translate-x-0.5' : 'translate-x-[62px]'
                }`}
              />
              <span className="absolute left-1.5 text-[10px] font-medium text-white">Purchase</span>
              <span className="absolute right-2 text-[10px] font-medium text-white">Target</span>
            </button>
          </div>

          {calculationMode === 'purchase' ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">Enter your purchase details</p>
                <button
                  onClick={toggleBuyInputMode}
                  className={`relative inline-flex items-center h-7 rounded-full w-28 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${buyInputMode === 'price' ? 'bg-blue-600' : 'bg-green-600'
                  }`}
                >
                  <span
                    className={`inline-block w-14 h-6 transform rounded-full bg-white shadow-lg transition-transform ${buyInputMode === 'price' ? 'translate-x-0.5' : 'translate-x-[52px]'
                    }`}
                  />
                  <span className="absolute left-2 text-xs font-medium text-white">Price</span>
                  <span className="absolute right-2 text-xs font-medium text-white">Total</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="buyQuantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity to Buy
                  </label>
                  <input
                    type="number"
                    id="buyQuantity"
                    value={buyQuantity}
                    onChange={(e) => handleBuyQuantityChange(e.target.value)}
                    placeholder="e.g., 50"
                    min="0"
                    step="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {buyInputMode === 'price' ? (
                  <div>
                    <label htmlFor="buyPrice" className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Average Price (₹)
                    </label>
                    <input
                      type="number"
                      id="buyPrice"
                      value={buyPrice}
                      onChange={(e) => handleBuyPriceChange(e.target.value)}
                      placeholder="e.g., 140.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="buyTotalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                      Total Amount to Invest (₹)
                    </label>
                    <input
                      type="number"
                      id="buyTotalPrice"
                      value={buyTotalPrice}
                      onChange={(e) => handleBuyTotalPriceChange(e.target.value)}
                      placeholder="e.g., 7000.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">Enter target average price and current market price to calculate quantity needed</p>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="currentMarketPrice" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="targetAvgPrice" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {calculationResult.requiredQuantity !== null && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Purchase Details</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-center">
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <div className="text-sm text-purple-600 font-medium mb-1">Quantity to Buy</div>
                      <div className="text-3xl font-bold text-purple-600">
                        {calculationResult.requiredQuantity.toFixed(0)} shares
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <div className="text-sm text-indigo-600 font-medium mb-1">Total Investment</div>
                      <div className="text-2xl font-bold text-indigo-600">
                        ₹{(calculationResult.requiredQuantity * (parseFloat(currentMarketPrice) || 0)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-4 text-center">
                    Buy {calculationResult.requiredQuantity.toFixed(0)} shares at ₹{currentMarketPrice} per share to achieve your target average of ₹{targetAvgPrice}
                  </p>
                </div>
              )}
            </>
          )}

          <div className="flex gap-4 mb-8">
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>

          {calculationMode === 'purchase' && calculationResult.newAvgPrice !== null && (
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Result</h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Quantity</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {((parseFloat(currentQuantity) || 0) + (parseFloat(buyQuantity) || 0)).toFixed(0)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Investment</div>
                  <div className="text-2xl font-bold text-gray-800">
                    ₹{(
                      ((parseFloat(currentQuantity) || 0) * (parseFloat(currentAvgPrice) || (parseFloat(currentTotalPrice) || 0) / (parseFloat(currentQuantity) || 1))) +
                      (buyInputMode === 'price'
                        ? ((parseFloat(buyQuantity) || 0) * (parseFloat(buyPrice) || 0))
                        : (parseFloat(buyTotalPrice) || 0))
                    ).toFixed(2)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <div className="text-sm text-orange-600 font-medium mb-1">New Average Price</div>
                  <div className="text-3xl font-bold text-orange-600">
                    ₹{calculationResult.newAvgPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 How it works</h4>
          <p className="text-sm text-blue-800 mb-2">
            New Average Price = (Current Quantity × Current Avg Price + Buy Quantity × Buy Price) ÷ (Current Quantity + Buy Quantity)
          </p>
          <p className="text-xs text-blue-700">
            <strong>Tip:</strong> Toggle between "Price" and "Total" mode to enter data based on average price per share or total amount invested.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AverageCalculator;
