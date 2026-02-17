import Breadcrumbs from '@pages/navigation/Breadcrumbs';
import { Link } from 'react-router-dom';

interface InvestmentLink {
  label: string;
  to: string;
  hint: string;
}

interface InvestmentSection {
  section: string;
  links: InvestmentLink[];
}

const investmentLinks: InvestmentSection[] = [
  {
    section: 'Stock',
    links: [
      { label: 'Stock Main', to: '/investment/stock', hint: 'Overview of all stock tools and features' },
      { label: 'Stock Analysis', to: '/investment/stock/analysis', hint: 'Analyze stock performance and metrics' },
      {
        label: 'Stock Zerodha Result',
        to: '/investment/stock/analysis/zerodha',
        hint: 'View Zerodha stock analysis results',
      },
      { label: 'Stock Favorites', to: '/investment/stock/favorites', hint: 'Manage your favorite stocks portfolio' },
      {
        label: 'Stock Checklist',
        to: '/investment/stock/checklist',
        hint: 'Pre-investment checklist before buying stocks',
      },
      {
        label: 'Stock Average Calculator',
        to: '/investment/stock/average-calculator',
        hint: 'Calculate average stock purchase price',
      },
      {
        label: 'Stock Profit Calculator',
        to: '/investment/stock/profit-calculator',
        hint: 'Calculate profit/loss on stock trades',
      },
    ],
  },
  {
    section: 'Mutual Fund',
    links: [
      { label: 'Mutual Fund Main', to: '/investment/mutual-fund', hint: 'Mutual fund tools and resources' },
      {
        label: 'Mutual Fund Checklist',
        to: '/investment/mutual-fund/checklist',
        hint: 'Checklist for choosing mutual funds',
      },
      {
        label: 'Mutual Fund Calculator',
        to: '/investment/mutual-fund/calculator',
        hint: 'SIP, SWP, and returns calculator',
      },
    ],
  },
  {
    section: 'Bonds',
    links: [
      { label: 'Bonds Main', to: '/investment/bonds', hint: 'Learn about bonds and fixed income' },
      {
        label: 'Bonds Before Starting',
        to: '/investment/bonds/before-starting',
        hint: 'Essential guide before investing in bonds',
      },
      { label: 'Bonds Checklist', to: '/investment/bonds/checklist', hint: 'Bond investment evaluation checklist' },
    ],
  },
  {
    section: 'Commodities',
    links: [
      { label: 'Commodities Main', to: '/investment/commodities', hint: 'Commodity trading and analysis tools' },
      {
        label: 'Gold vs Silver Ratio',
        to: '/investment/commodities/gold-silver-ratio',
        hint: 'Track gold-silver price ratio trends',
      },
    ],
  },
  {
    section: 'Calculator',
    links: [
      { label: 'Calculator Main', to: '/investment/calculator', hint: 'All financial calculators in one place' },
      {
        label: 'Stock Average Calculator',
        to: '/investment/calculator/stock-average',
        hint: 'Calculate average stock purchase price',
      },
      {
        label: 'Stock Profit Calculator',
        to: '/investment/calculator/stock-profit',
        hint: 'Calculate profit/loss on stock trades',
      },
    ],
  },
];

// Section color mapping for visual distinction
const sectionStyles: Record<
  string,
  { bg: string; border: string; headerText: string; linkText: string; icon: string }
> = {
  Stock: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    border: 'border-blue-300',
    headerText: 'text-blue-700',
    linkText: 'text-blue-600 hover:text-blue-800',
    icon: '📈',
  },
  'Mutual Fund': {
    bg: 'bg-gradient-to-br from-green-50 to-green-100',
    border: 'border-green-300',
    headerText: 'text-green-700',
    linkText: 'text-green-600 hover:text-green-800',
    icon: '💰',
  },
  Bonds: {
    bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    border: 'border-yellow-300',
    headerText: 'text-yellow-700',
    linkText: 'text-yellow-700 hover:text-yellow-900',
    icon: '🏦',
  },
  Commodities: {
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
    border: 'border-orange-300',
    headerText: 'text-orange-700',
    linkText: 'text-orange-600 hover:text-orange-800',
    icon: '🥇',
  },
  Calculator: {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
    border: 'border-purple-300',
    headerText: 'text-purple-700',
    linkText: 'text-purple-600 hover:text-purple-800',
    icon: '🧮',
  },
};

function HomePage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Welcome to Invest</h1>
        <p className="mb-8 text-lg text-gray-600">Explore all investment tools and calculators below:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {investmentLinks.map((section) => {
            const styles = sectionStyles[section.section] || {
              bg: 'bg-gray-50',
              border: 'border-gray-200',
              headerText: 'text-gray-700',
              linkText: 'text-gray-600 hover:text-gray-800',
              icon: '📊',
            };
            return (
              <div
                key={section.section}
                className={`rounded-lg shadow-lg p-6 border-2 transition duration-200 hover:scale-[1.02] hover:shadow-xl ${styles.bg} ${styles.border}`}
              >
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${styles.headerText}`}>
                  <span className="text-2xl">{styles.icon}</span>
                  {section.section}
                </h2>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className={`hover:underline text-base font-medium transition-colors ${styles.linkText}`}
                      >
                        → {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
