import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

function Breadcrumbs() {
  const location = useLocation();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' },
    ];

    if (pathnames.includes('investment')) {
      breadcrumbs.push({ label: 'Investment', path: '/investment' });

      if (pathnames.includes('stock')) {
        breadcrumbs.push({ label: 'Stock', path: '/investment/stock' });

        if (pathnames.includes('analysis')) {
          breadcrumbs.push({ label: 'P&L Analysis', path: '/investment/stock/analysis' });

          if (pathnames.includes('zerodha')) {
            breadcrumbs.push({ label: 'Zerodha', path: '/investment/stock/analysis/zerodha' });
          }
        } else if (pathnames.includes('favorites')) {
          breadcrumbs.push({ label: 'My Favorites', path: '/investment/stock/favorites' });
        } else if (pathnames.includes('checklist')) {
          breadcrumbs.push({ label: 'Stock Checklist', path: '/investment/stock/checklist' });
        }
      } else if (pathnames.includes('bonds')) {
        breadcrumbs.push({ label: 'Bonds & Fixed Income', path: '/investment/bonds' });
        // Add child breadcrumb for before-starting
        if (pathnames.includes('before-starting')) {
          breadcrumbs.push({ label: 'Before Starting Checklist', path: '/investment/bonds/before-starting' });
        } else if (pathnames.includes('checklist')) {
          breadcrumbs.push({ label: 'Bond Investment Checklist', path: '/investment/bonds/checklist' });
        }
      }
    } else if (pathnames.includes('hooks')) {
      breadcrumbs.push({ label: 'React Hooks', path: '/hooks' });

      const hookName = pathnames.find(p => p.startsWith('use'));
      if (hookName) {
        const capitalizedHook = hookName.charAt(0).toUpperCase() + hookName.slice(1);
        breadcrumbs.push({ label: capitalizedHook, path: `/hooks/${hookName}` });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="inline-flex items-center">
            {index > 0 && (
              <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-sm font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded-md">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.path}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded-md transition-all duration-200"
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