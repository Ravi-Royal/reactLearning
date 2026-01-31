import { Link, useLocation } from 'react-router-dom';
import {
  BREADCRUMB_LABELS,
  BREADCRUMB_PATHS,
  BREADCRUMB_ARIA_LABELS,
  PATH_SEGMENTS,
} from './constants/breadcrumbs.constants';

interface BreadcrumbItem {
  label: string;
  path: string;
}

function Breadcrumbs() {
  const location = useLocation();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter((x) => x);

    const breadcrumbItems: BreadcrumbItem[] = [{ label: BREADCRUMB_LABELS.HOME, path: BREADCRUMB_PATHS.HOME }];

    if (pathnames.includes(PATH_SEGMENTS.INVESTMENT)) {
      breadcrumbItems.push({ label: BREADCRUMB_LABELS.INVESTMENT, path: BREADCRUMB_PATHS.INVESTMENT });

      if (pathnames.includes(PATH_SEGMENTS.STOCK)) {
        breadcrumbItems.push({ label: BREADCRUMB_LABELS.STOCK, path: BREADCRUMB_PATHS.STOCK });

        if (pathnames.includes(PATH_SEGMENTS.ANALYSIS)) {
          breadcrumbItems.push({ label: BREADCRUMB_LABELS.STOCK_ANALYSIS, path: BREADCRUMB_PATHS.STOCK_ANALYSIS });

          if (pathnames.includes(PATH_SEGMENTS.ZERODHA)) {
            breadcrumbItems.push({ label: BREADCRUMB_LABELS.STOCK_ZERODHA, path: BREADCRUMB_PATHS.STOCK_ZERODHA });
          }
        } else if (pathnames.includes(PATH_SEGMENTS.FAVORITES)) {
          breadcrumbItems.push({ label: BREADCRUMB_LABELS.STOCK_FAVORITES, path: BREADCRUMB_PATHS.STOCK_FAVORITES });
        } else if (pathnames.includes(PATH_SEGMENTS.CHECKLIST)) {
          breadcrumbItems.push({ label: BREADCRUMB_LABELS.STOCK_CHECKLIST, path: BREADCRUMB_PATHS.STOCK_CHECKLIST });
        } else if (pathnames.includes(PATH_SEGMENTS.AVERAGE_CALCULATOR)) {
          breadcrumbItems.push({
            label: BREADCRUMB_LABELS.STOCK_AVERAGE_CALCULATOR,
            path: BREADCRUMB_PATHS.STOCK_AVERAGE_CALCULATOR,
          });
        } else if (pathnames.includes(PATH_SEGMENTS.PROFIT_CALCULATOR)) {
          breadcrumbItems.push({
            label: BREADCRUMB_LABELS.STOCK_PROFIT_CALCULATOR,
            path: BREADCRUMB_PATHS.STOCK_PROFIT_CALCULATOR,
          });
        }
      } else if (pathnames.includes(PATH_SEGMENTS.MUTUAL_FUND)) {
        breadcrumbItems.push({ label: BREADCRUMB_LABELS.MUTUAL_FUND, path: BREADCRUMB_PATHS.MUTUAL_FUND });

        if (pathnames.includes(PATH_SEGMENTS.CHECKLIST)) {
          breadcrumbItems.push({
            label: BREADCRUMB_LABELS.MUTUAL_FUND_CHECKLIST,
            path: BREADCRUMB_PATHS.MUTUAL_FUND_CHECKLIST,
          });
        } else if (pathnames.includes(PATH_SEGMENTS.CALCULATOR)) {
          breadcrumbItems.push({
            label: BREADCRUMB_LABELS.MUTUAL_FUND_CALCULATOR,
            path: BREADCRUMB_PATHS.MUTUAL_FUND_CALCULATOR,
          });
        }
      } else if (pathnames.includes(PATH_SEGMENTS.BONDS)) {
        breadcrumbItems.push({ label: BREADCRUMB_LABELS.BONDS, path: BREADCRUMB_PATHS.BONDS });
        // Add child breadcrumb for before-starting
        if (pathnames.includes(PATH_SEGMENTS.BEFORE_STARTING)) {
          breadcrumbItems.push({
            label: BREADCRUMB_LABELS.BONDS_BEFORE_STARTING,
            path: BREADCRUMB_PATHS.BONDS_BEFORE_STARTING,
          });
        } else if (pathnames.includes(PATH_SEGMENTS.CHECKLIST)) {
          breadcrumbItems.push({ label: BREADCRUMB_LABELS.BONDS_CHECKLIST, path: BREADCRUMB_PATHS.BONDS_CHECKLIST });
        }
      } else if (pathnames.includes(PATH_SEGMENTS.COMMODITIES)) {
        breadcrumbItems.push({ label: BREADCRUMB_LABELS.COMMODITIES, path: BREADCRUMB_PATHS.COMMODITIES });

        if (pathnames.includes(PATH_SEGMENTS.GOLD_SILVER_RATIO)) {
          breadcrumbItems.push({
            label: BREADCRUMB_LABELS.GOLD_SILVER_RATIO,
            path: BREADCRUMB_PATHS.GOLD_SILVER_RATIO,
          });
        }
      } else if (pathnames.includes(PATH_SEGMENTS.CALCULATOR)) {
        breadcrumbItems.push({ label: BREADCRUMB_LABELS.CALCULATOR, path: BREADCRUMB_PATHS.CALCULATOR });
        if (pathnames.includes(PATH_SEGMENTS.STOCK_AVERAGE)) {
          breadcrumbItems.push({
            label: BREADCRUMB_LABELS.STOCK_AVERAGE_CALCULATOR,
            path: BREADCRUMB_PATHS.CALCULATOR_STOCK_AVERAGE,
          });
        } else if (pathnames.includes(PATH_SEGMENTS.STOCK_PROFIT)) {
          breadcrumbItems.push({
            label: BREADCRUMB_LABELS.STOCK_PROFIT_CALCULATOR,
            path: BREADCRUMB_PATHS.CALCULATOR_STOCK_PROFIT,
          });
        } else if (pathnames.includes(PATH_SEGMENTS.MUTUAL_FUND)) {
          breadcrumbItems.push({
            label: BREADCRUMB_LABELS.MUTUAL_FUND_CALCULATOR,
            path: BREADCRUMB_PATHS.CALCULATOR_MUTUAL_FUND,
          });
        }
      }
    } else if (pathnames.includes(PATH_SEGMENTS.HOOKS)) {
      breadcrumbItems.push({ label: BREADCRUMB_LABELS.HOOKS, path: BREADCRUMB_PATHS.HOOKS });

      const hookName = pathnames.find((p) => p.startsWith(PATH_SEGMENTS.USE));
      if (hookName) {
        const capitalizedHook = hookName.charAt(0).toUpperCase() + hookName.slice(1);
        breadcrumbItems.push({ label: capitalizedHook, path: `${BREADCRUMB_PATHS.HOOKS}/${hookName}` });
      }
    }

    return breadcrumbItems;
  };

  const breadcrumbs = getBreadcrumbs();

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
