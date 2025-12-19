export const STOCK_NAVIGATION_ITEMS = [
  {
    id: 'analysis',
    title: 'P&L Analysis',
    description: 'Upload and analyze your stock portfolio with detailed profit/loss calculations, sorting, and filtering.',
    icon: {
      path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      bgColor: 'bg-blue-100',
      color: 'text-blue-600',
    },
    route: 'analysis',
    buttonText: 'Open Analysis Tool',
    buttonColors: {
      active: 'bg-blue-600 text-white',
      inactive: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    },
  },
  {
    id: 'favorites',
    title: 'My Favorite Stocks',
    description: 'Keep track of your favorite stocks and monitor their performance over time.',
    icon: {
      path: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      bgColor: 'bg-green-100',
      color: 'text-green-600',
    },
    route: 'favorites',
    buttonText: 'View Favorites',
    buttonColors: {
      active: 'bg-green-600 text-white',
      inactive: 'bg-green-50 text-green-600 hover:bg-green-100',
    },
  },
  {
    id: 'checklist',
    title: 'Stock Checklist',
    description: 'Quick checklist to help you evaluate and track important stock metrics and criteria.',
    icon: {
      path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      bgColor: 'bg-purple-100',
      color: 'text-purple-600',
    },
    route: 'checklist',
    buttonText: 'Open Checklist',
    buttonColors: {
      active: 'bg-purple-600 text-white',
      inactive: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    },
  },
];

export const STOCK_QUICK_STATS = [
  {
    id: 'tools',
    value: '3',
    label: 'Analysis Tools',
    color: 'text-blue-600',
  },
  {
    id: 'stocks',
    value: '∞',
    label: 'Stocks Supported',
    color: 'text-green-600',
  },
  {
    id: 'updates',
    value: 'Real-time',
    label: 'Data Updates',
    color: 'text-purple-600',
  },
];