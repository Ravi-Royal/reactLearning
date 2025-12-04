/**
 * Interface for Yahoo Finance API response
 */
export interface YahooFinanceResponse {
    chart: {
        result: YahooFinanceResult[];
        error: null;
    };
}

/**
 * Interface for individual result in Yahoo Finance response
 */
export interface YahooFinanceResult {
    meta: YahooFinanceMeta;
    timestamp: number[];
    indicators: {
        quote: Array<{
            low: Array<number | null>;
            high: Array<number | null>;
            open: Array<number | null>;
            volume: Array<number | null>;
            close: Array<number | null>;
        }>;
    };
}

/**
 * Interface for meta information in Yahoo Finance response
 */
export interface YahooFinanceMeta {
    currency: string;
    symbol: string;
    exchangeName: string;
    fullExchangeName: string;
    instrumentType: string;
    firstTradeDate: number;
    regularMarketTime: number;
    hasPrePostMarketData: boolean;
    gmtoffset: number;
    timezone: string;
    exchangeTimezoneName: string;
    regularMarketPrice: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    regularMarketDayHigh: number;
    regularMarketDayLow: number;
    regularMarketVolume: number;
    longName: string;
    shortName: string;
    chartPreviousClose: number;
    previousClose: number;
    scale: number;
    priceHint: number;
    currentTradingPeriod: {
        pre: YahooFinanceTradingPeriod;
        regular: YahooFinanceTradingPeriod;
        post: YahooFinanceTradingPeriod;
    };
    tradingPeriods: Array<Array<YahooFinanceTradingPeriod>>;
    dataGranularity: string;
    range: string;
    validRanges: string[];
}

/**
 * Interface for trading period information
 */
export interface YahooFinanceTradingPeriod {
    timezone: string;
    start: number;
    end: number;
    gmtoffset: number;
}

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
 * Type for price mapping from symbol to price
 */
export type PriceMap = Record<string, number | null>;