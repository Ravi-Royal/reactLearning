import React, { useMemo, useState } from 'react';
import { calculateColumnTotals, getSortIcon, handleSortStateChange, sortStockData, type SortDirection } from '../helpers/StockResult.helper';
import { pnlColumnKeys, StockColumnKey, stockColumns, type PriceMap, type StockColumnKeyType, type StockData } from '../types/StockResult.types';
import NearLowIndicator from './NearLowIndicator';
import PriceCell from './PriceCell';
import RealizedPriceVsValueIndicator from './RealizedPriceVsValueIndicator';
import UnrealizedPriceToCmpIndicator from './UnrealizedPriceToCmpIndicator';

/**
 * Array of stock symbols to ignore/exclude from calculations and display
 * Add symbols here that should not be included in totals or table display
 */
const IGNORED_SYMBOLS = [
  'SGBDE31III-GB',
];

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

  // Filter out ignored symbols before any processing
  const filteredData = useMemo(() => {
    return stockData.filter(row => {
      const symbol = row[StockColumnKey.Symbol] as string;
      return !IGNORED_SYMBOLS.includes(symbol);
    });
  }, [stockData]);

  const sortedData = useMemo(() => {
    return sortStockData(filteredData, sortColumn, sortDirection, priceMap);
  }, [filteredData, sortColumn, sortDirection, priceMap]);

  const columnTotals = useMemo(() => {
    return calculateColumnTotals(sortedData, priceMap);
  }, [sortedData, priceMap]);

  const getSortIconElement = (columnKey: StockColumnKeyType) => {
    return getSortIcon(columnKey, sortColumn, sortDirection);
  };

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0" style={{ maxHeight: '500px', overflowY: 'auto' }}>
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full border-collapse border border-gray-300 relative text-xs sm:text-sm">
            <thead className="bg-gray-100">
              <tr>
                {stockColumns.map((col: { key: StockColumnKeyType; label: string; align?: 'left' | 'right' }) => (
                  <th
                    key={col.key}
                    className={`border border-gray-300 px-2 sm:px-4 py-2${col.align === 'right' ? ' text-right' : ''} sticky top-0 bg-gray-100 z-20 cursor-pointer hover:bg-gray-200 select-none whitespace-nowrap`}
                    style={{ top: 0 }}
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs sm:text-sm">{col.label}</span>
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
                      className={`border border-gray-300 px-2 sm:px-4 py-2${col.align === 'right' ? ' text-right' : ''} ${color} whitespace-nowrap`}
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
                      className={`border border-gray-300 px-2 sm:px-4 py-2${col.align === 'right' ? ' text-right' : ''} whitespace-nowrap`}
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
                    <td key={col.key} className={`border border-gray-300 px-2 sm:px-4 py-2${col.align === 'right' ? ' text-right' : ''} whitespace-nowrap`}>
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
                    <td key={col.key} className={`border border-gray-300 px-2 sm:px-4 py-2${col.align === 'right' ? ' text-right' : ''} whitespace-nowrap`}>
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
                    className={`border border-gray-300 px-2 sm:px-4 py-2${col.align === 'right' ? ' text-right' : ''} whitespace-nowrap`}
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

              // Skip totals for price-related columns that don't make sense to sum
              const skipTotalColumns: StockColumnKeyType[] = [
                StockColumnKey.FiftyTwoWeekHigh,
                StockColumnKey.FiftyTwoWeekLow,
                StockColumnKey.CurrentPrice,
                StockColumnKey.CustomRealisedStockValue,
                StockColumnKey.CustomUnrealisedStockValue,
              ];

              if (skipTotalColumns.includes(col.key)) {
                return (
                  <td
                    key={`${col.key}-total`}
                    className={`border border-gray-300 px-2 sm:px-4 py-2 bg-gray-200${col.align === 'right' ? ' text-right' : ''} whitespace-nowrap`}
                  >
                    -
                  </td>
                );
              }

              if (col.key === StockColumnKey.Symbol) {
                return (
                  <td
                    key={`${col.key}-total`}
                    className="border border-gray-300 px-2 sm:px-4 py-2 bg-gray-200 font-bold whitespace-nowrap"
                  >
                    TOTAL
                  </td>
                );
              }

              // Handle percentage columns specially
              if (col.key === StockColumnKey.RealizedPLPct || col.key === StockColumnKey.UnrealizedPLPct) {
                if (total !== null && total !== undefined && !isNaN(total)) {
                  const color = total >= 0 ? 'text-green-600' : 'text-red-600';
                  return (
                    <td
                      key={`${col.key}-total`}
                      className={`border border-gray-300 px-2 sm:px-4 py-2 bg-gray-200 font-bold text-right ${color} whitespace-nowrap`}
                    >
                      {total.toFixed(2)}%
                    </td>
                  );
                }
                return (
                  <td
                    key={`${col.key}-total`}
                    className="border border-gray-300 px-2 sm:px-4 py-2 bg-gray-200 text-right whitespace-nowrap"
                  >
                    -
                  </td>
                );
              }

              if (total !== null && total !== undefined && !isNaN(total)) {
                return (
                  <td
                    key={`${col.key}-total`}
                    className={`border border-gray-300 px-2 sm:px-4 py-2 bg-gray-200 font-bold${col.align === 'right' ? ' text-right' : ''} whitespace-nowrap`}
                  >
                    {typeof total === 'number' ? total.toLocaleString('en-IN', {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 0,
                    }) : total}
                  </td>
                );
              }

              return (
                <td
                  key={`${col.key}-total`}
                  className={`border border-gray-300 px-2 sm:px-4 py-2 bg-gray-200${col.align === 'right' ? ' text-right' : ''} whitespace-nowrap`}
                >
                  -
                </td>
              );
            })}
          </tr>
        </tfoot>
      </table>
        </div>
      </div>
    </div>
  );
};

export default StockTable;