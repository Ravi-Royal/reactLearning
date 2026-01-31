import React from 'react';
import type { PriceMap } from '../types/StockResult.types';

interface PriceCellProps {
  symbol: string;
  priceKey: keyof PriceMap[string];
  priceMap: PriceMap;
  align?: 'left' | 'right' | undefined;
  isFirstColumn?: boolean;
}

/**
 * Component for rendering individual price cells with loading and null value handling
 */
const PriceCell: React.FC<PriceCellProps> = ({ symbol, priceKey, priceMap, align, isFirstColumn = false }) => {
  const priceData = priceMap[symbol];
  const value = priceData?.[priceKey];

  return (
    <td
      className={`border border-gray-300 px-4 py-2${align === 'right' ? ' text-right' : ''} whitespace-nowrap${isFirstColumn ? ' sticky left-0 bg-white z-10 relative shadow-[4px_0_8px_0_rgba(0,0,0,0.3)]' : ''}`}
    >
      {priceData !== undefined ? (
        (value ?? <span className="text-gray-400">N/A</span>)
      ) : (
        <span className="text-gray-400">Loading...</span>
      )}
      {isFirstColumn && <div className="absolute top-0 right-0 h-full w-[2px] bg-gray-300 z-40 pointer-events-none" />}
    </td>
  );
};

export default PriceCell;
