import { Link, useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

const ANGULAR_SECTIONS = [
  {
    id: 'interview-questions',
    title: 'Interview Questions',
    description:
      'Angular interview questions from 3 top sources — GreatFrontEnd, SudheerJ, and WeCreateProblems. Searchable, filterable, with code examples.',
    icon: '🎓',
    questionCount: '73+',
    badge: 'HOT',
    badgeColor: 'bg-red-500',
  },
];

const ANGULAR_NAVIGATION = {
  HEADING: 'Angular',
  SUBTITLE: 'Learn Angular concepts, architecture, and interview preparation',
  ABOUT_TITLE: 'About Angular',
  ABOUT_TEXT:
    'Angular is a powerful TypeScript-based framework by Google for building scalable single-page applications. It features component-based architecture, powerful dependency injection, reactive forms, lazy loading, and a comprehensive CLI. Mastering Angular opens doors to enterprise-grade web development.',
};

function AngularNavigation() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="p-4 sm:p-6 md:p-8 lg:p-10">
        <Breadcrumbs />

        {/* Hero header */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
              <span className="text-white text-3xl sm:text-4xl font-extrabold">A</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
                {ANGULAR_NAVIGATION.HEADING}
              </h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1">{ANGULAR_NAVIGATION.SUBTITLE}</p>
            </div>
          </div>

          {/* Section cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {ANGULAR_SECTIONS.map((section) => (
              <Link
                key={section.id}
                to={section.id}
                className={`group relative bg-white rounded-2xl shadow-sm border-2 p-5 transition-all duration-300 hover:shadow-xl hover:border-red-300 ${
                  location.pathname.includes(section.id) ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'
                }`}
              >
                {section.badge && (
                  <span
                    className={`absolute top-3 right-3 ${section.badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full`}
                  >
                    {section.badge}
                  </span>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{section.icon}</span>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      {section.title}
                    </h3>
                    <span className="text-xs text-gray-400">{section.questionCount} questions</span>
                  </div>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-4">{section.description}</p>

                <div className="flex items-center text-red-600 text-sm font-semibold">
                  Explore
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}

            {/* Coming soon placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center text-center min-h-[180px]">
              <span className="text-3xl mb-2">🔧</span>
              <p className="text-gray-400 text-sm font-medium">More sections coming soon</p>
              <p className="text-gray-300 text-xs mt-1">e.g. Code challenges, Architecture patterns</p>
            </div>
          </div>

          {/* About card */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-5 sm:p-6">
            <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <span>🅰️</span> {ANGULAR_NAVIGATION.ABOUT_TITLE}
            </h4>
            <p className="text-red-800 text-xs sm:text-sm leading-relaxed">{ANGULAR_NAVIGATION.ABOUT_TEXT}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['TypeScript', 'RxJS', 'NgModules', 'Signals', 'Ivy', 'SSR'].map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-lg font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AngularNavigation;
