import { Link, useLocation } from 'react-router-dom';
import { COMMODITIES_NAVIGATION_ITEMS, COMMODITIES_QUICK_STATS } from '../../constants/commoditiesNavigation.constants';
import Breadcrumbs from './Breadcrumbs';

function CommoditiesNavigation() {
  const location = useLocation();

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Breadcrumbs />
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Commodities Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Track and analyze precious metals and commodity markets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {COMMODITIES_NAVIGATION_ITEMS.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 ${item.icon.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${item.icon.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon.path} />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">{item.title}</h3>
            </div>
            <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">{item.description}</p>
            <Link
              to={item.route}
              className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                location.pathname.includes(`/${item.route}`)
                  ? item.buttonColors.active
                  : item.buttonColors.inactive
              }`}
            >
              {item.buttonText}
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 bg-gray-50 rounded-lg p-4 sm:p-6">
        <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Quick Stats</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
          {COMMODITIES_QUICK_STATS.map((stat) => (
            <div key={stat.id} className="text-center p-3 bg-white rounded-lg">
              <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommoditiesNavigation;
