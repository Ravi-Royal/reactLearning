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
    id: 'mutual-fund',
    title: 'Mutual Fund',
    description: 'Calculate SIP returns, analyze funds, and use checklists for informed investment decisions.',
    icon: {
      path: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
      bgColor: 'bg-green-100',
      color: 'text-green-600',
    },
    route: 'mutual-fund',
    buttonText: 'Explore Mutual Funds',
    buttonColors: {
      active: 'bg-green-600 text-white',
      inactive: 'bg-green-50 text-green-600 hover:bg-green-100',
    },
  },
  {
    id: 'bonds',
    title: 'Bonds & Fixed Income',
    description: 'Learn about bonds, fixed income investments, and portfolio diversification.',
    icon: {
      path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
      bgColor: 'bg-yellow-100',
      color: 'text-yellow-600',
    },
    route: 'bonds',
    buttonText: 'Learn Bonds',
    buttonColors: {
      active: 'bg-yellow-600 text-white',
      inactive: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
    },
  },
  {
    id: 'calculator',
    title: 'Calculator',
    description: 'Financial calculators for stock average and mutual fund SIP/SWP calculations.',
    icon: {
      path: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
      bgColor: 'bg-purple-100',
      color: 'text-purple-600',
    },
    route: 'calculator',
    buttonText: 'Open Calculators',
    buttonColors: {
      active: 'bg-purple-600 text-white',
      inactive: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    },
  },
];

export const INVESTMENT_QUICK_STATS = [
  {
    id: 'tools',
    value: '4',
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