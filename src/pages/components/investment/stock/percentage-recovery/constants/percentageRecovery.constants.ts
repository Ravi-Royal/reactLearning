/**
 * Percentage Recovery Constants
 * All text strings, configuration values, and static data.
 * No hardcoded strings should exist in the component.
 */

import type { Severity } from '../types/PercentageRecovery.types';

// ─── Page text ────────────────────────────────────────────────────────────────

export const PERCENTAGE_RECOVERY_TEXTS = {
  LABELS: {
    PAGE_TITLE: '📉 Stock Loss Recovery Table',
    BACK_LINK: '← Back to Stock Dashboard',
    MATH_TITLE: '💡 The Math Behind It',
    CALCULATOR_TITLE: '🔢 Custom Drop Calculator',
    FILTER_TITLE: 'Filter & Sort',
    DROP_INPUT: 'Drop Percentage (%)',
    MIN_DROP: 'Min Drop (%)',
    MAX_DROP: 'Max Drop (%)',
    SEVERITY_FILTER: 'Filter by Severity',
    RESULT_DROP: 'Drop entered',
    RESULT_GAIN: 'Recovery gain needed',
    COL_INDEX: '#',
    COL_DROP: 'Drop (%)',
    COL_RECOVERY: 'Recovery Gain (%)',
    COL_SEVERITY: 'Severity',
    COL_INSIGHT: 'Insight',
  },

  PLACEHOLDERS: {
    DROP_INPUT: 'e.g. 35.5',
  },

  BUTTONS: {
    CALCULATE: 'Calculate Recovery',
    RESET: '✕ Reset all',
    EMPTY_RESET: 'Reset filters',
  },

  MESSAGES: {
    PAGE_SUBTITLE:
      'If a stock drops by X%, how much does it need to gain (from the new lower price) to get back to the original value?',
    MATH_DESCRIPTION:
      'If a stock falls by d%, the new price is (1 − d/100) of the original. To reach the original price again, the gain needed is:',
    MATH_FORMULA: 'Recovery % = [1 ÷ (1 − d/100) − 1] × 100',
    MATH_EXAMPLE: 'A 50% drop needs a 100% gain; a 90% drop needs a massive 900% gain!',
    INPUT_HINT: 'Values ≥ 100% are theoretically unrecoverable',
    EMPTY_STATE: 'No rows match your filters.',
    FOOTER_NOTE:
      'The recovery percentage is calculated from the new lower price, not the original price. This illustrates why avoiding large losses is critical — recovering from deep drawdowns requires disproportionately large gains.',
  },

  ERRORS: {
    INVALID_INPUT: 'Please enter a valid positive number.',
    UNRECOVERABLE: 'A 100% or more drop means the value reaches zero — no recovery possible.',
  },

  ARIA: {
    RESET_BTN: 'Reset all filters and sorting to default',
    CALCULATE_BTN: 'Calculate recovery percentage for custom drop value',
    SORT_DROP: 'Sort by drop percentage',
    SORT_RECOVERY: 'Sort by recovery gain needed',
    SORT_SEVERITY: 'Sort by severity',
    SEVERITY_GROUP: 'Filter by severity level',
    MIN_DROP: 'Minimum drop percentage filter',
    MAX_DROP: 'Maximum drop percentage filter',
    TABLE: 'Stock loss recovery percentage table — sortable and filterable',
  },
} as const;

// ─── Default filter / sort values ────────────────────────────────────────────

export const PERCENTAGE_RECOVERY_DEFAULTS = {
  MIN_DROP: '1',
  MAX_DROP: '100',
  SEVERITY: 'All' as Severity | 'All',
  SORT_KEY: 'drop' as const,
  SORT_DIR: 'asc' as const,
} as const;

// ─── Ordered severity list ────────────────────────────────────────────────────

export const ALL_SEVERITIES: Severity[] = ['Minor', 'Moderate', 'Major', 'Severe', 'Catastrophic'];

// ─── Severity filter button colour map ───────────────────────────────────────

export const SEVERITY_BTN_STYLE: Record<Severity | 'All', { active: string; inactive: string }> = {
  All: {
    active: 'bg-gray-700 text-white border-gray-700',
    inactive: 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50',
  },
  Minor: {
    active: 'bg-green-600 text-white border-green-600',
    inactive: 'bg-white text-green-700 border-green-300 hover:bg-green-50',
  },
  Moderate: {
    active: 'bg-blue-500 text-white border-blue-500',
    inactive: 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50',
  },
  Major: {
    active: 'bg-yellow-500 text-gray-900 border-yellow-500',
    inactive: 'bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50',
  },
  Severe: {
    active: 'bg-orange-500 text-white border-orange-500',
    inactive: 'bg-white text-orange-700 border-orange-300 hover:bg-orange-50',
  },
  Catastrophic: {
    active: 'bg-red-600 text-white border-red-600',
    inactive: 'bg-white text-red-700 border-red-300 hover:bg-red-50',
  },
};
