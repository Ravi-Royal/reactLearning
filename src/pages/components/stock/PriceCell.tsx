import React from 'react';
import type { PriceMap } from './StockResult.types';

interface PriceCellProps {
  symbol: string;
  priceKey: keyof PriceMap[string];
  priceMap: PriceMap;
  align?: 'left' | 'right';
}

/**
 * Component for rendering individual price cells with loading and null value handling
 */
const PriceCell: React.FC<PriceCellProps> = ({ symbol, priceKey, priceMap, align }) => {
  const priceData = priceMap[symbol];
  const value = priceData?.[priceKey];

  return (
    <td
      className={`border border-gray-300 px-4 py-2${align === 'right' ? ' text-right' : ''}`}
    >
      {priceData !== undefined
        ? value ?? <span className="text-gray-400">N/A</span>
        : <span className="text-gray-400">Loading...</span>}
    </td>
  );
};

export default PriceCell;