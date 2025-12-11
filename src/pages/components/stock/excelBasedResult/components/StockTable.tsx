import React, { useMemo, useState } from 'react';
import { calculateColumnTotals, getSortIcon, handleSortStateChange, sortStockData, type SortDirection } from '../helpers/StockResult.helper';
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
  const [sortColumn, setSortColumn] = useState<StockColumnKeyType | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (columnKey: StockColumnKeyType) => {
    const newState = handleSortStateChange(columnKey, sortColumn, sortDirection);
    setSortColumn(newState.sortColumn);
    setSortDirection(newState.sortDirection);
  };

  const sortedData = useMemo(() => {
    return sortStockData(stockData, sortColumn, sortDirection, priceMap);
  }, [stockData, sortColumn, sortDirection, priceMap]);

  const columnTotals = useMemo(() => {
    return calculateColumnTotals(sortedData, priceMap);
  }, [sortedData, priceMap]);

  const getSortIconElement = (columnKey: StockColumnKeyType) => {
    return getSortIcon(columnKey, sortColumn, sortDirection);
  };

  return (
    <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
      <table className="min-w-full border-collapse border border-gray-300 relative">
        <thead className="bg-gray-100">
          <tr>
            {stockColumns.map((col: { key: StockColumnKeyType; label: string; align?: 'left' | 'right' }) => (
              <th
                key={col.key}
                className={`border border-gray-300 px-4 py-2${col.align === 'right' ? ' text-right' : ''} sticky top-0 bg-gray-100 z-20 cursor-pointer hover:bg-gray-200 select-none`}
                style={{ top: 0 }}
                onClick={() => handleSort(col.key)}
              >
                <div className="flex items-center justify-between">
                  <span>{col.label}</span>
                  {getSortIconElement(col.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
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
        <tfoot className="bg-gray-200 font-semibold sticky bottom-0 z-10">
          <tr>
            {stockColumns.map((col: { key: StockColumnKeyType; label: string; align?: 'left' | 'right' }) => {
              const total = columnTotals[col.key];

              if (col.key === StockColumnKey.Symbol) {
                return (
                  <td
                    key={`${col.key}-total`}
                    className="border border-gray-300 px-4 py-2 bg-gray-200 font-bold"
                  >
                    TOTAL
                  </td>
                );
              }

              if (total != null && !isNaN(total)) {
                return (
                  <td
                    key={`${col.key}-total`}
                    className={`border border-gray-300 px-4 py-2 bg-gray-200 font-bold${col.align === 'right' ? ' text-right' : ''}`}
                  >
                    {typeof total === 'number' ? total.toLocaleString('en-IN', {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 0
                    }) : total}
                  </td>
                );
              }

              return (
                <td
                  key={`${col.key}-total`}
                  className={`border border-gray-300 px-4 py-2 bg-gray-200${col.align === 'right' ? ' text-right' : ''}`}
                >
                  -
                </td>
              );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default StockTable;