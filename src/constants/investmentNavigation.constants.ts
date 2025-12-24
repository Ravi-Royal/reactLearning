export const INVESTMENT_NAVIGATION_ITEMS = [
  {
    id: 'stock',
    title: 'Stock',
    description: 'Comprehensive stock portfolio analysis with P&L calculations, favorites, and checklists.',
    icon: {
      path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      bgColor: 'bg-blue-100',
      color: 'text-blue-600',
    },
    route: 'stock',
    buttonText: 'Explore Stocks',
    buttonColors: {
      active: 'bg-blue-600 text-white',
      inactive: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    },
  },
  {
    id: 'bonds',
    title: 'Bonds & Fixed Income',
    description: 'Learn about bonds, fixed income investments, and portfolio diversification.',
    icon: {
      path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
      bgColor: 'bg-green-100',
      color: 'text-green-600',
    },
    route: 'bonds',
    buttonText: 'Learn Bonds',
    buttonColors: {
      active: 'bg-green-600 text-white',
      inactive: 'bg-green-50 text-green-600 hover:bg-green-100',
    },
  },
];

export const INVESTMENT_QUICK_STATS = [
  {
    id: 'tools',
    value: '2',
    label: 'Investment Types',
    color: 'text-blue-600',
  },
  {
    id: 'assets',
    value: '∞',
    label: 'Assets Supported',
    color: 'text-green-600',
  },
  {
    id: 'learning',
    value: 'Interactive',
    label: 'Learning Tools',
    color: 'text-purple-600',
  },
];