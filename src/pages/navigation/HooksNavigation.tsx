import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";
import { HOOKS_DATA } from "../../constants/hooksNavigation.constants";

function HooksNavigation() {
    const location = useLocation();

    return (
        <div className="p-6">
            <Breadcrumbs />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">React Hooks Explorer</h1>
                <p className="text-gray-600 mt-1">Learn and experiment with React's built-in hooks</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HOOKS_DATA.map((hook) => (
                    <Link
                        key={hook.name}
                        to={hook.name.toLowerCase()}
                        className={`block bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 ${location.pathname.includes(hook.name.toLowerCase())
                                ? 'ring-2 ring-blue-500 border-blue-300'
                                : 'hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{hook.icon}</span>
                            <h3 className="text-lg font-semibold text-gray-800">{hook.name}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{hook.description}</p>
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                            Explore Hook
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-8 bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">About React Hooks</h4>
                <p className="text-gray-600 text-sm">
                    Hooks are functions that let you "hook into" React state and lifecycle features from function components.
                    They let you use state and other React features without writing a class component.
                </p>
            </div>
        </div>
    );
}

export default HooksNavigation;