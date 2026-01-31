import { Link, useLocation } from 'react-router-dom';
import { HOOKS_DATA } from '@constants/hooksNavigation.constants';
import Breadcrumbs from './Breadcrumbs';

const HOOKS_NAVIGATION = {
  HEADING: 'React Hooks',
  SUBTITLE: 'Explore and learn different React hooks',
  ABOUT_TITLE: 'About Hooks',
};

function HooksNavigation() {
  const location = useLocation();

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Breadcrumbs />
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{HOOKS_NAVIGATION.HEADING}</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">{HOOKS_NAVIGATION.SUBTITLE}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {HOOKS_DATA.map((hook) => (
          <Link
            key={hook.name}
            to={hook.name.toLowerCase()}
            className={`block bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 ${
              location.pathname.includes(hook.name.toLowerCase())
                ? 'ring-2 ring-blue-500 border-blue-300'
                : 'hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <span className="text-xl sm:text-2xl">{hook.icon}</span>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">{hook.name}</h3>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{hook.description}</p>
            <div className="flex items-center text-blue-600 text-xs sm:text-sm font-medium">
              Explore Hook
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 bg-blue-50 rounded-lg p-4 sm:p-6">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">{HOOKS_NAVIGATION.ABOUT_TITLE}</h4>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
          Hooks are functions that let you "hook into" React state and lifecycle features from function components. They
          let you use state and other React features without writing a class component.
        </p>
      </div>
    </div>
  );
}

export default HooksNavigation;
