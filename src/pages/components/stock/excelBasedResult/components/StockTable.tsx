import React from 'react';
import type { PriceMap, StockColumnKeyType, StockData } from '../types/StockResult.types';
import { pnlColumnKeys, StockColumnKey, stockColumns } from '../types/StockResult.types';
import NearLowIndicator from './NearLowIndicator';
import PriceCell from './PriceCell';
import RealizedPriceVsValueIndicator from './RealizedPriceVsValueIndicator';
import UnrealizedPriceToCmpIndicator from './UnrealizedPriceToCmpIndicator';

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

                // New column: Near 52W Low indicator
                if (col.key === StockColumnKey.NearFiftyTwoWeekLow) {
                  const priceData = priceMap[row[StockColumnKey.Symbol] as string];
                  const price = priceData?.price ?? null;
                  const low = priceData?.fiftyTwoWeekLow ?? null;

                  return (
                    <td
                      key={col.key}
                      className={`border border-gray-300 px-4 py-2${col.align === 'right' ? ' text-right' : ''}`}
                      style={{ textAlign: col.align === 'right' ? 'right' : 'left' }}
                    >
                      <NearLowIndicator price={price} low={low} />
                    </td>
                  );
                }

                if (col.key === StockColumnKey.RealizedPriceVsValue) {
                  // Compare current price with buy/sell per stock
                  const priceData = priceMap[row[StockColumnKey.Symbol] as string];
                  const price = priceData?.price ?? row[StockColumnKey.CurrentPrice] ?? null;
                  const buyPerStock = row[StockColumnKey.BuyValuePerStock] ?? null;
                  const sellPerStock = row[StockColumnKey.SellValuePerStock] ?? null;

                  return (
                    <td key={col.key} className={`border border-gray-300 px-4 py-2${col.align === 'right' ? ' text-right' : ''}`}>
                      <RealizedPriceVsValueIndicator price={price as number | null} buyPerStock={buyPerStock as number | null} sellPerStock={sellPerStock as number | null} />
                    </td>
                  );
                }

                if (col.key === StockColumnKey.UnrealizedPriceToCmp) {
                  // Compare current price with average open price (Open Value / Open Quantity)
                  const priceData = priceMap[row[StockColumnKey.Symbol] as string];
                  const currentPrice = priceData?.price ?? row[StockColumnKey.CurrentPrice] ?? null;
                  const openValue = row[StockColumnKey.OpenValue] ?? null;
                  const openQuantity = row[StockColumnKey.OpenQuantity] ?? null;

                  return (
                    <td key={col.key} className={`border border-gray-300 px-4 py-2${col.align === 'right' ? ' text-right' : ''}`}>
                      <UnrealizedPriceToCmpIndicator currentPrice={currentPrice as number | null} openValue={openValue as number | null} openQuantity={openQuantity as number | null} />
                    </td>
                  );
                }

                // Special handling for price-related columns using PriceCell component
                if (col.key === StockColumnKey.CurrentPrice) {
                  return (
                    <PriceCell
                      key={col.key}
                      symbol={row[StockColumnKey.Symbol] as string}
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
                      symbol={row[StockColumnKey.Symbol] as string}
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
                      symbol={row[StockColumnKey.Symbol] as string}
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