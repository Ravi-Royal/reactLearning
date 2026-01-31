import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NAVIGATION_BRAND,
  NAVIGATION_ITEMS,
  NAVIGATION_TAGLINE,
  type NavigationItem,
} from './constants/navigation.constants';
import { BASE_NAVIGATION } from './constants/navigationPage.constants';

function BaseNavigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (item: NavigationItem) => {
    return item.isActiveCheck(location.pathname);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-200 shadow-lg">
      <div className="px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Brand */}
          <div className="flex items-center flex-shrink-0">
            <Link to={NAVIGATION_BRAND.to} className={`${NAVIGATION_BRAND.className} text-base sm:text-lg md:text-xl`}>
              {NAVIGATION_BRAND.text}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.id}
                className={`px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(item) ? 'text-blue-600' : 'text-black hover:text-gray-700 hover:bg-gray-300'
                }`}
                to={item.path}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Tagline - Hidden on mobile */}
          <div className="hidden lg:flex items-center">
            <div className={`${NAVIGATION_TAGLINE.className} text-xs lg:text-sm whitespace-nowrap`}>
              {NAVIGATION_TAGLINE.text}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">{BASE_NAVIGATION.OPEN_MENU_LABEL}</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-100 border-t border-gray-300">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.id}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item) ? 'text-blue-600 bg-gray-200' : 'text-black hover:text-gray-700 hover:bg-gray-200'
                }`}
                to={item.path}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {/* Mobile Tagline */}
          <div className="px-5 py-3 border-t border-gray-300">
            <div className="text-xs text-gray-600">{NAVIGATION_TAGLINE.text}</div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default BaseNavigation;
