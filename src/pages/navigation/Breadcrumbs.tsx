import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BREADCRUMB_LABELS, BREADCRUMB_PATHS, BREADCRUMB_ARIA_LABELS } from './constants/breadcrumbs.constants';

interface BreadcrumbItem {
  label: string;
  path: string;
}

// Maps static paths to their corresponding breadcrumb labels
const BREADCRUMB_MAP: Record<string, string> = {
  [BREADCRUMB_PATHS.INVESTMENT]: BREADCRUMB_LABELS.INVESTMENT,
  [BREADCRUMB_PATHS.HOOKS]: BREADCRUMB_LABELS.HOOKS,
  [BREADCRUMB_PATHS.STOCK]: BREADCRUMB_LABELS.STOCK,
  [BREADCRUMB_PATHS.STOCK_ANALYSIS]: BREADCRUMB_LABELS.STOCK_ANALYSIS,
  [BREADCRUMB_PATHS.STOCK_ZERODHA]: BREADCRUMB_LABELS.STOCK_ZERODHA,
  [BREADCRUMB_PATHS.STOCK_FAVORITES]: BREADCRUMB_LABELS.STOCK_FAVORITES,
  [BREADCRUMB_PATHS.STOCK_CHECKLIST]: BREADCRUMB_LABELS.STOCK_CHECKLIST,
  [BREADCRUMB_PATHS.STOCK_AVERAGE_CALCULATOR]: BREADCRUMB_LABELS.STOCK_AVERAGE_CALCULATOR,
  [BREADCRUMB_PATHS.STOCK_PROFIT_CALCULATOR]: BREADCRUMB_LABELS.STOCK_PROFIT_CALCULATOR,
  [BREADCRUMB_PATHS.MUTUAL_FUND]: BREADCRUMB_LABELS.MUTUAL_FUND,
  [BREADCRUMB_PATHS.MUTUAL_FUND_CHECKLIST]: BREADCRUMB_LABELS.MUTUAL_FUND_CHECKLIST,
  [BREADCRUMB_PATHS.MUTUAL_FUND_CALCULATOR]: BREADCRUMB_LABELS.MUTUAL_FUND_CALCULATOR,
  [BREADCRUMB_PATHS.BONDS]: BREADCRUMB_LABELS.BONDS,
  [BREADCRUMB_PATHS.BONDS_BEFORE_STARTING]: BREADCRUMB_LABELS.BONDS_BEFORE_STARTING,
  [BREADCRUMB_PATHS.BONDS_CHECKLIST]: BREADCRUMB_LABELS.BONDS_CHECKLIST,
  [BREADCRUMB_PATHS.COMMODITIES]: BREADCRUMB_LABELS.COMMODITIES,
  [BREADCRUMB_PATHS.GOLD_SILVER_RATIO]: BREADCRUMB_LABELS.GOLD_SILVER_RATIO,
  [BREADCRUMB_PATHS.CALCULATOR]: BREADCRUMB_LABELS.CALCULATOR,
  [BREADCRUMB_PATHS.CALCULATOR_STOCK_AVERAGE]: BREADCRUMB_LABELS.STOCK_AVERAGE_CALCULATOR,
  [BREADCRUMB_PATHS.CALCULATOR_STOCK_PROFIT]: BREADCRUMB_LABELS.STOCK_PROFIT_CALCULATOR,
  [BREADCRUMB_PATHS.ANGULAR]: BREADCRUMB_LABELS.ANGULAR,
  [BREADCRUMB_PATHS.ANGULAR_INTERVIEW_QUESTIONS]: BREADCRUMB_LABELS.ANGULAR_INTERVIEW_QUESTIONS,
  [BREADCRUMB_PATHS.ANGULAR_GREATFRONTEND]: BREADCRUMB_LABELS.ANGULAR_GREATFRONTEND,
  [BREADCRUMB_PATHS.ANGULAR_SUDHEERJ]: BREADCRUMB_LABELS.ANGULAR_SUDHEERJ,
  [BREADCRUMB_PATHS.ANGULAR_WECREATEPROBLEMS]: BREADCRUMB_LABELS.ANGULAR_WECREATEPROBLEMS,
};

function Breadcrumbs() {
  const location = useLocation();

  // Dynamically compute the breadcrumb items based on the active path
  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [{ label: BREADCRUMB_LABELS.HOME, path: BREADCRUMB_PATHS.HOME }];

    let currentPath = '';
    pathnames.forEach((segment) => {
      currentPath += `/${segment}`;
      let label = BREADCRUMB_MAP[currentPath];

      // Handle dynamic segments e.g. React hooks names
      if (!label && currentPath.startsWith('/hooks/')) {
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }

      if (label) {
        items.push({ label, path: currentPath });
      }
    });

    return items;
  }, [location.pathname]);

  return (
    <nav className="flex mb-2 sm:mb-3 overflow-x-auto" aria-label={BREADCRUMB_ARIA_LABELS.NAVIGATION}>
      <ol className="inline-flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 flex-nowrap">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center flex-shrink-0">
            {index > 0 && (
              <svg
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 mx-0.5 sm:mx-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-xs sm:text-sm font-semibold text-gray-800 bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded whitespace-nowrap leading-none flex items-center">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded transition-all duration-200 whitespace-nowrap leading-none flex items-center"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
