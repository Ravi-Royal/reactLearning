/**
 * Percentage thresholds and range constants
 * Used for price and indicator calculations
 */

export const PERCENTAGE_THRESHOLDS = {
  // Price difference thresholds
  price: {
    VERY_CLOSE: 5,      // <= 5%
    CLOSE: 10,          // 5-10%
    MODERATE: 20,       // 10-20%
    FAR: 30,            // 20-30%
  },

  // Data precision
  decimal: 1,           // Display 1 decimal place
} as const;

/**
 * Price range classifications
 */
export const PRICE_RANGES = {
  VERY_CLOSE_TO_LOW: { min: 0, max: 5, label: 'Below 52W low' },
  CLOSE_TO_LOW: { min: 5, max: 10, label: 'Very Close' },
  MODERATELY_CLOSE: { min: 10, max: 20, label: 'Moderately Close' },
  FAR_FROM_LOW: { min: 20, max: 30, label: 'Far From Low' },
  VERY_FAR: { min: 30, max: Infinity, label: 'Very Far From Low' },
} as const;

/**
 * Color mappings for price ranges
 */
export const PRICE_RANGE_COLORS = {
  VERY_CLOSE_TO_LOW: {
    bg: 'bg-green-800',
    text: 'text-white',
    indicator: 'dark green',
  },
  CLOSE_TO_LOW: {
    bg: 'bg-green-600',
    text: 'text-white',
    indicator: 'medium green',
  },
  MODERATELY_CLOSE: {
    bg: 'bg-green-200',
    text: 'text-green-900',
    indicator: 'light green',
  },
  FAR_FROM_LOW: {
    bg: 'bg-yellow-200',
    text: 'text-yellow-900',
    indicator: 'yellow',
  },
  VERY_FAR: {
    bg: '',
    text: 'text-gray-700',
    indicator: 'no highlight',
  },
} as const;

/**
 * Helper to get price range from percentage
 */
export const getPriceRange = (percentage: number): keyof typeof PRICE_RANGES => {
  if (percentage <= PERCENTAGE_THRESHOLDS.price.VERY_CLOSE) {return 'VERY_CLOSE_TO_LOW';}
  if (percentage <= PERCENTAGE_THRESHOLDS.price.CLOSE) {return 'CLOSE_TO_LOW';}
  if (percentage <= PERCENTAGE_THRESHOLDS.price.MODERATE) {return 'MODERATELY_CLOSE';}
  if (percentage <= PERCENTAGE_THRESHOLDS.price.FAR) {return 'FAR_FROM_LOW';}
  return 'VERY_FAR';
};
