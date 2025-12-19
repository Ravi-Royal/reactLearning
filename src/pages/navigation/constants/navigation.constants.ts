// Navigation constants
export const NAVIGATION_BRAND = {
  text: 'React Learning',
  to: '/',
  className: 'text-gray-800 text-xl font-bold hover:text-blue-600 transition-colors',
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
    isActiveCheck: (pathname: string) => pathname === '/home',
  },
  {
    id: 'hooks',
    label: 'React Hooks',
    path: '/hooks',
    isActiveCheck: (pathname: string) => pathname === '/hooks',
  },
  {
    id: 'investment',
    label: 'Investment Analysis',
    path: '/investment',
    isActiveCheck: (pathname: string) => pathname.startsWith('/investment'),
  },
];

export const NAVIGATION_TAGLINE = {
  text: 'Learning React & TypeScript',
  className: 'text-gray-600 text-sm hidden sm:inline',
};