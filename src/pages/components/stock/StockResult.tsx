import React, { useState, useEffect } from 'react';
import { formatNormalizedStockData, parseStockExcel, stockColumns, fetchStockPrices } from './StockResult.helper';
import { pnlColumnKeys } from './StockResult.helper';
import type { StockColumnKeyType } from './StockResult.helper';
import type { StockData, } from './StockResult.helper';

type PriceMap = Record<string, number | null>;

const StockResult: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [priceMap, setPriceMap] = useState<PriceMap>({});

  useEffect(() => {
    loadExcelData();
  }, []);

  useEffect(() => {
    if (stockData.length > 0) {
      fetchCurrentPrices(stockData.map(row => row.Symbol));
    }
  }, [stockData]);

  // Fetch current prices using the reusable helper function
  const fetchCurrentPrices = async (symbols: string[]) => {
    try {
      const priceMap = await fetchStockPrices(symbols);
      setPriceMap(priceMap);
    } catch (err) {
      console.warn('Failed to fetch stock prices:', err);
      // Don't set error state, just leave prices empty
    }
  };

  const loadExcelData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the Excel file
      const response = await fetch('/src/privateDocument/pnl-WAR042.xlsx');
      if (!response.ok) {
        throw new Error(`Failed to load Excel file: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const normalized = await parseStockExcel(arrayBuffer);
      console.log('Parsed Stock Data:', normalized);
      const finalNormalized = formatNormalizedStockData(normalized);
      console.log('Formatted Stock Data:', finalNormalized);
      setStockData(finalNormalized);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error loading Excel file:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadExcelData();
  };

  if (loading) {
    return <div className="p-4">Loading Excel data...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stock P&L Data</h1>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Data
        </button>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">Total Records: {stockData.length}</p>
      </div>

      {stockData.length > 0 ? (
        <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {/* Add a new column for current price */}
                {stockColumns.map((col: { key: StockColumnKeyType; label: string; align?: 'left' | 'right' }) => (
                  <th
                    key={col.key}
                    className={`border border-gray-300 px-4 py-2${col.align === 'right' ? ' text-right' : ''} sticky top-0 bg-gray-100 z-20`}
                    style={{ top: 0 }}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="border border-gray-300 px-4 py-2 sticky top-0 bg-gray-100 z-20" style={{ top: 0 }}>Current Price</th>
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
                    return (
                      <td
                        key={col.key}
                        className={`border border-gray-300 px-4 py-2${col.align === 'right' ? ' text-right' : ''}`}
                      >
                        {row[col.key as keyof StockData]}
                      </td>
                    );
                  })}
                  {/* Current Price cell */}
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {priceMap[row.Symbol] !== undefined
                      ? priceMap[row.Symbol] ?? <span className="text-gray-400">N/A</span>
                      : <span className="text-gray-400">Loading...</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500">No data available</div>
      )}

      {/* JSON Data Preview (for debugging/analysis) */}
      <div className="mt-8">
        <details>
          <summary className="cursor-pointer text-blue-600 font-semibold">
            View Raw JSON Data (for analysis)
          </summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto max-h-96">
            {JSON.stringify(stockData, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default StockResult;
