import React from 'react';

interface NearLowIndicatorProps {
  price: number | null | undefined;
  low: number | null | undefined;
}

/**
 * Shows how close the current price is to the 52W low.
 * - <= 5% : dark green
 * - 5-10% : medium green
 * - 10-20%: light green
 * - 20-30%: yellow
 * - >30%  : no highlight
 */
const NearLowIndicator: React.FC<NearLowIndicatorProps> = ({ price, low }) => {
  if (price == null || low == null || low === 0) {
    return <span className="text-gray-400">N/A</span>;
  }

  const diff = price - low;
  const percentAboveLow = (diff / low) * 100;

  // If price is below or equal to low, treat as 0% (very near)
  const pct = percentAboveLow <= 0 ? 0 : percentAboveLow;

  let className = 'inline-flex items-center px-2 py-1 rounded text-sm font-medium';
  let text = `${pct.toFixed(1)}% above low`;

  if (pct <= 5) {
    className += ' bg-green-800 text-white';
    if (pct === 0) text = 'Below 52W low';
  } else if (pct <= 10) {
    className += ' bg-green-600 text-white';
  } else if (pct <= 20) {
    className += ' bg-green-200 text-green-900';
  } else if (pct <= 30) {
    className += ' bg-yellow-200 text-yellow-900';
  } else {
    className += ' text-gray-700';
    text = `${pct.toFixed(1)}%`;
  }

  return (
    <span className={className} title={`${text} (current: ${price}, 52W low: ${low})`}>
      {text}
    </span>
  );
};

export default NearLowIndicator;
