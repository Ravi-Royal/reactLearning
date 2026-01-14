
import { YAHOO_FINANCE_CONFIG } from '../../../../../../../../constants/apiConfig';
import { StockColumnKey, type PriceFetchResult, type PriceMap, type StockColumnKeyType, type StockData, type StockPriceInfo, type StoredStockData, type YahooFinanceResponse } from '../types/StockResult.types';

/**
 * Parse an Excel ArrayBuffer and return normalized stock data.
 * @param arrayBuffer Excel file as ArrayBuffer
 * @returns Array of StockData
 */
export async function parseStockExcel(arrayBuffer: ArrayBuffer): Promise<StockData[]> {
  const XLSX = await import('xlsx');
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const equitySheet = workbook.Sheets['Equity'];
  if (!equitySheet) {
    throw new Error('Equity sheet not found in Excel file');
  }

  // Read all data as 2D array first to find the header row dynamically
  const allData = XLSX.utils.sheet_to_json(equitySheet, {
    header: 1,
    raw: false,
    defval: null,
    blankrows: false,
  });

  // Find the row that contains "Symbol" as the first column (header row)
  const headerRowIndex = allData.findIndex(
    (row) => Array.isArray(row) && row.length > 0 && String(row[0]).trim() === 'Symbol',
  );
  if (headerRowIndex === -1) {
    throw new Error('Could not find header row with "Symbol" column');
  }

  // Extract headers and data rows
  const headers = allData[headerRowIndex] as string[];
  const dataRows = allData.slice(headerRowIndex + 1);

  // Convert to array of objects with proper keys
  const jsonData = (dataRows as (string | number | null | undefined)[][])
    .filter(row => row && row.length > 0 && row[0]) // skip empty rows
    .map(row => {
      const obj: Record<string, string | number | null | undefined> = {};
      headers.forEach((header, index) => {
        obj[String(header).trim()] = row[index] ?? null;
      });
      return obj;
    });

  // Normalize data types to match StockData interface
  return jsonData.map((row: Record<string, string | number | null | undefined>) => ({
    [StockColumnKey.Symbol]: String(row[StockColumnKey.Symbol] ?? '').trim(),
    [StockColumnKey.ISIN]: String(row[StockColumnKey.ISIN] ?? '').trim(),
    [StockColumnKey.Quantity]: Number(row[StockColumnKey.Quantity] ?? 0) || 0,
    [StockColumnKey.BuyValue]: Number(row[StockColumnKey.BuyValue] ?? 0) || 0,
    [StockColumnKey.SellValue]: Number(row[StockColumnKey.SellValue] ?? 0) || 0,
    [StockColumnKey.RealizedPL]: Number(row[StockColumnKey.RealizedPL] ?? 0) || 0,
    [StockColumnKey.RealizedPLPct]: Number(row[StockColumnKey.RealizedPLPct] ?? 0) || 0,
    [StockColumnKey.PreviousClosingPrice]: Number(row[StockColumnKey.PreviousClosingPrice] ?? 0) || 0,
    [StockColumnKey.OpenQuantity]: Number(row[StockColumnKey.OpenQuantity] ?? 0) || 0,
    [StockColumnKey.OpenQuantityType]: String(row[StockColumnKey.OpenQuantityType] ?? '').trim(),
    [StockColumnKey.OpenValue]: Number(row[StockColumnKey.OpenValue] ?? 0) || 0,
    [StockColumnKey.UnrealizedPL]: Number(row[StockColumnKey.UnrealizedPL] ?? 0) || 0,
    [StockColumnKey.UnrealizedPLPct]: Number(row[StockColumnKey.UnrealizedPLPct] ?? 0) || 0,
  }));
}

/**
 * Add calculated/derived fields to normalized stock data.
 * Returns a new array (does not mutate input).
 * @param data Array of StockData
 * @returns Array of StockData with calculated fields
 */
export function formatNormalizedStockData(data: StockData[]): StockData[] {
  return data.map((row) => {
    // Custom Realised Stock Value: What price to buy to break even, considering previous realized P&L
    // = Previous Buy Price Per Stock - (Total Realized P&L / Total Quantity Sold)
    const realizedPL = Number(row[StockColumnKey.RealizedPL]) || 0;
    const quantitySold = Number(row[StockColumnKey.Quantity]) || 1;
    const buyValue = Number(row[StockColumnKey.BuyValue]) || 0;
    const buyValuePerStock = buyValue / quantitySold;
    const customRealisedStockValue = buyValuePerStock - (realizedPL / quantitySold);

    // Custom Unrealised Stock Value: Same calculation as realized, but assuming selling at current price
    // = Current Open Buy Price Per Stock - (Potential P&L / Open Quantity)
    // If profit: subtract to get lower buy price. If loss: add to get higher buy price
    const openQuantity = Number(row[StockColumnKey.OpenQuantity]) || 1;
    const openValue = Number(row[StockColumnKey.OpenValue]) || 0;
    const currentPrice = Number(row[StockColumnKey.CurrentPrice]) || 0;
    const openValuePerStock = openValue / openQuantity;
    const potentialPLPerStock = currentPrice - openValuePerStock;
    const customUnrealisedStockValue = openValuePerStock - potentialPLPerStock;

    return {
      ...row,
      [StockColumnKey.BuyValuePerStock]: Number(buyValuePerStock.toFixed(2)),
      [StockColumnKey.SellValuePerStock]: Number((Number(row[StockColumnKey.SellValue]) || 0) / quantitySold),
      [StockColumnKey.CustomRealisedStockValue]: Number(customRealisedStockValue.toFixed(2)),
      [StockColumnKey.CustomUnrealisedStockValue]: Number(customUnrealisedStockValue.toFixed(2)),
    };
  });
}

/**
 * Fetch current stock price from Yahoo Finance API.
 * @param symbol Stock symbol (e.g., 'AAPL')
 * @param exchange Exchange to use ('NS' or 'BO')
 * @returns Stock price information
 */
export async function yahooFinance(symbol: string, exchange: string = YAHOO_FINANCE_CONFIG.exchanges.nse): Promise<StockPriceInfo> {
  try {
    const apiSymbol = symbol.split('-')[0]; // Use split only for API call
    const url = `${YAHOO_FINANCE_CONFIG.baseUrl}/${apiSymbol}.${exchange}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.warn(`Yahoo Finance API error for ${symbol}: ${res.status} ${res.statusText}`);
      return createEmptyPriceInfo();
    }

    const data: YahooFinanceResponse = await res.json();
    const meta = data.chart.result[0]?.meta;

    return {
      price: meta?.regularMarketPrice || null,
      fiftyTwoWeekHigh: meta?.fiftyTwoWeekHigh || null,
      fiftyTwoWeekLow: meta?.fiftyTwoWeekLow || null,
    };
  } catch (error) {
    console.warn('Yahoo Finance API error for', symbol, error);
    return createEmptyPriceInfo();
  }
}

/**
 * Create empty price info object
 */
function createEmptyPriceInfo(): StockPriceInfo {
  return {
    price: null,
    fiftyTwoWeekHigh: null,
    fiftyTwoWeekLow: null,
  };
}

/**
 * Fetch current stock prices using Yahoo Finance API with fallback logic.
 * @param symbols Array of stock symbols
 * @returns Map of symbol to price data
 */
export async function fetchStockPrices(symbols: string[]): Promise<Record<string, StockPriceInfo>> {
  const uniqueSymbols = Array.from(new Set(symbols.filter(Boolean)));
  if (uniqueSymbols.length === 0) { return {}; }

  const priceMap: Record<string, StockPriceInfo> = {};

  // First, try primary exchange for all symbols in parallel
  const primaryResults = await fetchPricesFromAPI(uniqueSymbols, (symbol) =>
    yahooFinance(symbol, YAHOO_FINANCE_CONFIG.exchanges.nse),
  );

  // Build initial price map from primary results
  primaryResults.forEach(({ symbol, ...priceInfo }) => {
    priceMap[symbol] = priceInfo;
  });

  // Find symbols where primary exchange returned null price
  const failedSymbols = primaryResults
    .filter(({ price }) => price === null)
    .map(({ symbol }) => symbol);

  console.warn('Symbols with null prices from primary exchange:', failedSymbols);

  // If there are failed symbols, try fallback exchange in parallel
  if (failedSymbols.length > 0) {
    const fallbackResults = await fetchPricesFromAPI(failedSymbols, (symbol) =>
      yahooFinance(symbol, YAHOO_FINANCE_CONFIG.exchanges.bse),
    );

    console.warn('Fallback exchange results:', fallbackResults);

    // Update the price map with fallback results (only if primary was null)
    fallbackResults.forEach(({ symbol, ...priceInfo }) => {
      if (priceMap[symbol].price === null && priceInfo.price !== null) {
        priceMap[symbol] = priceInfo;
      }
    });
  }

  return priceMap;
}

/**
 * Generic helper function to fetch prices from any API in parallel.
 * @param symbols Array of stock symbols
 * @param apiFunction Function that takes a symbol and returns a price promise
 * @returns Array of price fetch results
 */
async function fetchPricesFromAPI(
  symbols: string[],
  apiFunction: (symbol: string) => Promise<StockPriceInfo>,
): Promise<PriceFetchResult[]> {
  const promises = symbols.map(async (symbol) => {
    try {
      const priceInfo = await apiFunction(symbol);
      return {
        symbol,
        ...priceInfo,
      };
    } catch {
      return {
        symbol,
        ...createEmptyPriceInfo(),
      };
    }
  });

  return Promise.all(promises);
}

/**
 * Load stock data from JSON file if it exists, otherwise return null
 * @returns Stored stock data or null if file doesn't exist
 */
export async function loadStockDataFromJSON(): Promise<StoredStockData | null> {
  try {
    const response = await fetch('/src/privateDocument/stockData.json');
    if (!response.ok) {
      console.warn('No stored data file found (stockData.json)');
      return null;
    }
    const data = await response.json() as StoredStockData;
    console.warn(`Loaded ${data.stocks.length} stocks from stockData.json`);
    return data;
  } catch (error) {
    console.warn('Error loading JSON data from file:', error);
    return null;
  }
}

/**
 * Save stock data to JSON file with prices fetched from Yahoo API
 * @param data Stock data to save
 * @param sourceFile Original Excel file name
 * @param fetchPrices Whether to fetch prices from Yahoo API (default: true)
 * @returns Promise that resolves when data is saved
 */
export async function saveStockDataToJSON(data: StockData[], sourceFile: string, fetchPrices: boolean = true): Promise<void> {
  let stocksWithPrices = data;

  // Fetch prices from Yahoo API if requested
  if (fetchPrices) {
    console.warn('Fetching prices from Yahoo Finance API...');
    const symbols = data.map(stock => stock.Symbol);
    const priceMap = await fetchStockPrices(symbols);

    // Update stock data with fetched prices
    stocksWithPrices = data.map(stock => ({
      ...stock,
      [StockColumnKey.CurrentPrice]: priceMap[stock.Symbol]?.price ?? null,
      [StockColumnKey.FiftyTwoWeekHigh]: priceMap[stock.Symbol]?.fiftyTwoWeekHigh ?? null,
      [StockColumnKey.FiftyTwoWeekLow]: priceMap[stock.Symbol]?.fiftyTwoWeekLow ?? null,
    }));

    console.warn('Prices fetched and added to stock data');
  }

  const storedData: StoredStockData = {
    metadata: {
      lastUpdated: new Date().toISOString(),
      lastPriceUpdate: fetchPrices ? new Date().toISOString() : null,
      sourceFile,
      version: '1.0',
    },
    stocks: stocksWithPrices,
  };

  // Save to JSON file
  const jsonContent = JSON.stringify(storedData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Create download link to save the file
  const link = document.createElement('a');
  link.href = url;
  link.download = 'stockData.json';
  link.click();

  // Clean up
  URL.revokeObjectURL(url);

  console.warn(`Stock data prepared for download: ${stocksWithPrices.length} records`);
  console.warn('Please save the downloaded stockData.json file to: src/privateDocument/stockData.json');
}

/**
 * Update stock prices in the stored JSON data
 * @param storedData Current stored data
 * @returns Updated stored data with fresh prices
 */
export async function updateStockPricesInJSON(storedData: StoredStockData): Promise<StoredStockData> {
  const symbols = storedData.stocks.map(stock => stock.Symbol);
  const priceMap = await fetchStockPrices(symbols);

  // Update the stock data with new prices
  const updatedStocks = storedData.stocks.map(stock => ({
    ...stock,
    [StockColumnKey.CurrentPrice]: priceMap[stock.Symbol]?.price ?? stock[StockColumnKey.CurrentPrice] ?? null,
    [StockColumnKey.FiftyTwoWeekHigh]: priceMap[stock.Symbol]?.fiftyTwoWeekHigh ?? stock[StockColumnKey.FiftyTwoWeekHigh] ?? null,
    [StockColumnKey.FiftyTwoWeekLow]: priceMap[stock.Symbol]?.fiftyTwoWeekLow ?? stock[StockColumnKey.FiftyTwoWeekLow] ?? null,
  }));

  const updatedData: StoredStockData = {
    ...storedData,
    metadata: {
      ...storedData.metadata,
      lastPriceUpdate: new Date().toISOString(),
    },
    stocks: updatedStocks,
  };

  // Save updated data to file
  const jsonContent = JSON.stringify(updatedData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Create download link to save the file
  const link = document.createElement('a');
  link.href = url;
  link.download = 'stockData.json';
  link.click();

  // Clean up
  URL.revokeObjectURL(url);

  console.warn('Updated stock data prepared for download');
  console.warn('Please save the downloaded stockData.json file to: src/privateDocument/stockData.json');

  return updatedData;
}

/**
 * Sort direction type for table sorting
 */
export type SortDirection = 'asc' | 'desc' | null;

/**
 * Sort stock data based on column and direction
 * @param stockData Array of stock data to sort
 * @param sortColumn Column key to sort by
 * @param sortDirection Sort direction ('asc', 'desc', or null)
 * @param priceMap Price map for computed price columns
 * @returns Sorted array of stock data
 */
export function sortStockData(
  stockData: StockData[],
  sortColumn: StockColumnKeyType | null,
  sortDirection: SortDirection,
  priceMap: PriceMap,
): StockData[] {
  if (!sortColumn || !sortDirection) {
    return stockData;
  }

  return [...stockData].sort((a, b) => {
    let aValue = a[sortColumn as keyof StockData];
    let bValue = b[sortColumn as keyof StockData];

    // Handle special cases for computed columns
    if (sortColumn === StockColumnKey.CurrentPrice ||
            sortColumn === StockColumnKey.FiftyTwoWeekHigh ||
            sortColumn === StockColumnKey.FiftyTwoWeekLow) {
      const aSymbol = a[StockColumnKey.Symbol] as string;
      const bSymbol = b[StockColumnKey.Symbol] as string;
      const aPriceData = priceMap[aSymbol];
      const bPriceData = priceMap[bSymbol];

      if (sortColumn === StockColumnKey.CurrentPrice) {
        aValue = aPriceData?.price ?? a[StockColumnKey.CurrentPrice];
        bValue = bPriceData?.price ?? b[StockColumnKey.CurrentPrice];
      } else if (sortColumn === StockColumnKey.FiftyTwoWeekHigh) {
        aValue = aPriceData?.fiftyTwoWeekHigh;
        bValue = bPriceData?.fiftyTwoWeekHigh;
      } else if (sortColumn === StockColumnKey.FiftyTwoWeekLow) {
        aValue = aPriceData?.fiftyTwoWeekLow;
        bValue = bPriceData?.fiftyTwoWeekLow;
      }
    }

    // Handle null/undefined values
    if ((aValue === null || aValue === undefined) && (bValue === null || bValue === undefined)) { return 0; }
    if (aValue === null || aValue === undefined) { return sortDirection === 'asc' ? 1 : -1; }
    if (bValue === null || bValue === undefined) { return sortDirection === 'asc' ? -1 : 1; }

    // Numeric comparison
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // String comparison
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (sortDirection === 'asc') {
      return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
    } else {
      return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
    }
  });
}

/**
 * Get the sort icon JSX element for a column
 * @param columnKey Column key to get icon for
 * @param currentSortColumn Currently sorted column
 * @param sortDirection Current sort direction
 * @returns JSX element for sort icon
 */
export function getSortIcon(
  columnKey: StockColumnKeyType,
  currentSortColumn: StockColumnKeyType | null,
  sortDirection: SortDirection,
): React.ReactElement {
  if (currentSortColumn !== columnKey) {
    return <span className="ml-1 text-gray-400" >⇅</span>;
  }
  if (sortDirection === 'asc') {
    return <span className="ml-1 text-blue-600" >↑</span>;
  }
  return <span className="ml-1 text-blue-600" >↓</span>;
}

/**
 * Handle sort state changes for table sorting
 * @param columnKey Column key that was clicked
 * @param currentSortColumn Current sorted column
 * @param currentSortDirection Current sort direction
 * @returns New sort state { sortColumn, sortDirection }
 */
export function handleSortStateChange(
  columnKey: StockColumnKeyType,
  currentSortColumn: StockColumnKeyType | null,
  currentSortDirection: SortDirection,
): { sortColumn: StockColumnKeyType | null; sortDirection: SortDirection } {
  if (currentSortColumn === columnKey) {
    // Cycle through: asc -> desc -> null
    if (currentSortDirection === 'asc') {
      return { sortColumn: columnKey, sortDirection: 'desc' };
    } else if (currentSortDirection === 'desc') {
      return { sortColumn: null, sortDirection: null };
    }
  }
  return { sortColumn: columnKey, sortDirection: 'asc' };
}

/**
 * Calculate totals for numeric columns in stock data
 * @param stockData Array of stock data
 * @param priceMap Price map for computed columns
 * @returns Object with column totals
 */
export function calculateColumnTotals(
  stockData: StockData[],
  priceMap: PriceMap,
): Record<string, number> {
  const totals: Record<string, number> = {};
  let totalBuyValue = 0;
  let totalCurrentValueOfOpenPositions = 0;

  stockData.forEach((row) => {
    // Handle numeric columns that should be totaled (excluding price-related columns)
    const numericColumns = [
      StockColumnKey.Quantity,
      StockColumnKey.BuyValue,
      StockColumnKey.SellValue,
      StockColumnKey.RealizedPL,
      StockColumnKey.UnrealizedPL,
      StockColumnKey.OpenQuantity,
    ];

    numericColumns.forEach((columnKey) => {
      const value = row[columnKey as keyof StockData];
      if (typeof value === 'number') {
        totals[columnKey] = (totals[columnKey] || 0) + value;
      }
    });

    // Accumulate buy value for percentage calculations
    const buyValue = row[StockColumnKey.BuyValue] as number;
    if (typeof buyValue === 'number') {
      totalBuyValue += buyValue;
    }

    // Calculate current value of open positions for unrealized P&L percentage
    const openQuantity = row[StockColumnKey.OpenQuantity] as number;
    const symbol = row[StockColumnKey.Symbol] as string;
    const priceData = priceMap[symbol];

    if (openQuantity && typeof openQuantity === 'number' && priceData?.price !== null && priceData?.price !== undefined) {
      totalCurrentValueOfOpenPositions += (priceData.price * openQuantity);
    }

    // Handle per-stock values
    const quantity = row[StockColumnKey.Quantity] as number;
    if (quantity && typeof quantity === 'number') {
      const buyValuePerStock = row[StockColumnKey.BuyValuePerStock] as number;
      const sellValuePerStock = row[StockColumnKey.SellValuePerStock] as number;

      if (buyValuePerStock && typeof buyValuePerStock === 'number') {
        totals[StockColumnKey.BuyValuePerStock] = (totals[StockColumnKey.BuyValuePerStock] || 0) + (buyValuePerStock * quantity);
      }
      if (sellValuePerStock && typeof sellValuePerStock === 'number') {
        totals[StockColumnKey.SellValuePerStock] = (totals[StockColumnKey.SellValuePerStock] || 0) + (sellValuePerStock * quantity);
      }
    }
  });

  // Calculate percentage values
  if (totalBuyValue > 0 && totals[StockColumnKey.RealizedPL]) {
    totals[StockColumnKey.RealizedPLPct] = (totals[StockColumnKey.RealizedPL] / totalBuyValue) * 100;
  }

  if (totalCurrentValueOfOpenPositions > 0 && totals[StockColumnKey.UnrealizedPL]) {
    totals[StockColumnKey.UnrealizedPLPct] = (totals[StockColumnKey.UnrealizedPL] / totalCurrentValueOfOpenPositions) * 100;
  }

  return totals;
}