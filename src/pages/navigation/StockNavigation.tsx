import { Link, useLocation } from 'react-router-dom';
import { STOCK_NAVIGATION_ITEMS, STOCK_QUICK_STATS } from '../../constants/stockNavigation.constants';
import Breadcrumbs from './Breadcrumbs';

function StockNavigation() {
  const location = useLocation();

  return (
    <div className="p-6">
      <Breadcrumbs />
      <div className="mb-6">
        <Link
          to="/investment"
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-sm font-medium flex items-center gap-2 mb-4 px-3 py-2 rounded-md transition-colors"
        >
                    ← Back to Investment Analysis
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Stock Analysis Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage and analyze your stock portfolio</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {STOCK_NAVIGATION_ITEMS.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 ${item.icon.bgColor} rounded-lg flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${item.icon.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon.path} />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <Link
              to={item.route}
              className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${location.pathname.includes(`/${item.route}`)
                ? item.buttonColors.active
                : item.buttonColors.inactive
              }`}
            >
              {item.buttonText}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Quick Stats</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {STOCK_QUICK_STATS.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StockNavigation;