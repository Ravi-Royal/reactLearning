/**
 * Global API configuration constants
 */

/**
 * Configuration for stock price API calls
 */
export interface StockApiConfig {
    baseUrl: string;
    exchanges: {
        nse: string;
        bse: string;
    };
}

/**
 * Yahoo Finance API configuration
 */
export const YAHOO_FINANCE_CONFIG: StockApiConfig = {
    baseUrl: '/yahooFinance/v8/finance/chart',
    exchanges: {
        nse: 'NS',    // National Stock Exchange
        bse: 'BO',    // Bombay Stock Exchange
    },
} as const;
