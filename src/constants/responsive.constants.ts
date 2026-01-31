/**
 * Standardized responsive design patterns
 * Ensures consistent sizing, spacing, and behavior across all components
 */
export const RESPONSIVE_PATTERNS = {
  // Text sizes - consistent hierarchy
  text: {
    xs: 'text-[10px] sm:text-xs',
    sm: 'text-xs sm:text-sm',
    base: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
    xl: 'text-lg sm:text-xl',
    '2xl': 'text-xl sm:text-2xl',
    '3xl': 'text-xl sm:text-2xl md:text-3xl',
  },

  // Spacing - consistent gaps
  gap: {
    xs: 'gap-1 sm:gap-2',
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4',
    lg: 'gap-4 sm:gap-6',
  },

  // Padding - consistent container spacing
  padding: {
    xs: 'px-2 py-1 sm:px-3 sm:py-1.5',
    sm: 'px-3 py-2 sm:px-4 sm:py-2',
    md: 'px-4 py-2 sm:px-6 sm:py-3',
    page: 'p-2 sm:p-4 md:p-6 lg:p-8',
    card: 'p-3 sm:p-4',
    cardLg: 'p-4 sm:p-6',
  },

  // Button sizes - consistent interactive elements
  button: {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm',
    md: 'px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base',
  },

  // Icon sizes
  icon: {
    xs: 'w-3 h-3 sm:w-4 sm:h-4',
    sm: 'w-4 h-4 sm:w-5 sm:h-5',
    md: 'w-5 h-5 sm:w-6 sm:h-6',
  },

  // Margins
  margin: {
    section: 'mb-4 sm:mb-6',
    subsection: 'mb-3 sm:mb-4',
    element: 'mb-2 sm:mb-3',
  },
} as const;

/**
 * Accessibility standards for WCAG 2.1 compliance
 */
export const A11Y_STANDARDS = {
  minTouchTarget: 'min-h-[44px] min-w-[44px]',
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  visuallyHidden: 'sr-only',
} as const;

/**
 * Animation preferences
 */
export const ANIMATIONS = {
  transition: 'transition-all duration-200 ease-in-out',
  transitionFast: 'transition-all duration-150 ease-in-out',
  transitionSlow: 'transition-all duration-300 ease-in-out',
} as const;

/**
 * Category color mappings for consistent theming
 */
export const CATEGORY_COLORS: Record<string, string> = {
  'Good Stock': 'bg-green-600 text-white',
  'Good Bond': 'bg-green-600 text-white',
  'Check Stock': 'bg-yellow-600 text-white',
  'Check Bond': 'bg-yellow-600 text-white',
  'Avoid Stock': 'bg-red-600 text-white',
  'Avoid Bond': 'bg-red-600 text-white',
  AI: 'bg-blue-100 text-blue-700',
  Personal: 'bg-purple-100 text-purple-700',
  mine: 'bg-pink-100 text-pink-700',
  Education: 'bg-orange-100 text-orange-700',
  Preparation: 'bg-purple-100 text-purple-700',
} as const;
