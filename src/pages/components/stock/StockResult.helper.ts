
import * as XLSX from 'xlsx';

/**
 * Enum-like object for all stock column keys.
 */
export const StockColumnKey = {
    Symbol: 'Symbol',
    ISIN: 'ISIN',
    Quantity: 'Quantity',
    BuyValue: 'Buy Value',
    SellValue: 'Sell Value',
    RealizedPL: 'Realized P&L',
    RealizedPLPct: 'Realized P&L Pct.',
    PreviousClosingPrice: 'Previous Closing Price',
    OpenQuantity: 'Open Quantity',
    OpenQuantityType: 'Open Quantity Type',
    OpenValue: 'Open Value',
    UnrealizedPL: 'Unrealized P&L',
    UnrealizedPLPct: 'Unrealized P&L Pct.',
    CustomRealisedStockValue: 'Custom Realised Stock Value',
    CustomUnrealisedStockValue: 'Custom Unrealised Stock Value',
    BuyValuePerStock: 'Buy Value Per Stock',
    SellValuePerStock: 'Sell Value Per Stock',
} as const;

export type StockColumnKeyType = typeof StockColumnKey[keyof typeof StockColumnKey];

/**
 * Array of P&L column keys for color logic.
 */
export const pnlColumnKeys: StockColumnKeyType[] = [
    StockColumnKey.RealizedPL,
    StockColumnKey.RealizedPLPct,
    StockColumnKey.UnrealizedPL,
    StockColumnKey.UnrealizedPLPct,
];

/**
 * Column configuration for rendering tables.
 */
export const stockColumns: Array<{ key: StockColumnKeyType; label: string; align?: 'left' | 'right' }> = [
    { key: StockColumnKey.Symbol, label: 'Symbol' },
    { key: StockColumnKey.CustomRealisedStockValue, label: 'Custom Realised Stock Value', align: 'right' },
    // { key: StockColumnKey.ISIN, label: 'ISIN' },
    { key: StockColumnKey.BuyValuePerStock, label: 'Buy Value Per Stock', align: 'right' },
    { key: StockColumnKey.SellValuePerStock, label: 'Sell Value Per Stock', align: 'right' },
    { key: StockColumnKey.Quantity, label: 'Quantity', align: 'right' },
    { key: StockColumnKey.BuyValue, label: 'Buy Value', align: 'right' },
    { key: StockColumnKey.SellValue, label: 'Sell Value', align: 'right' },
    { key: StockColumnKey.RealizedPL, label: 'Realized P&L', align: 'right' },
    { key: StockColumnKey.RealizedPLPct, label: 'Realized P&L %', align: 'right' },
    { key: StockColumnKey.PreviousClosingPrice, label: 'Previous Close', align: 'right' },
    { key: StockColumnKey.OpenQuantity, label: 'Open Quantity', align: 'right' },
    { key: StockColumnKey.OpenQuantityType, label: 'Open Qty Type' },
    { key: StockColumnKey.OpenValue, label: 'Open Value', align: 'right' },
    { key: StockColumnKey.UnrealizedPL, label: 'Unrealized P&L', align: 'right' },
    { key: StockColumnKey.UnrealizedPLPct, label: 'Unrealized P&L %', align: 'right' },
    { key: StockColumnKey.CustomUnrealisedStockValue, label: 'Custom Unrealised Stock Value', align: 'right' },
];

/**
 * Type for a single row of stock data.
 */
export interface StockData {
    [StockColumnKey.Symbol]: string;
    [StockColumnKey.ISIN]: string;
    [StockColumnKey.Quantity]: number;
    [StockColumnKey.BuyValue]: number;
    [StockColumnKey.SellValue]: number;
    [StockColumnKey.RealizedPL]: number;
    [StockColumnKey.RealizedPLPct]: number;
    [StockColumnKey.PreviousClosingPrice]: number;
    [StockColumnKey.OpenQuantity]: number;
    [StockColumnKey.OpenQuantityType]: string;
    [StockColumnKey.OpenValue]: number;
    [StockColumnKey.UnrealizedPL]: number;
    [StockColumnKey.UnrealizedPLPct]: number;
    [StockColumnKey.CustomRealisedStockValue]?: number;
    [StockColumnKey.CustomUnrealisedStockValue]?: number;
    [StockColumnKey.BuyValuePerStock]?: number;
    [StockColumnKey.SellValuePerStock]?: number;
}

/**
 * Parse an Excel ArrayBuffer and return normalized stock data.
 * @param arrayBuffer Excel file as ArrayBuffer
 * @returns Array of StockData
 */
export async function parseStockExcel(arrayBuffer: ArrayBuffer): Promise<StockData[]> {
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
        (row) => Array.isArray(row) && row.length > 0 && String(row[0]).trim() === 'Symbol'
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
        const stockRealizedProfit = Number(row[StockColumnKey.RealizedPL]) || 0;
        const numberOfStocksQuantity = Number(row[StockColumnKey.Quantity]) || 1;
        const buyValuePerStock = (Number(row[StockColumnKey.BuyValue]) || 0) / numberOfStocksQuantity;
        const sellValuePerStock = (Number(row[StockColumnKey.SellValue]) || 0) / numberOfStocksQuantity;

        // Calculate custom realized stock value
        let customRealisedStockValue: number;
        if (stockRealizedProfit > 0) {
            const stockprofitPerStock = stockRealizedProfit / numberOfStocksQuantity;
            const stockBuyingPrice = buyValuePerStock - stockprofitPerStock;
            customRealisedStockValue = +stockBuyingPrice.toFixed(2);
        } else {
            customRealisedStockValue = +sellValuePerStock.toFixed(2);
        }

        // Calculate custom unrealized stock value
        const unrealizedPL = Number(row[StockColumnKey.UnrealizedPL]) || 0;
        const openQuantity = Number(row[StockColumnKey.OpenQuantity]) || 1;
        const stockUnRealizedProfitPerStock = unrealizedPL / openQuantity;
        const buyUnRealizedValuePerStock = (Number(row[StockColumnKey.OpenValue]) || 0) / openQuantity;
        const stockUnRealizedBuyingPrice = buyUnRealizedValuePerStock + stockUnRealizedProfitPerStock;
        const customUnrealisedStockValue = +stockUnRealizedBuyingPrice.toFixed(2);

        return {
            ...row,
            [StockColumnKey.BuyValuePerStock]: +buyValuePerStock.toFixed(2),
            [StockColumnKey.SellValuePerStock]: +sellValuePerStock.toFixed(2),
            [StockColumnKey.CustomRealisedStockValue]: customRealisedStockValue,
            [StockColumnKey.CustomUnrealisedStockValue]: customUnrealisedStockValue,
        };
    });
}

/**
 * Fetch current stock price from Yahoo Finance API.
 * @param symbol Stock symbol (e.g., 'AAPL')
 * @returns Current price or null if not available
 */
export async function yahooFinance(symbol: string, isNse = true): Promise<number | null> {
    try {
        const apiSymbol = symbol.split('-')[0]; // Use split only for API call
        const url = `/yahooFinance/v8/finance/chart/${apiSymbol}.${isNse ? 'NS' : 'BO'}`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            const quote = data.chart.result[0].meta.regularMarketPrice;
            return quote || null;
        }
        return null;
    } catch (error) {
        console.warn('Yahoo Finance API error for', symbol, error);
        return null;
    }
}

/**
 * Fetch current stock prices using Yahoo Finance API (NS first, then BO as fallback).
 * @param symbols Array of stock symbols
 * @returns Map of symbol to price (null if not found)
 */
export async function fetchStockPrices(symbols: string[]): Promise<Record<string, number | null>> {
    const uniqueSymbols = Array.from(new Set(symbols.filter(Boolean)));
    if (uniqueSymbols.length === 0) return {};

    const priceMap: Record<string, number | null> = {};

    // First, try Yahoo Finance NS for all symbols in parallel
    const nsResults = await fetchPricesFromAPI(uniqueSymbols, (symbol) => yahooFinance(symbol, true));

    // Build initial price map from NS results
    nsResults.forEach(({ symbol, price }) => {
        priceMap[symbol] = price;
    });

    // Find symbols where NS returned null
    const nullSymbols = nsResults
        .filter(({ price }) => price === null)
        .map(({ symbol }) => symbol);

    console.log('Symbols with null prices from NS:', nullSymbols);

    // If there are null symbols, try BO in parallel
    if (nullSymbols.length > 0) {
        const boResults = await fetchPricesFromAPI(nullSymbols, (symbol) => yahooFinance(symbol, false));

        console.log('BO results:', boResults);

        // Update the price map with BO results
        boResults.forEach(({ symbol, price }) => {
            if (price !== null) {
                priceMap[symbol] = price;
            }
        });
    }

    return priceMap;
}

/**
 * Generic helper function to fetch prices from any API in parallel.
 * @param symbols Array of stock symbols
 * @param apiFunction Function that takes a symbol and returns a price promise
 * @returns Array of {symbol, price} objects
 */
async function fetchPricesFromAPI(
    symbols: string[],
    apiFunction: (symbol: string) => Promise<number | null>
): Promise<Array<{ symbol: string; price: number | null }>> {
    const promises = symbols.map(async (symbol) => {
        try {
            const price = await apiFunction(symbol);
            return { symbol, price };
        } catch {
            return { symbol, price: null };
        }
    });

    return Promise.all(promises);
}