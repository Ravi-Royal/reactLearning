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
      {
        label: 'Loss Recovery Table',
        to: '/investment/stock/percentage-recovery',
        hint: 'See how much % gain is needed to recover from any % drop',
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

const angularLinks: InvestmentSection[] = [
  {
    section: 'Interview Questions',
    links: [
      { label: 'Angular Hub', to: '/angular', hint: 'Explore all Angular learning sections' },
      {
        label: 'Interview Questions',
        to: '/angular/interview-questions',
        hint: 'All Angular interview question sources',
      },
      {
        label: 'GreatFrontEnd Questions',
        to: '/angular/interview-questions/greatfrontend',
        hint: '33 questions from GreatFrontEnd — core, RxJS, signals & more',
      },
      {
        label: 'SudheerJ Questions',
        to: '/angular/interview-questions/sudheerj',
        hint: '20 curated questions from the popular SudheerJ repo',
      },
      {
        label: 'WeCreateProblems Questions',
        to: '/angular/interview-questions/wecreateproblems',
        hint: '20 questions covering Angular basics to advanced topics',
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

const angularSectionStyles: Record<
  string,
  { bg: string; border: string; headerText: string; linkText: string; icon: string }
> = {
  'Interview Questions': {
    bg: 'bg-gradient-to-br from-red-50 to-orange-50',
    border: 'border-red-300',
    headerText: 'text-red-700',
    linkText: 'text-red-600 hover:text-red-800',
    icon: '🅰️',
  },
};

function HomePage() {
  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
          Welcome to React Learning
        </h1>
        <p className="mb-6 text-base sm:text-lg text-gray-600">
          Explore all investment tools, calculators, and learning resources below:
        </p>

        {/* Angular Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span>🅰️</span> Angular Learning
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {angularLinks.map((section) => {
              const styles = angularSectionStyles[section.section] || {
                bg: 'bg-gray-50',
                border: 'border-gray-200',
                headerText: 'text-gray-700',
                linkText: 'text-gray-600 hover:text-gray-800',
                icon: '📖',
              };
              return (
                <div
                  key={section.section}
                  className={`rounded-lg shadow-lg p-4 sm:p-5 border-2 transition duration-200 ${styles.bg} ${styles.border}`}
                >
                  <h3 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${styles.headerText}`}>
                    <span className="text-xl sm:text-2xl">{styles.icon}</span>
                    {section.section}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.to} className="group">
                        <Link
                          to={link.to}
                          className={`block py-2 px-3 rounded-md transition-all hover:bg-white/40 ${styles.linkText}`}
                        >
                          <div className="font-medium text-sm sm:text-base flex items-start">
                            <span className="mr-2 flex-shrink-0">→</span>
                            <span>{link.label}</span>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 ml-5 mt-1 opacity-80 group-hover:opacity-100">
                            {link.hint}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Investment Section */}
        <div className="mb-2">
          <h2 className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span>💹</span> Investment Tools
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
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
                className={`rounded-lg shadow-lg p-4 sm:p-5 border-2 transition duration-200 ${styles.bg} ${styles.border}`}
              >
                <h2 className={`text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 ${styles.headerText}`}>
                  <span className="text-xl sm:text-2xl">{styles.icon}</span>
                  {section.section}
                </h2>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.to} className="group">
                      <Link
                        to={link.to}
                        className={`block py-2 px-3 rounded-md transition-all hover:bg-white/40 ${styles.linkText}`}
                      >
                        <div className="font-medium text-sm sm:text-base flex items-start">
                          <span className="mr-2 flex-shrink-0">→</span>
                          <span>{link.label}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 ml-5 mt-1 opacity-80 group-hover:opacity-100">
                          {link.hint}
                        </div>
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
