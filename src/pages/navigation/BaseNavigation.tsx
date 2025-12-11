import { Link, useLocation } from 'react-router-dom';
import type { NavigationItem } from './constants/navigation.constants';
import { NAVIGATION_BRAND, NAVIGATION_ITEMS, NAVIGATION_TAGLINE } from './constants/navigation.constants';

function BaseNavigation() {
    const location = useLocation();

    const isActive = (item: NavigationItem) => {
        return item.isActiveCheck(location.pathname);
    };

    return (
        <nav className="bg-gray-200 shadow-lg">
            <div className="px-2">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to={NAVIGATION_BRAND.to} className={NAVIGATION_BRAND.className}>
                            {NAVIGATION_BRAND.text}
                        </Link>
                        <div className="hidden md:flex space-x-6">
                            {NAVIGATION_ITEMS.map((item) => (
                                <Link
                                    key={item.id}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item)
                                        ? 'text-blue-600'
                                        : 'text-black hover:text-gray-700 hover:bg-gray-300'
                                        }`}
                                    to={item.path}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className={NAVIGATION_TAGLINE.className}>
                            {NAVIGATION_TAGLINE.text}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default BaseNavigation;