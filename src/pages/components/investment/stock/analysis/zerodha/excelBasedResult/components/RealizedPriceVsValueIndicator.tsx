import React from 'react';

interface RealizedPriceVsValueIndicatorProps {
  price: number | null | undefined;
  buyPerStock: number | null | undefined;
  sellPerStock: number | null | undefined;
}

/**
 * Compares current price with realized Buy Value Per Stock and Sell Value Per Stock.
 * - price < buyPerStock: dark green
 * - price < sellPerStock: light green
 * - otherwise: neutral
 */
const RealizedPriceVsValueIndicator: React.FC<RealizedPriceVsValueIndicatorProps> = ({
  price,
  buyPerStock,
  sellPerStock,
}) => {
  if (price === null || price === undefined) {
    return <span className="text-gray-400">N/A</span>;
  }

  // Prioritize buy check (darker green)
  if (buyPerStock !== null && buyPerStock !== undefined && price < buyPerStock) {
    const pct = ((buyPerStock - price) / buyPerStock) * 100;
    return (
      <span
        className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-green-800 text-white"
        title={`Price ${price} is ${pct.toFixed(1)}% below Buy Value Per Stock (${buyPerStock})`}
      >
        Below Buy ({pct.toFixed(1)}%)
      </span>
    );
  }

  if (sellPerStock !== null && sellPerStock !== undefined && price < sellPerStock) {
    const pct = ((sellPerStock - price) / sellPerStock) * 100;
    return (
      <span
        className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-green-200 text-green-900"
        title={`Price ${price} is ${pct.toFixed(1)}% below Sell Value Per Stock (${sellPerStock})`}
      >
        Below Sell ({pct.toFixed(1)}%)
      </span>
    );
  }

  return <span className="text-gray-700">—</span>;
};

export default RealizedPriceVsValueIndicator;
