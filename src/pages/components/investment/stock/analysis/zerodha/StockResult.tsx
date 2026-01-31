import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../../../../../navigation/Breadcrumbs';
import StockControls from './excelBasedResult/components/StockControls';
import StockMetadata from './excelBasedResult/components/StockMetadata';
import StockTable from './excelBasedResult/components/StockTable';
import {
  fetchStockPrices,
  formatNormalizedStockData,
  loadStockDataFromJSON,
  parseStockExcel,
  saveStockDataToJSON,
  updateStockPricesInJSON,
} from './excelBasedResult/helpers/StockResult.helper';
import type { PriceMap, StockData } from './excelBasedResult/types/StockResult.types';
import {
  STOCK_RESULT_MESSAGES,
  EXCEL_SOURCE_TYPES,
  EXCEL_FILE_NAMES,
  STOCK_RESULT_ERROR_PREFIXES,
} from './constants/stockResult.constants';
import { logger, logSuccess } from '../../../../../../utils/logger';
import { toast } from '../../../../../../utils/toast';

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
  const [needsSourceSelection, setNeedsSourceSelection] = useState<boolean>(false);
  const [excelSource, setExcelSource] = useState<'upload' | 'private' | 'json' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Always show source selection screen on initial load
      setExcelSource(null);
      setNeedsSourceSelection(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : STOCK_RESULT_MESSAGES.UNKNOWN_ERROR;
      setError(errorMessage);
      logger.error(STOCK_RESULT_ERROR_PREFIXES.ERROR_LOADING_DATA, err);
    } finally {
      setLoading(false);
    }
  };

  const applyLoadedStocks = (stocks: StockData[], prices: PriceMap) => {
    setStockData(stocks);
    setPriceMap(prices);
    const now = new Date().toISOString();
    setLastUpdated(now);
    setLastPriceUpdate(now);
  };

  const loadFromArrayBuffer = async (arrayBuffer: ArrayBuffer, sourceFileName: string) => {
    setLoading(true);
    setError(null);

    const normalized = await parseStockExcel(arrayBuffer);
    const finalNormalized = formatNormalizedStockData(normalized);

    // Fetch prices once and enrich data for display
    const symbols = finalNormalized.map((s) => s.Symbol);
    const prices = await fetchStockPrices(symbols);

    const enriched: StockData[] = finalNormalized.map((stock) => {
      const currentPrice = prices[stock.Symbol]?.price ?? null;
      const openValue = stock['Open Value'] ?? 0;
      const openQuantity = stock['Open Quantity'] ?? 1;
      const openValuePerStock = openValue / openQuantity;
      const potentialPLPerStock = currentPrice ? currentPrice - openValuePerStock : 0;

      // Recalculate Custom Unrealised Stock Value with actual current price
      // If profit: subtract to get lower buy price. If loss: add to get higher buy price
      const customUnrealisedStockValue = openValuePerStock - potentialPLPerStock;

      return {
        ...stock,
        'Current Price': currentPrice,
        '52W High': prices[stock.Symbol]?.fiftyTwoWeekHigh ?? null,
        '52W Low': prices[stock.Symbol]?.fiftyTwoWeekLow ?? null,
        'Custom Unrealised Stock Value': Number(customUnrealisedStockValue.toFixed(2)),
      };
    });

    applyLoadedStocks(enriched, prices);
    setNeedsSourceSelection(false);
    logger.info(`${STOCK_RESULT_ERROR_PREFIXES.DATA_LOADED}${sourceFileName}`);
  };

  const loadFromPrivateDocument = async () => {
    try {
      setExcelSource('private');
      const response = await fetch('/src/privateDocument/pnl-WAR042.xlsx');
      if (!response.ok) {
        throw new Error(`Failed to load Excel file: ${response.status} ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      await loadFromArrayBuffer(arrayBuffer, 'pnl-WAR042.xlsx');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      logger.error(STOCK_RESULT_ERROR_PREFIXES.ERROR_LOADING_PRIVATE_EXCEL, err);
    } finally {
      setLoading(false);
    }
  };

  const loadOlderVersion = async () => {
    try {
      setLoading(true);
      setError(null);
      setExcelSource('json');

      const storedData = await loadStockDataFromJSON();
      if (!storedData) {
        throw new Error('No older version found (stockData.json)');
      }

      // Recalculate Custom Unrealised Stock Value with stored current prices
      const recalculatedStocks = storedData.stocks.map((stock) => {
        const currentPrice = stock['Current Price'] ?? null;
        const openValue = stock['Open Value'] ?? 0;
        const openQuantity = stock['Open Quantity'] ?? 1;
        const openValuePerStock = openValue / openQuantity;
        const potentialPLPerStock = currentPrice ? currentPrice - openValuePerStock : 0;

        // If profit: subtract to get lower buy price. If loss: add to get higher buy price
        const customUnrealisedStockValue = openValuePerStock - potentialPLPerStock;

        return {
          ...stock,
          'Custom Unrealised Stock Value': Number(customUnrealisedStockValue.toFixed(2)),
        };
      });

      setStockData(recalculatedStocks);
      setLastUpdated(storedData.metadata.lastUpdated);
      setLastPriceUpdate(storedData.metadata.lastPriceUpdate);

      const storedPriceMap: PriceMap = {};
      recalculatedStocks.forEach((stock) => {
        if (stock['Current Price'] !== undefined || stock['52W High'] !== undefined || stock['52W Low'] !== undefined) {
          storedPriceMap[stock.Symbol] = {
            price: stock['Current Price'] ?? null,
            fiftyTwoWeekHigh: stock['52W High'] ?? null,
            fiftyTwoWeekLow: stock['52W Low'] ?? null,
          };
        }
      });
      setPriceMap(storedPriceMap);
      setNeedsSourceSelection(false);
      logger.info(STOCK_RESULT_MESSAGES.OLDER_VERSION_LOADED);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      logger.error(STOCK_RESULT_ERROR_PREFIXES.ERROR_LOADING_OLDER_VERSION, err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      return;
    }
    setUploadedFile(file);
    setExcelSource('upload');

    try {
      const arrayBuffer = await file.arrayBuffer();
      await loadFromArrayBuffer(arrayBuffer, file.name);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      logger.error(STOCK_RESULT_ERROR_PREFIXES.ERROR_LOADING_UPLOADED_EXCEL, err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (excelSource === 'private') {
        logger.info(STOCK_RESULT_MESSAGES.REFRESHING_PRIVATE_DOC);
        const response = await fetch('/src/privateDocument/pnl-WAR042.xlsx');
        if (!response.ok) {
          throw new Error(`Failed to load Excel file: ${response.status} ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        await loadFromArrayBuffer(arrayBuffer, 'pnl-WAR042.xlsx');
        return;
      }

      if (excelSource === 'upload') {
        if (!uploadedFile) {
          throw new Error('No uploaded Excel file found. Please upload the file again.');
        }
        logger.info(STOCK_RESULT_MESSAGES.REFRESHING_UPLOAD);
        const arrayBuffer = await uploadedFile.arrayBuffer();
        await loadFromArrayBuffer(arrayBuffer, uploadedFile.name);
        return;
      }

      if (excelSource === 'json') {
        // For JSON source, refresh by updating prices
        logger.info(STOCK_RESULT_MESSAGES.REFRESHING_JSON_SOURCE);
        await updatePrices();
        return;
      }

      logger.warn(STOCK_RESULT_MESSAGES.NO_DATA_SOURCE);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      logger.error(STOCK_RESULT_ERROR_PREFIXES.ERROR_REFRESHING_DATA, err);
    } finally {
      setLoading(false);
    }
  };

  const updatePrices = async () => {
    if (stockData.length === 0) {
      return;
    }

    try {
      setUpdatingPrices(true);

      // Load current stored data
      const storedData = await loadStockDataFromJSON();
      if (!storedData) {
        logger.warn(STOCK_RESULT_MESSAGES.NO_STORED_DATA);
        return;
      }

      // Update prices and save
      const updatedData = await updateStockPricesInJSON(storedData);

      // Update UI
      setStockData(updatedData.stocks);
      setLastPriceUpdate(updatedData.metadata.lastPriceUpdate);

      // Update price map for display
      const updatedPriceMap: PriceMap = {};
      updatedData.stocks.forEach((stock) => {
        updatedPriceMap[stock.Symbol] = {
          price: stock['Current Price'] ?? null,
          fiftyTwoWeekHigh: stock['52W High'] ?? null,
          fiftyTwoWeekLow: stock['52W Low'] ?? null,
        };
      });
      setPriceMap(updatedPriceMap);

      logSuccess(STOCK_RESULT_MESSAGES.PRICES_UPDATED);
    } catch (err) {
      logger.error(STOCK_RESULT_ERROR_PREFIXES.ERROR_UPDATING_PRICES, err);
      // Don't show error to user, just log it
    } finally {
      setUpdatingPrices(false);
    }
  };

  const saveData = async () => {
    if (stockData.length === 0) {
      toast.warning(STOCK_RESULT_MESSAGES.NO_DATA_TO_SAVE);
      return;
    }

    try {
      const sourceFile =
        excelSource === EXCEL_SOURCE_TYPES.PRIVATE
          ? EXCEL_FILE_NAMES.PRIVATE
          : excelSource === EXCEL_SOURCE_TYPES.UPLOAD
            ? (uploadedFile?.name ?? EXCEL_FILE_NAMES.UPLOAD_DEFAULT)
            : EXCEL_FILE_NAMES.JSON_OUTPUT;

      await saveStockDataToJSON(stockData, sourceFile, false);
      logSuccess(STOCK_RESULT_MESSAGES.SAVE_SUCCESS);
      toast.success(STOCK_RESULT_MESSAGES.SAVE_SUCCESS_ALERT);
    } catch (err) {
      logger.error(STOCK_RESULT_ERROR_PREFIXES.ERROR_SAVING_DATA, err);
      const errorMessage = err instanceof Error ? err.message : STOCK_RESULT_MESSAGES.UNKNOWN_ERROR;
      toast.error(`${STOCK_RESULT_MESSAGES.SAVE_ERROR_PREFIX}${errorMessage}`);
    }
  };

  if (loading) {
    return <div className="p-4 sm:p-6">Loading Excel data...</div>;
  }

  if (needsSourceSelection) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <Breadcrumbs />
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Stock P&L Data</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Choose how you want to load your Zerodha P&L Excel.</p>
        </div>

        {error && <div className="text-red-600 mb-4 text-sm sm:text-base">Error: {error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Upload Excel</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Upload your Zerodha P&L Excel (.xlsx).</p>
            <div className="mt-3">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleUploadChange}
                className="block w-full text-xs sm:text-sm text-gray-700"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Load from Private Document</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Loads <span className="font-mono text-xs">pnl-WAR042.xlsx</span> from{' '}
              <span className="font-mono text-xs">src/privateDocument</span>.
            </p>
            <button
              onClick={loadFromPrivateDocument}
              className="mt-3 px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Load from Private Document
            </button>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Load Older Version</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Load previously saved data from <span className="font-mono text-xs">stockData.json</span>.
          </p>
          <button
            onClick={loadOlderVersion}
            className="mt-3 px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Load Older Version
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-red-600 mb-4 text-sm sm:text-base">Error: {error}</div>
        <button
          onClick={refreshData}
          className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Breadcrumbs />
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Stock P&L Data</h1>
        <StockControls
          onUpdatePrices={updatePrices}
          onRefreshData={refreshData}
          onSaveData={saveData}
          updatingPrices={updatingPrices}
        />
      </div>

      <StockMetadata totalRecords={stockData.length} lastUpdated={lastUpdated} lastPriceUpdate={lastPriceUpdate} />

      {stockData.length > 0 ? (
        <StockTable stockData={stockData} priceMap={priceMap} />
      ) : (
        <div className="text-gray-500 text-sm sm:text-base">No data available</div>
      )}

      {/* JSON Data Preview (for debugging/analysis) */}
      <div className="mt-8">
        <details>
          <summary className="cursor-pointer text-blue-600 font-semibold">View Raw JSON Data (for analysis)</summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto max-h-96">
            {JSON.stringify(stockData, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default StockResult;
