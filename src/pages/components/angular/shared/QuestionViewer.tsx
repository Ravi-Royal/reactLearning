import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { AngularQuestion, Difficulty, QuestionCategory } from './types';

interface QuestionViewerProps {
  questions: AngularQuestion[];
  categories: QuestionCategory[];
  sourceLabel: string;
  sourceUrl: string;
}

const DIFFICULTY_DARK: Record<Difficulty, string> = {
  beginner: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700',
  intermediate: 'bg-amber-900/60 text-amber-300 border border-amber-700',
  advanced: 'bg-red-900/60 text-red-300 border border-red-700',
};

const DIFFICULTY_LIGHT: Record<Difficulty, string> = {
  beginner: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
  intermediate: 'bg-amber-100 text-amber-800 border border-amber-300',
  advanced: 'bg-red-100 text-red-800 border border-red-300',
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: '🟢 Beginner',
  intermediate: '🟡 Intermediate',
  advanced: '🔴 Advanced',
};

function QuestionViewer({ questions, categories, sourceLabel, sourceUrl }: QuestionViewerProps) {
  const [dark, setDark] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState<'all' | Difficulty>('all');

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        search.trim() === '' ||
        q.question.toLowerCase().includes(search.toLowerCase()) ||
        q.answer.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === 'all' || q.category === activeCategory;
      const matchesDiff = activeDifficulty === 'all' || q.difficulty === activeDifficulty;
      return matchesSearch && matchesCat && matchesDiff;
    });
  }, [questions, search, activeCategory, activeDifficulty]);

  const toggle = (id: number) => setOpenId(openId === id ? null : id);

  /* ── theme tokens ── */
  const bg = dark
    ? 'min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]'
    : 'min-h-screen bg-gradient-to-br from-slate-100 to-gray-200';

  const headerBg = dark
    ? 'bg-black/30 backdrop-blur-md border-b border-white/10'
    : 'bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm';

  const searchBg = dark
    ? 'bg-white/10 border border-white/20 text-white placeholder-white/40 focus:ring-cyan-500/60'
    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-400';

  const filterAll = (active: boolean) =>
    dark
      ? active
        ? 'bg-cyan-500 border-cyan-400 text-white shadow-cyan-500/30 shadow-lg'
        : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
      : active
        ? 'bg-blue-600 border-blue-500 text-white shadow-blue-300 shadow-md'
        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100';

  const diffAll = (active: boolean) =>
    dark
      ? active
        ? 'bg-violet-500 border-violet-400 text-white shadow-violet-500/30 shadow-lg'
        : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
      : active
        ? 'bg-violet-600 border-violet-500 text-white shadow-violet-300 shadow-md'
        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100';

  const cardBase = (open: boolean) =>
    dark
      ? open
        ? 'bg-white/10 border-cyan-500/50 shadow-cyan-500/10 shadow-lg'
        : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/25'
      : open
        ? 'bg-blue-50 border-blue-400 shadow-blue-100 shadow-md'
        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md';

  const questionText = dark ? 'text-white' : 'text-gray-900';
  const answerText = dark ? 'text-slate-200' : 'text-gray-800';
  const numBadge = dark ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-500';
  const chevron = dark ? 'text-white/40' : 'text-gray-400';
  const statsText = dark ? 'text-white/40' : 'text-gray-500';
  const statsHighlight = dark ? 'text-cyan-400' : 'text-blue-600';
  const codeBg = dark ? 'bg-black/60 border-white/10' : 'bg-gray-900 border-gray-700';
  const codeLabel = dark ? 'text-emerald-400' : 'text-emerald-500';
  const divider = dark ? 'bg-white/10' : 'bg-gray-200';
  const cardDivider = dark ? 'border-white/10' : 'border-gray-200';
  const headerTitle = dark ? 'text-white' : 'text-gray-900';
  const sourceLink = dark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-800';
  const headerSub = dark ? 'text-white/50' : 'text-gray-500';

  const difficultyStyle = (d: Difficulty) => (dark ? DIFFICULTY_DARK[d] : DIFFICULTY_LIGHT[d]);

  return (
    <div className={bg}>
      {/* ── Page Header ── */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${dark ? 'bg-white/10 text-white/80 border border-white/20' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}
            >
              📚 Interview Prep
            </span>
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 leading-tight ${headerTitle}`}>
              Angular Interview Questions
            </h1>
            <p className={`text-sm sm:text-base mb-0.5 ${headerSub}`}>
              Source:{' '}
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline transition-colors ${sourceLink}`}
              >
                {sourceLabel}
              </a>
            </p>
            <p className={`text-sm ${headerSub}`}>
              {questions.length} questions · {categories.length} categories
            </p>
          </div>

          {/* Dark/Light toggle */}
          <button
            id="dark-mode-toggle"
            onClick={() => setDark(!dark)}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm border transition-all duration-300 flex-shrink-0 self-start ${
              dark
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm'
            }`}
          >
            <span className="text-lg">{dark ? '☀️' : '🌙'}</span>
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      {/* ── Sticky Controls ── */}
      <div className={`sticky top-0 z-10 px-4 sm:px-6 lg:px-8 py-3 ${headerBg}`}>
        <div className="max-w-5xl mx-auto space-y-2.5">
          {/* Search */}
          <div className="relative">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? 'text-white/40' : 'text-gray-400'}`}>
              🔍
            </span>
            <input
              type="text"
              id="angular-question-search"
              placeholder="Search questions or answers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-9 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${searchBg}`}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm transition-colors ${dark ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}
              >
                ✕
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${filterAll(activeCategory === 'all')}`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${filterAll(activeCategory === cat.id)}`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className={`text-xs ${dark ? 'text-white/40' : 'text-gray-500'}`}>Difficulty:</span>
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setActiveDifficulty(d)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${diffAll(activeDifficulty === d)}`}
              >
                {d === 'all' ? '🌐 All' : DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>

          <p className={`text-xs ${statsText}`}>
            Showing <span className={`font-semibold ${statsHighlight}`}>{filtered.length}</span> of {questions.length}{' '}
            questions
          </p>
        </div>
      </div>

      {/* ── Questions List ── */}
      <div className="px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-5xl mx-auto space-y-3">
          {filtered.length === 0 ? (
            <div className={`text-center py-16 ${dark ? 'text-white/40' : 'text-gray-400'}`}>
              <div className="text-5xl mb-4">🔍</div>
              <p className={`text-lg font-semibold ${dark ? 'text-white/60' : 'text-gray-600'}`}>No questions found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            filtered.map((q, index) => (
              <div
                key={q.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${cardBase(openId === q.id)}`}
              >
                {/* Question row */}
                <button
                  id={`q-${q.id}`}
                  onClick={() => toggle(q.id)}
                  className="w-full text-left px-4 sm:px-5 py-4 flex items-start gap-3 focus:outline-none"
                >
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 ${numBadge}`}
                  >
                    {index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm sm:text-base leading-snug ${questionText}`}>{q.question}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${difficultyStyle(q.difficulty)}`}
                      >
                        {DIFFICULTY_LABELS[q.difficulty]}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${dark ? 'bg-white/5 text-white/50 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                      >
                        {categories.find((c) => c.id === q.category)?.icon}{' '}
                        {categories.find((c) => c.id === q.category)?.label || q.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`flex-shrink-0 mt-1.5 text-xs transition-transform duration-300 ${chevron} ${openId === q.id ? 'rotate-180' : ''}`}
                  >
                    ▼
                  </span>
                </button>

                {/* Answer panel */}
                {openId === q.id && (
                  <div className={`px-4 sm:px-5 pb-5 border-t ${cardDivider}`}>
                    <div className="pt-4">
                      <div
                        className={`text-sm sm:text-base leading-relaxed ${answerText} prose prose-sm sm:prose-base max-w-none ${dark ? 'prose-invert' : ''}`}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({ node: _, ...props }) => (
                              <div className="overflow-x-auto my-4">
                                <table
                                  className={`min-w-full divide-y ${dark ? 'divide-white/20' : 'divide-gray-300'} border ${dark ? 'border-white/20' : 'border-gray-300'}`}
                                  {...props}
                                />
                              </div>
                            ),
                            thead: ({ node: _, ...props }) => (
                              <thead className={`${dark ? 'bg-white/10' : 'bg-gray-100'}`} {...props} />
                            ),
                            th: ({ node: _, ...props }) => (
                              <th className="px-4 py-2 text-left text-sm font-semibold" {...props} />
                            ),
                            td: ({ node: _, ...props }) => (
                              <td
                                className={`px-4 py-2 text-sm border-t ${dark ? 'border-white/10' : 'border-gray-200'}`}
                                {...props}
                              />
                            ),
                            code: ({ node: _, className, children, ...props }) => {
                              const match = /language-(\w+)/.exec(className || '');
                              const isInline = !match && !className;
                              return isInline ? (
                                <code
                                  className={`px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono ${dark ? 'bg-white/10 text-pink-300' : 'bg-gray-100 text-pink-600'}`}
                                  {...props}
                                >
                                  {children}
                                </code>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {q.answer}
                        </ReactMarkdown>
                      </div>

                      {q.code && (
                        <div className="mt-5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-semibold uppercase tracking-wider ${codeLabel}`}>
                              💻 Code Example
                            </span>
                            <div className={`flex-1 h-px ${divider}`} />
                          </div>
                          <pre className={`rounded-xl p-4 overflow-x-auto text-sm border ${codeBg}`}>
                            <code className="text-emerald-300 font-mono leading-relaxed">{q.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionViewer;
