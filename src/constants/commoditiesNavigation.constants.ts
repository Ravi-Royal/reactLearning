export const COMMODITIES_NAVIGATION_ITEMS = [
  {
    id: 'gold-silver-ratio',
    title: 'Gold vs Silver Ratio',
    description: 'Analyze gold-silver ratio to determine optimal buying opportunities and relative value.',
    icon: {
      path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      bgColor: 'bg-yellow-100',
      color: 'text-yellow-600',
    },
    route: 'gold-silver-ratio',
    buttonText: 'View Analysis',
    buttonColors: {
      active: 'bg-yellow-600 text-white',
      inactive: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
    },
  },
];

export const COMMODITIES_QUICK_STATS = [
  {
    id: 'tools',
    value: '1',
    label: 'Analysis Tools',
    color: 'text-yellow-600',
  },
  {
    id: 'commodities',
    value: '2',
    label: 'Commodities Tracked',
    color: 'text-orange-600',
  },
  {
    id: 'insights',
    value: 'Live',
    label: 'Market Insights',
    color: 'text-amber-600',
  },
];
