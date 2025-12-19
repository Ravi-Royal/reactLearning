import { getPriceRange, PERCENTAGE_THRESHOLDS, PRICE_RANGE_COLORS } from '@constants/thresholds.constants';
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
const NearLowIndicator: React.FC<NearLowIndicatorProps> = ({ price, low }): React.ReactElement => {
  if (price === null || price === undefined || low === null || low === undefined || low === 0) {
    return <span className="text-gray-400">N/A</span>;
  }

  const diff = price - low;
  const percentAboveLow = (diff / low) * 100;

  // If price is below or equal to low, treat as 0% (very near)
  const pct = percentAboveLow <= 0 ? 0 : percentAboveLow;
  const rangeKey = getPriceRange(pct);
  const rangeColors = PRICE_RANGE_COLORS[rangeKey];

  let className = 'inline-flex items-center px-2 py-1 rounded text-sm font-medium';
  let text: string;

  if (rangeColors.bg) {
    className += ` ${rangeColors.bg} ${rangeColors.text}`;
  } else {
    className += ` ${rangeColors.text}`;
  }

  if (pct === 0) {
    text = 'Below 52W low';
  } else {
    text = `${pct.toFixed(PERCENTAGE_THRESHOLDS.decimal)}% above low`;
  }

  const tooltipText = `${text} (current: ${price}, 52W low: ${low})`;

  return (
    <span className={className} title={tooltipText}>
      {text}
    </span>
  );
};

export default NearLowIndicator;
