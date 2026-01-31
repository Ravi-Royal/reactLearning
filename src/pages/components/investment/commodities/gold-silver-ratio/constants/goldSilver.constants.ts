export const RECOMMENDATION_TYPES = {
  BUY_GOLD: 'buy-gold',
  BUY_SILVER: 'buy-silver',
  NEUTRAL: 'neutral',
} as const;

export const STRENGTH_TYPES = {
  STRONG: 'strong',
  MODERATE: 'moderate',
  WEAK: 'weak',
} as const;

export const GOLD_SILVER_TEXTS = {
  TITLE: 'Gold vs Silver Ratio Analysis',
  SUBTITLE: 'Analyze the gold-silver ratio to identify buying opportunities',
  UPDATED_LABEL: '✓ Updated:',
  MANUAL_ENTRY_TEXT: 'Enter prices manually or fetch live data',
  FETCH_BUTTON: {
    LOADING: 'Fetching...',
    DEFAULT: '🔄 Get Live Prices',
  },
  INPUT_SECTION: {
    TITLE: 'Current Prices',
    GOLD_LABEL: 'Gold Price (per oz)',
    GOLD_PLACEHOLDER: '2000',
    SILVER_LABEL: 'Silver Price (per oz)',
    SILVER_PLACEHOLDER: '25',
    RATIO_TITLE: 'Current Ratio',
    RATIO_SUBTITLE: 'Gold ounces per Silver ounce',
  },
  ANALYSIS_SECTION: {
    TITLE: 'Analysis & Recommendation',
    RECOMMENDATION_LABEL: 'Recommendation',
    STRENGTH_LABEL: 'Signal Strength',
    INTERPRETATION_LABEL: 'Interpretation',
    BUY_GOLD: '🥇 Buy Gold',
    BUY_SILVER: '🥈 Buy Silver',
    NEUTRAL: '⚖️ Neutral / Hold',
  },
  HISTORICAL: {
    TITLE: 'Historical Context',
  },
  GUIDELINES: {
    TITLE: 'Investment Guidelines',
  },
  INFO_SECTION: {
    TITLE: '📊 Understanding the Gold-Silver Ratio',
    MEANING: {
      LABEL: 'What it means:',
      TEXT: 'The gold-silver ratio represents how many ounces of silver it takes to purchase one ounce of gold.',
    },
    USAGE: {
      LABEL: 'How to use it:',
      TEXT: 'When the ratio is high, silver is relatively cheap compared to gold. When low, gold is relatively cheap compared to silver.',
    },
    STRATEGY: {
      LABEL: 'Investment strategy:',
      TEXT: 'Investors can use this ratio to switch between gold and silver holdings, buying the relatively undervalued metal and selling the overvalued one.',
    },
    NOTE: {
      LABEL: 'Important note:',
      TEXT: 'This ratio is just one tool among many. Always consider broader market conditions, your investment goals, and diversification strategy.',
    },
  },
  LIVE_TABLE: {
    TITLE: 'Live Price Comparison (USD)',
    HEADERS: {
      SOURCE: 'Source',
      GOLD: 'Gold',
      SILVER: 'Silver',
      LAST_UPDATED: 'Last Updated',
    },
    NA: 'N/A',
  },
  ERRORS: {
    ALL_FAILED: 'All APIs failed',
    INVALID_FORMAT: 'Data format invalid',
    FETCH_ERROR: 'Unable to auto-fetch from any source. Please enter manually.',
  },
  MESSAGES: {
    AVG_OF: 'Avg of',
  },
};

export const ANALYSIS_MESSAGES = {
  STRONG_BUY_SILVER: 'Silver is extremely undervalued relative to gold. Strong buy signal for silver.',
  MODERATE_BUY_SILVER: 'Silver is significantly undervalued. Consider accumulating silver positions.',
  WEAK_BUY_SILVER: 'Silver is moderately undervalued. Potential opportunity to buy silver.',
  NEUTRAL: 'Ratio is near historical average. Monitor both metals for better entry points.',
  WEAK_BUY_GOLD: 'Gold is starting to look relatively undervalued. Consider building gold positions.',
  MODERATE_BUY_GOLD: 'Gold is significantly undervalued. Good opportunity to accumulate gold.',
  STRONG_BUY_GOLD: 'Gold is extremely undervalued relative to silver. Strong buy signal for gold.',
};
export const HISTORICAL_CONTEXT = [
  { label: 'Historical Average', value: '60-70' },
  { label: '20-Year Range', value: '30-120' },
  { label: 'All-Time High (2020)', value: '~125' },
  { label: 'Natural Ratio', value: '15-17' },
];

export const INVESTMENT_GUIDELINES = [
  {
    condition: 'Ratio > 80',
    description: 'Silver is undervalued - Favor silver purchases',
    borderColor: 'border-yellow-500',
  },
  {
    condition: 'Ratio 60-80',
    description: 'Near average - Monitor for better entry points',
    borderColor: 'border-blue-500',
  },
  {
    condition: 'Ratio < 50',
    description: 'Gold is undervalued - Favor gold purchases',
    borderColor: 'border-amber-500',
  },
  {
    condition: 'Extreme Ratios',
    description: '<40 or >90 indicate strong buying opportunities',
    borderColor: 'border-red-500',
  },
];
