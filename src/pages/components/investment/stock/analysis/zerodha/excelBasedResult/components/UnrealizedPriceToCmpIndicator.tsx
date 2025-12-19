import React from 'react';

interface UnrealizedPriceToCmpIndicatorProps {
  currentPrice: number | null | undefined;
  openValue: number | null | undefined;
  openQuantity: number | null | undefined;
}

/**
 * Compares current price with average open price (Open Value / Open Quantity).
 * Shows if current price is below the average open price.
 * - currentPrice < avgOpenPrice: green (profit opportunity)
 * - otherwise: neutral
 */
const UnrealizedPriceToCmpIndicator: React.FC<UnrealizedPriceToCmpIndicatorProps> = ({ currentPrice, openValue, openQuantity }) => {
  if (currentPrice === null || currentPrice === undefined || openValue === null || openValue === undefined || openQuantity === null || openQuantity === undefined || openQuantity === 0) {
    return <span className="text-gray-400">N/A</span>;
  }

  const avgOpenPrice = openValue / openQuantity;

  if (currentPrice < avgOpenPrice) {
    const pct = ((avgOpenPrice - currentPrice) / avgOpenPrice) * 100;
    return (
      <span
        className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-green-600 text-white"
        title={`Current Price ${currentPrice.toFixed(2)} is ${pct.toFixed(1)}% below Average Open Price (${avgOpenPrice.toFixed(2)})`}
      >
        Below Open ({pct.toFixed(1)}%)
      </span>
    );
  }

  return <span className="text-gray-700">—</span>;
};

export default UnrealizedPriceToCmpIndicator;
