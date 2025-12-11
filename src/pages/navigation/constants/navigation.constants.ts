// Navigation constants
export const NAVIGATION_BRAND = {
    text: 'React Learning',
    to: '/',
    className: 'text-white text-xl font-bold hover:text-blue-200 transition-colors'
};

export interface NavigationItem {
    id: string;
    label: string;
    path: string;
    isActiveCheck: (pathname: string) => boolean;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
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

export const NAVIGATION_TAGLINE = {
    text: 'Learning React & TypeScript',
    className: 'text-white text-sm hidden sm:inline'
};