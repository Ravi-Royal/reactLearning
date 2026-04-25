import { Link, useLocation } from 'react-router-dom';
import Breadcrumbs from '@pages/navigation/Breadcrumbs';

const SOURCES = [
  {
    id: 'greatfrontend',
    title: 'GreatFrontEnd',
    subtitle: 'Top Angular Interview Questions',
    description:
      'Curated set of practical Angular questions covering core concepts, lifecycle, RxJS, signals, and modern features.',
    questions: 33,
    difficulty: 'Beginner → Advanced',
    icon: '🎯',
    gradient: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-200',
    hoverBorder: 'hover:border-cyan-400',
    textColor: 'text-cyan-700',
    bgLight: 'bg-cyan-50',
    url: 'https://github.com/greatfrontend/top-angular-interview-questions',
  },
  {
    id: 'sudheerj',
    title: 'SudheerJ',
    subtitle: '300 Angular Interview Questions',
    description:
      'Comprehensive collection by Sudheer Jonna covering everything from basics to advanced testing and performance topics.',
    questions: 20,
    difficulty: 'Beginner → Expert',
    icon: '🚀',
    gradient: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-200',
    hoverBorder: 'hover:border-violet-400',
    textColor: 'text-violet-700',
    bgLight: 'bg-violet-50',
    url: 'https://github.com/sudheerj/angular-interview-questions',
  },
  {
    id: 'wecreateproblems',
    title: 'WeCreateProblems',
    subtitle: '100+ Angular Interview Questions',
    description:
      'Questions designed for recruiters and developers, covering architecture, forms, routing, performance and state management.',
    questions: 20,
    difficulty: 'Beginner → Advanced',
    icon: '💡',
    gradient: 'from-rose-500 to-pink-600',
    borderColor: 'border-rose-200',
    hoverBorder: 'hover:border-rose-400',
    textColor: 'text-rose-700',
    bgLight: 'bg-rose-50',
    url: 'https://www.wecreateproblems.com/interview-questions/angular-interview-questions',
  },
];

function InterviewQuestionsHub() {
  const location = useLocation();

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold mb-3">
            <span>🅰️</span> Angular Interview Prep
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Interview Question Sources
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl">
            Explore Angular interview questions from multiple curated sources. Each source has its own unique angle and
            depth — study them all to ace your interview!
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Questions', value: '73+' },
            { label: 'Sources', value: '3' },
            { label: 'Categories', value: '20+' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-200">
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Source cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOURCES.map((source) => (
            <Link
              key={source.id}
              to={source.id}
              className={`group block bg-white rounded-2xl border-2 ${source.borderColor} ${source.hoverBorder} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
                location.pathname.includes(source.id) ? 'ring-2 ring-offset-2 ring-blue-400' : ''
              }`}
            >
              {/* Gradient top bar */}
              <div className={`h-2 bg-gradient-to-r ${source.gradient}`} />

              <div className="p-5">
                {/* Icon + title */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{source.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {source.title}
                    </h3>
                    <p className={`text-xs font-semibold ${source.textColor}`}>{source.subtitle}</p>
                  </div>
                </div>

                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{source.description}</p>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${source.bgLight} ${source.textColor}`}>
                    📝 {source.questions} questions
                  </span>
                  <span className="text-xs px-2 py-1 rounded-lg font-medium bg-gray-100 text-gray-600">
                    {source.difficulty}
                  </span>
                </div>

                {/* CTA */}
                <div
                  className={`flex items-center text-sm font-semibold ${source.textColor} group-hover:gap-2 transition-all`}
                >
                  Start Studying
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tips section */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
          <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
            <span>💡</span> Study Tips
          </h4>
          <ul className="text-amber-800 text-sm space-y-1">
            <li>
              • Start with <strong>Beginner</strong> questions to build a solid foundation
            </li>
            <li>• Use the search to find questions on a specific topic quickly</li>
            <li>• Read the code examples carefully — most interviews involve live coding</li>
            <li>• Filter by category to do a focused study session</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default InterviewQuestionsHub;
