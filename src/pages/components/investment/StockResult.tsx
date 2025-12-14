import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../../navigation/Breadcrumbs';
import StockControls from './excelBasedResult/components/StockControls';
import StockMetadata from './excelBasedResult/components/StockMetadata';
import StockTable from './excelBasedResult/components/StockTable';
import { formatNormalizedStockData, loadStockDataFromJSON, parseStockExcel, saveStockDataToJSON, updateStockPricesInJSON } from './excelBasedResult/helpers/StockResult.helper';
import type { PriceMap, StockData } from './excelBasedResult/types/StockResult.types';

/**
 * Main Stock Result component - orchestrates data loading and state management
 */
const StockResult: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [priceMap, setPriceMap] = useState<PriceMap>({});
  const [updatingPrices, setUpdatingPrices] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [lastPriceUpdate, setLastPriceUpdate] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, try to load from JSON storage
      let storedData = await loadStockDataFromJSON();

      if (!storedData) {
        // If no JSON data exists, load from Excel, fetch prices, and save to JSON
        console.log('No stored data found, loading from Excel and fetching prices...');
        const response = await fetch('/src/privateDocument/pnl-WAR042.xlsx');
        if (!response.ok) {
          throw new Error(`Failed to load Excel file: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const normalized = await parseStockExcel(arrayBuffer);
        console.log('Parsed Stock Data:', normalized);
        const finalNormalized = formatNormalizedStockData(normalized);
        console.log('Formatted Stock Data:', finalNormalized);

        // Save to JSON storage with prices fetched from Yahoo API
        console.log('Fetching prices from Yahoo Finance API (this may take 10-15 seconds)...');
        await saveStockDataToJSON(finalNormalized, 'pnl-WAR042.xlsx', true);

        // Load the newly saved data with prices
        storedData = await loadStockDataFromJSON();
        console.log('First load complete: Excel parsed, prices fetched, data saved to JSON');
      }

      if (storedData) {
        setStockData(storedData.stocks);
        setLastUpdated(storedData.metadata.lastUpdated);
        setLastPriceUpdate(storedData.metadata.lastPriceUpdate);

        // If we have stored prices, use them
        const storedPriceMap: PriceMap = {};
        storedData.stocks.forEach(stock => {
          if (stock['Current Price'] !== undefined ||
            stock['52W High'] !== undefined ||
            stock['52W Low'] !== undefined) {
            storedPriceMap[stock.Symbol] = {
              price: stock['Current Price'] ?? null,
              fiftyTwoWeekHigh: stock['52W High'] ?? null,
              fiftyTwoWeekLow: stock['52W Low'] ?? null,
            };
          }
        });
        setPriceMap(storedPriceMap);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Force reload from Excel and fetch fresh prices
      console.log('Refreshing data from Excel and fetching fresh prices...');
      const response = await fetch('/src/privateDocument/pnl-WAR042.xlsx');
      if (!response.ok) {
        throw new Error(`Failed to load Excel file: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const normalized = await parseStockExcel(arrayBuffer);
      const finalNormalized = formatNormalizedStockData(normalized);

      // Save to JSON storage with fresh prices from Yahoo API
      console.log('Fetching latest prices from Yahoo Finance API...');
      await saveStockDataToJSON(finalNormalized, 'pnl-WAR042.xlsx', true);

      // Load the updated data
      const storedData = await loadStockDataFromJSON();
      if (storedData) {
        setStockData(storedData.stocks);
        setLastUpdated(storedData.metadata.lastUpdated);
        setLastPriceUpdate(storedData.metadata.lastPriceUpdate);

        // Update price map
        const updatedPriceMap: PriceMap = {};
        storedData.stocks.forEach(stock => {
          if (stock['Current Price'] !== undefined ||
            stock['52W High'] !== undefined ||
            stock['52W Low'] !== undefined) {
            updatedPriceMap[stock.Symbol] = {
              price: stock['Current Price'] ?? null,
              fiftyTwoWeekHigh: stock['52W High'] ?? null,
              fiftyTwoWeekLow: stock['52W Low'] ?? null,
            };
          }
        });
        setPriceMap(updatedPriceMap);
        console.log('Data refresh complete with latest prices');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updatePrices = async () => {
    if (stockData.length === 0) return;

    try {
      setUpdatingPrices(true);

      // Load current stored data
      const storedData = await loadStockDataFromJSON();
      if (!storedData) {
        console.warn('No stored data found to update');
        return;
      }

      // Update prices and save
      const updatedData = await updateStockPricesInJSON(storedData);

      // Update UI
      setStockData(updatedData.stocks);
      setLastPriceUpdate(updatedData.metadata.lastPriceUpdate);

      // Update price map for display
      const updatedPriceMap: PriceMap = {};
      updatedData.stocks.forEach(stock => {
        updatedPriceMap[stock.Symbol] = {
          price: stock['Current Price'] ?? null,
          fiftyTwoWeekHigh: stock['52W High'] ?? null,
          fiftyTwoWeekLow: stock['52W Low'] ?? null,
        };
      });
      setPriceMap(updatedPriceMap);

      console.log('Prices updated successfully');
    } catch (err) {
      console.error('Error updating prices:', err);
      // Don't show error to user, just log it
    } finally {
      setUpdatingPrices(false);
    }
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
      <Breadcrumbs />
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stock P&L Data</h1>
        <StockControls
          onUpdatePrices={updatePrices}
          onRefreshData={refreshData}
          updatingPrices={updatingPrices}
        />
      </div>

      <StockMetadata
        totalRecords={stockData.length}
        lastUpdated={lastUpdated}
        lastPriceUpdate={lastPriceUpdate}
      />

      {stockData.length > 0 ? (
        <StockTable stockData={stockData} priceMap={priceMap} />
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
