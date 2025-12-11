import { Link, useLocation } from "react-router-dom";

function StockNavigation() {
    const location = useLocation();

    const navigationItems = [
        {
            id: 'analysis',
            title: 'P&L Analysis',
            description: 'Upload and analyze your stock portfolio with detailed profit/loss calculations, sorting, and filtering.',
            icon: {
                path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                bgColor: 'bg-blue-100',
                color: 'text-blue-600'
            },
            route: 'analysis',
            buttonText: 'Open Analysis Tool',
            buttonColors: {
                active: 'bg-blue-600 text-white',
                inactive: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }
        },
        {
            id: 'favorites',
            title: 'My Favorite Stocks',
            description: 'Keep track of your favorite stocks and monitor their performance over time.',
            icon: {
                path: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
                bgColor: 'bg-green-100',
                color: 'text-green-600'
            },
            route: 'favorites',
            buttonText: 'View Favorites',
            buttonColors: {
                active: 'bg-green-600 text-white',
                inactive: 'bg-green-50 text-green-600 hover:bg-green-100'
            }
        },
        {
            id: 'checklist',
            title: 'Stock Checklist',
            description: 'Quick checklist to help you evaluate and track important stock metrics and criteria.',
            icon: {
                path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                bgColor: 'bg-purple-100',
                color: 'text-purple-600'
            },
            route: 'checklist',
            buttonText: 'Open Checklist',
            buttonColors: {
                active: 'bg-purple-600 text-white',
                inactive: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
            }
        }
    ];

    const quickStats = [
        {
            id: 'tools',
            value: '3',
            label: 'Analysis Tools',
            color: 'text-blue-600'
        },
        {
            id: 'stocks',
            value: '∞',
            label: 'Stocks Supported',
            color: 'text-green-600'
        },
        {
            id: 'updates',
            value: 'Real-time',
            label: 'Data Updates',
            color: 'text-purple-600'
        }
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link
                    to="/"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-sm font-medium flex items-center gap-2 mb-4 px-3 py-2 rounded-md transition-colors"
                >
                    ← Back to Home
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Stock Analysis Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage and analyze your stock portfolio</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {navigationItems.map((item) => (
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
                    {quickStats.map((stat) => (
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