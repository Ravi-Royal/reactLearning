export const MUTUAL_FUND_NAVIGATION_ITEMS = [
  {
    id: 'calculator',
    title: 'Mutual Fund Calculator',
    description: 'Calculate SIP, Lumpsum, and SWP returns with detailed breakdown and projections.',
    icon: {
      path: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
      bgColor: 'bg-blue-100',
      color: 'text-blue-600',
    },
    route: 'calculator/mutual-fund',
    buttonText: 'Open Calculator',
    buttonColors: {
      active: 'bg-blue-600 text-white',
      inactive: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    },
  },
  {
    id: 'checklist',
    title: 'Mutual Fund Checklist',
    description: 'Evaluate mutual funds systematically with our comprehensive investment checklist.',
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

export const MUTUAL_FUND_QUICK_STATS = [
  {
    id: 'tools',
    value: '2',
    label: 'Analysis Tools',
    color: 'text-blue-600',
  },
  {
    id: 'funds',
    value: '∞',
    label: 'Funds Supported',
    color: 'text-green-600',
  },
  {
    id: 'calculators',
    value: '3',
    label: 'Calculator Types',
    color: 'text-purple-600',
  },
];
