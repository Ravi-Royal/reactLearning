import { Link, useLocation } from 'react-router-dom';

function BaseNavigation() {
    const location = useLocation();

    const brand = {
        text: 'React Learning',
        to: '/',
        className: 'text-white text-xl font-bold hover:text-blue-200 transition-colors'
    };

    const navigationItems = [
        {
            id: 'home',
            label: 'Home',
            path: '/home',
            isActiveCheck: (pathname: string) => pathname === '/home'
        },
        {
            id: 'hooks',
            label: 'React Hooks',
            path: '/hooks',
            isActiveCheck: (pathname: string) => pathname === '/hooks'
        },
        {
            id: 'stock',
            label: 'Stock Analysis',
            path: '/stock',
            isActiveCheck: (pathname: string) => pathname.startsWith('/stock')
        }
    ];

    const tagline = {
        text: 'Learning React & TypeScript',
        className: 'text-white text-sm hidden sm:inline'
    };

    const isActive = (item: typeof navigationItems[0]) => {
        return item.isActiveCheck(location.pathname);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to={brand.to} className={brand.className}>
                            {brand.text}
                        </Link>
                        <div className="hidden md:flex space-x-6">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.id}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item)
                                            ? 'bg-white text-gray-800 shadow-md'
                                            : 'text-blue-100 hover:text-gray-900 hover:bg-white'
                                        }`}
                                    to={item.path}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className={tagline.className}>
                            {tagline.text}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default BaseNavigation;