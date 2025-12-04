import React from 'react';
import { stockColumns, pnlColumnKeys, StockColumnKey } from './StockResult.types';
import type { StockColumnKeyType, StockData, PriceMap } from './StockResult.types';
import PriceCell from './PriceCell';

interface StockTableProps {
  stockData: StockData[];
  priceMap: PriceMap;
}

/**
 * Component for rendering the stock data table
 */
const StockTable: React.FC<StockTableProps> = ({ stockData, priceMap }) => {
  return (
    <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {stockColumns.map((col: { key: StockColumnKeyType; label: string; align?: 'left' | 'right' }) => (
              <th
                key={col.key}
                className={`border border-gray-300 px-4 py-2${col.align === 'right' ? ' text-right' : ''} sticky top-0 bg-gray-100 z-20`}
                style={{ top: 0 }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stockData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {stockColumns.map((col: { key: StockColumnKeyType; label: string; align?: 'left' | 'right' }) => {
                // Color logic for P&L columns
                if (pnlColumnKeys.includes(col.key)) {
                  const value = row[col.key as keyof StockData];
                  const color = Number(value) >= 0 ? 'text-green-600' : 'text-red-600';
                  return (
                    <td
                      key={col.key}
                      className={`border border-gray-300 px-4 py-2${col.align === 'right' ? ' text-right' : ''} ${color}`}
                    >
                      {value}
                    </td>
                  );
                }

                // Special handling for price-related columns using PriceCell component
                if (col.key === StockColumnKey.CurrentPrice) {
                  return (
                    <PriceCell
                      key={col.key}
                      symbol={row.Symbol}
                      priceKey="price"
                      priceMap={priceMap}
                      align={col.align}
                    />
                  );
                }

                if (col.key === StockColumnKey.FiftyTwoWeekHigh) {
                  return (
                    <PriceCell
                      key={col.key}
                      symbol={row.Symbol}
                      priceKey="fiftyTwoWeekHigh"
                      priceMap={priceMap}
                      align={col.align}
                    />
                  );
                }

                if (col.key === StockColumnKey.FiftyTwoWeekLow) {
                  return (
                    <PriceCell
                      key={col.key}
                      symbol={row.Symbol}
                      priceKey="fiftyTwoWeekLow"
                      priceMap={priceMap}
                      align={col.align}
                    />
                  );
                }

                return (
                  <td
                    key={col.key}
                    className={`border border-gray-300 px-4 py-2${col.align === 'right' ? ' text-right' : ''}`}
                  >
                    {row[col.key as keyof StockData]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;