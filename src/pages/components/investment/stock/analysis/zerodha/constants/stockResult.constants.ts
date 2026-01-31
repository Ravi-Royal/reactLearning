/**
 * StockResult Component Constants
 * Centralized configuration and text strings
 */

export const EXCEL_FILE_NAMES = {
  PRIVATE: 'pnl-WAR042.xlsx',
  UPLOAD_DEFAULT: 'uploaded.xlsx',
  JSON_OUTPUT: 'stockData.json',
} as const;

export const EXCEL_SOURCE_TYPES = {
  PRIVATE: 'private',
  UPLOAD: 'upload',
  JSON: 'json',
} as const;

export const STOCK_RESULT_MESSAGES = {
  SAVE_SUCCESS: 'Data saved successfully to stockData.json',
  SAVE_SUCCESS_ALERT: 'Data saved! Please place the downloaded stockData.json file in src/privateDocument/',
  SAVE_ERROR_PREFIX: 'Error saving data: ',
  NO_DATA_TO_SAVE: 'No data to save',
  LOADING_EXCEL_DATA: 'Loading Excel data...',
  LOADED_FROM: 'Loaded data from: ',
  REFRESHING_PRIVATE_DOC: 'Refreshing data from privateDocument Excel and fetching fresh prices...',
  REFRESHING_UPLOAD: 'Refreshing data from uploaded Excel and fetching fresh prices...',
  REFRESHING_JSON_SOURCE: 'Refreshing prices from JSON source...',
  NO_DATA_SOURCE: 'No data source available. Please reload from Excel.',
  NO_STORED_DATA: 'No stored data found to update',
  PRICES_UPDATED: 'Prices updated successfully',
  OLDER_VERSION_LOADED: 'Loaded older version from stockData.json with recalculated Custom Unrealised Stock Value',
  UNKNOWN_ERROR: 'Unknown error occurred',
} as const;

export const STOCK_RESULT_ERROR_PREFIXES = {
  ERROR_LOADING_DATA: 'Error loading data:',
  ERROR_LOADING_PRIVATE_EXCEL: 'Error loading private Excel:',
  ERROR_LOADING_OLDER_VERSION: 'Error loading older version:',
  ERROR_LOADING_UPLOADED_EXCEL: 'Error loading uploaded Excel:',
  ERROR_REFRESHING_DATA: 'Error refreshing data:',
  ERROR_UPDATING_PRICES: 'Error updating prices:',
  ERROR_SAVING_DATA: 'Error saving data:',
  DATA_LOADED: 'Loaded data from: ',
} as const;

export const TABLE_HEADERS = {
  STOCK: 'Stock',
  SYMBOL: 'Symbol',
  QUANTITY: 'Qty',
  AVERAGE_PRICE: 'Avg Price',
  INVESTED_AMOUNT: 'Invested',
  CURRENT_PRICE: 'Current Price',
  CURRENT_VALUE: 'Current Value',
  PROFIT_LOSS: 'P/L',
  PROFIT_LOSS_PERCENTAGE: 'P/L %',
  DAYS_HELD: 'Days',
  ACTIONS: 'Actions',
} as const;

export const BUTTON_TEXTS = {
  LOAD_FROM_PRIVATE: 'Load from Private Excel',
  LOAD_FROM_UPLOAD: 'Upload Excel',
  REFRESH_DATA: 'Refresh Data',
  UPDATE_PRICES: 'Update Prices',
  SAVE_DATA: 'Save Data',
  LOADING: 'Loading...',
  UPDATING: 'Updating...',
  REFRESHING: 'Refreshing...',
} as const;
