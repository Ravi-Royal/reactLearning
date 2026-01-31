export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const TOAST_STYLES = {
  SUCCESS: 'bg-green-500 text-white',
  ERROR: 'bg-red-500 text-white',
  WARNING: 'bg-orange-500 text-white',
  INFO: 'bg-blue-500 text-white',
  DEFAULT: 'bg-gray-700 text-white',
} as const;

export const TOAST_ICONS = {
  SUCCESS: '✓',
  ERROR: '✕',
  WARNING: '⚠',
  INFO: 'ℹ',
  DEFAULT: '•',
} as const;

export const TOAST_ARIA_LABELS = {
  CLOSE: 'Close notification',
} as const;

export const TOAST_BASE_STYLES = 
  'flex items-center justify-between px-4 py-3 rounded-lg shadow-lg text-sm min-w-[250px] max-w-[400px] mb-3 transition-all duration-300 ease-in-out' as const;
