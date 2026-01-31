/**
 * Unified theme and UI constants
 * Centralized styling strings and spacing values
 */

export const THEME = {
  // Spacing values
  spacing: {
    xs: 'px-2 py-1',
    sm: 'px-3 py-2',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
    xl: 'px-8 py-4',
  },

  // Border radius
  borderRadius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  },

  // Text sizes
  text: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  },

  // Font weights
  font: {
    thin: 'font-thin',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  },

  // Common background colors
  bg: {
    white: 'bg-white',
    gray50: 'bg-gray-50',
    gray100: 'bg-gray-100',
    gray200: 'bg-gray-200',
    gray300: 'bg-gray-300',
    blue50: 'bg-blue-50',
    blue100: 'bg-blue-100',
    blue600: 'bg-blue-600',
    green50: 'bg-green-50',
    green100: 'bg-green-100',
    green600: 'bg-green-600',
    purple100: 'bg-purple-100',
    purple600: 'bg-purple-600',
    yellow200: 'bg-yellow-200',
  },

  // Common text colors
  text_color: {
    black: 'text-black',
    gray400: 'text-gray-400',
    gray600: 'text-gray-600',
    gray700: 'text-gray-700',
    gray800: 'text-gray-800',
    blue600: 'text-blue-600',
    blue800: 'text-blue-800',
    green600: 'text-green-600',
    green900: 'text-green-900',
    purple600: 'text-purple-600',
    white: 'text-white',
    yellow900: 'text-yellow-900',
  },

  // Common shadows
  shadow: {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  },

  // Border styles
  border: {
    default: 'border border-gray-200',
    blue: 'border border-blue-300',
    gray: 'border border-gray-300',
  },

  // Transitions
  transition: {
    default: 'transition-colors',
    all: 'transition-all duration-200',
  },

  // Common component classes
  card: 'bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-200',
  button_primary: 'bg-blue-600 text-white hover:bg-blue-700',
  button_secondary: 'bg-gray-200 text-black hover:bg-gray-300',
  input: 'px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
  label: 'block text-sm font-medium text-gray-700 mb-1',
} as const;

/**
 * Tailwind class utility combinations
 */
export const TAILWIND_CLASS_GROUPS = {
  // Navigation link classes
  navLink: (isActive: boolean): string => {
    const base = 'px-3 py-2 rounded-md text-sm font-medium transition-colors';
    return isActive ? `${base} text-blue-600` : `${base} text-black hover:text-gray-700 hover:bg-gray-300`;
  },

  // Card with hover effect
  hoverCard: (isActive: boolean): string => {
    const base =
      'block bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-200';
    return isActive ? `${base} ring-2 ring-blue-500 border-blue-300` : `${base} hover:border-gray-300`;
  },

  // Button with state
  stateButton: (isActive: boolean, activeClasses: string, inactiveClasses: string): string => {
    return isActive ? activeClasses : inactiveClasses;
  },

  // Flex center utility
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center space-x-4',

  // Grid layouts
  gridResponsive: 'grid md:grid-cols-2 gap-6',
  gridResponsive3: 'grid md:grid-cols-3 gap-6',
  gridResponsive2l3: 'grid md:grid-cols-2 lg:grid-cols-3 gap-6',
} as const;

/**
 * Reusable component styles
 */
export const COMPONENT_STYLES = {
  container: 'p-6',
  heading1: 'text-2xl font-bold text-gray-800',
  heading2: 'text-xl font-semibold text-gray-800',
  heading3: 'text-lg font-semibold text-gray-800',
  paragraph: 'text-gray-600',
  subtext: 'text-sm text-gray-600',
  icon_small: 'w-4 h-4',
  icon_medium: 'w-6 h-6',
  icon_large: 'w-10 h-10',
  section_gap: 'mb-6',
  subsection_gap: 'mb-4',
  grid_gap: 'gap-6',
} as const;
