export const CALCULATOR_NAVIGATION_ITEMS = [
  {
    id: 'stock-average',
    title: 'Stock Average Calculator',
    description: 'Calculate average purchase price for your stock holdings with multiple buy transactions.',
    icon: {
      path: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
      bgColor: 'bg-blue-100',
      color: 'text-blue-600',
    },
    route: '/investment/calculator/stock-average',
    buttonText: 'Calculate Stock Average',
    buttonColors: {
      active: 'bg-blue-600 text-white',
      inactive: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    },
  },
  {
    id: 'mutual-fund',
    title: 'Mutual Fund Calculator',
    description: 'Calculate SIP/Lumpsum returns, SWP duration, and sustainable withdrawal amounts.',
    icon: {
      path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      bgColor: 'bg-purple-100',
      color: 'text-purple-600',
    },
    route: '/investment/calculator/mutual-fund',
    buttonText: 'Calculate MF Returns',
    buttonColors: {
      active: 'bg-purple-600 text-white',
      inactive: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    },
  },
];

export const CALCULATOR_QUICK_STATS = [
  {
    id: 'calculators',
    value: '2',
    label: 'Calculators Available',
    color: 'text-blue-600',
  },
  {
    id: 'features',
    value: 'SIP/SWP',
    label: 'Advanced Features',
    color: 'text-purple-600',
  },
  {
    id: 'accuracy',
    value: '100%',
    label: 'Calculation Accuracy',
    color: 'text-green-600',
  },
];
