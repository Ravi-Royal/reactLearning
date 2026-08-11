import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@pages/navigation/Breadcrumbs';
import {
  COUNT_OPTIONS,
  DEFAULT_COUNT,
  DEFAULT_PERIOD_ID,
  DEFAULT_UNIVERSE,
  MOVERS_TEXTS,
  PERIOD_OPTIONS,
  UNIVERSE_OPTIONS,
} from './constants/topMovers.constants';
import { fetchTopMovers, formatChange, formatPrice, moversProgressText } from './service';
import type { MoverStock, TopMoversResult, UniverseKey } from './types';

type Direction = 'gainers' | 'losers';

const selectClass =
  'bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm';

function MoverRow({ rank, stock }: { rank: number; stock: MoverStock }): React.ReactElement {
  const change = stock.changePct ?? 0;
  const isGain = change >= 0;
  const arrow = isGain ? '▲' : '▼';
  const chipClass = isGain ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200';
  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-3 py-2.5 sm:px-4 text-xs sm:text-sm font-semibold text-gray-500">{rank}</td>
      <td className="px-3 py-2.5 sm:px-4">
        <Link
          to={`/investment/stock/current-stock-details?symbol=${stock.symbol}`}
          title={MOVERS_TEXTS.OPEN_DETAILS}
          className="font-bold text-xs sm:text-sm text-blue-700 hover:text-blue-900 hover:underline"
        >
          {stock.symbol}
        </Link>
      </td>
      <td className="px-3 py-2.5 sm:px-4 text-xs sm:text-sm text-gray-600 max-w-[10rem] sm:max-w-xs truncate">
        {stock.name || '—'}
      </td>
      <td className="px-3 py-2.5 sm:px-4 text-right text-xs sm:text-sm text-gray-800 font-medium whitespace-nowrap">
        {formatPrice(stock.price)}
      </td>
      <td className="px-3 py-2.5 sm:px-4 text-right whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs sm:text-sm font-bold ${chipClass}`}
        >
          <span aria-hidden="true">{arrow}</span>
          {formatChange(stock.changePct)}
        </span>
      </td>
    </tr>
  );
}

export default function TopMovers(): React.ReactElement {
  const [universe, setUniverse] = useState<UniverseKey>(DEFAULT_UNIVERSE);
  const [periodId, setPeriodId] = useState<string>(DEFAULT_PERIOD_ID);
  const [count, setCount] = useState<number>(DEFAULT_COUNT);
  const [direction, setDirection] = useState<Direction>('losers');
  const [result, setResult] = useState<TopMoversResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    const period = PERIOD_OPTIONS.find((option) => option.id === periodId) ?? PERIOD_OPTIONS[3];
    const requestId = ++requestIdRef.current;
    // Cancel any still-running previous fetch so changing universe/period (or
    // leaving the page) stops the proxy requests instead of letting them run.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setError('');
    setProgress({ done: 0, total: 0 });
    try {
      const data = await fetchTopMovers(
        universe,
        period,
        (done, total) => {
          if (requestId === requestIdRef.current) {
            setProgress({ done, total });
          }
        },
        controller.signal,
      );
      if (requestId !== requestIdRef.current) {
        return; // a newer request superseded this one
      }
      setResult(data);
    } catch (err) {
      // Expected when a newer request or an unmount aborts the in-flight fetch.
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      console.error('Top movers fetch failed:', err);
      if (requestId !== requestIdRef.current) {
        return;
      }
      setError(MOVERS_TEXTS.FETCH_FAILED);
      setResult(null);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [universe, periodId]);

  // Auto-load on mount and whenever the universe / period changes.
  useEffect(() => {
    void load();
  }, [load]);

  // Abort any in-flight fetch when the user leaves the page - the request
  // would otherwise keep hitting the network proxies pointlessly.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, []);

  useEffect(() => {
    document.title = `${MOVERS_TEXTS.TITLE} | Investment Portal`;
  }, []);

  const stocks = result?.stocks ?? [];
  const gainers = stocks
    .filter((stock) => (stock.changePct ?? 0) > 0)
    .sort((a, b) => (b.changePct ?? 0) - (a.changePct ?? 0))
    .slice(0, count);
  const losers = stocks
    .filter((stock) => (stock.changePct ?? 0) < 0)
    .sort((a, b) => (a.changePct ?? 0) - (b.changePct ?? 0))
    .slice(0, count);
  const visible = direction === 'gainers' ? gainers : losers;
  const progressPercent = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Breadcrumbs />

      <Link
        to="/investment/stock"
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs sm:text-sm font-medium inline-flex items-center gap-2 mb-3 px-3 py-2 rounded-md transition-colors"
      >
        ← Back to Stock Navigation
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800">{MOVERS_TEXTS.TITLE}</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{MOVERS_TEXTS.SUBTITLE}</p>
          {result && (
            <p className="text-xs text-gray-500 mt-2">
              <span className="text-green-600 font-medium">
                {MOVERS_TEXTS.UPDATED_AT}: {result.fetchedAt}
              </span>{' '}
              · {result.universeLabel} · {result.periodLabel} · {result.sourceNote}
            </p>
          )}
        </div>
        <button
          onClick={() => void load()}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
            isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
          }`}
        >
          {isLoading ? 'Loading…' : MOVERS_TEXTS.REFRESH}
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-5 flex flex-wrap items-end gap-4 mb-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {MOVERS_TEXTS.UNIVERSE_LABEL}
          </span>
          <select
            className={selectClass}
            value={universe}
            onChange={(e) => setUniverse(e.target.value as UniverseKey)}
            disabled={isLoading}
          >
            {UNIVERSE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {MOVERS_TEXTS.PERIOD_LABEL}
          </span>
          <select
            className={selectClass}
            value={periodId}
            onChange={(e) => setPeriodId(e.target.value)}
            disabled={isLoading}
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {MOVERS_TEXTS.COUNT_LABEL}
          </span>
          <select
            className={selectClass}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            disabled={isLoading}
          >
            {COUNT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        {/* Direction tabs */}
        <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm">
          <button
            onClick={() => setDirection('gainers')}
            className={`px-4 py-2 text-sm font-bold transition-colors ${
              direction === 'gainers' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ▲ {MOVERS_TEXTS.DIRECTION.GAINERS}
          </button>
          <button
            onClick={() => setDirection('losers')}
            className={`px-4 py-2 text-sm font-bold transition-colors ${
              direction === 'losers' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ▼ {MOVERS_TEXTS.DIRECTION.LOSERS}
          </button>
        </div>
      </div>

      {/* Progress bar while fetching */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-5 mb-4">
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
            <span className="font-medium flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {moversProgressText(
                progress.done,
                progress.total,
                result?.universeLabel ?? UNIVERSE_OPTIONS.find((o) => o.value === universe)?.label ?? '',
              )}
            </span>
            <span className="font-semibold text-gray-800">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="bg-white border border-red-200 border-l-4 border-l-red-600 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center gap-4 max-w-lg mx-auto">
          <span className="text-3xl">⚠️</span>
          <p className="text-sm text-red-700 leading-relaxed">{error}</p>
          <button
            onClick={() => void load()}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition"
          >
            🔄 Retry Request
          </button>
        </div>
      )}

      {/* Results table */}
      {!isLoading && !error && result && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              {direction === 'gainers' ? '▲ ' : '▼ '}
              {direction === 'gainers' ? MOVERS_TEXTS.DIRECTION.GAINERS : MOVERS_TEXTS.DIRECTION.LOSERS}
              <span className="text-sm font-semibold text-gray-500 ml-2">
                ({result.universeLabel} · {result.periodLabel} · top {visible.length})
              </span>
            </h2>
            {result.failed > 0 && (
              <span className="text-[11px] text-gray-500">
                {MOVERS_TEXTS.LOADED_PARTIAL.replace('{loaded}', String(result.loaded))
                  .replace('{total}', String(result.total))
                  .replace('{failed}', String(result.failed))}
              </span>
            )}
          </div>

          {visible.length === 0 ? (
            <div className="text-center py-10 text-sm text-gray-500">
              {direction === 'gainers' ? MOVERS_TEXTS.EMPTY_GAINERS : MOVERS_TEXTS.EMPTY_LOSERS}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500">
                    <th className="px-3 sm:px-4 py-2.5 font-semibold">{MOVERS_TEXTS.RANK}</th>
                    <th className="px-3 sm:px-4 py-2.5 font-semibold">{MOVERS_TEXTS.SYMBOL}</th>
                    <th className="px-3 sm:px-4 py-2.5 font-semibold">{MOVERS_TEXTS.COMPANY}</th>
                    <th className="px-3 sm:px-4 py-2.5 font-semibold text-right">{MOVERS_TEXTS.PRICE}</th>
                    <th className="px-3 sm:px-4 py-2.5 font-semibold text-right">{MOVERS_TEXTS.CHANGE}</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((stock, index) => (
                    <MoverRow key={stock.symbol} rank={index + 1} stock={stock} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-[11px] text-gray-400 text-center">{MOVERS_TEXTS.LOADED_NOTE}</p>
    </div>
  );
}
