export const STOCK_CONTROLS_TITLES = {
  UPDATE_PRICES_ACTIVE: 'Fetching latest prices from Yahoo Finance',
  UPDATE_PRICES_IDLE: 'Fetch latest Current Price and 52W High/Low',
  REFRESH_DATA: 'Re-read Excel, recalculate fields and fetch fresh prices',
  SAVE_DATA: 'Save current data to stockData.json file',
} as const;

export const STOCK_CONTROLS_ARIA_LABELS = {
  UPDATE_PRICES_ACTIVE: 'Updating prices',
  UPDATE_PRICES_IDLE: 'Update prices',
  REFRESH_DATA: 'Refresh data from Excel and update prices',
  SAVE_DATA: 'Save data to JSON file',
} as const;

export const STOCK_CONTROLS_BUTTON_TEXT = {
  UPDATE_PRICES_ACTIVE: 'Updating...',
  UPDATE_PRICES_IDLE: 'Update Prices',
  REFRESH_DATA: 'Refresh Data',
  SAVE_DATA: 'Save Data',
} as const;
