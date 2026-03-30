import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@pages/navigation/Breadcrumbs';

import {
  PERCENTAGE_RECOVERY_TEXTS as TEXTS,
  PERCENTAGE_RECOVERY_DEFAULTS as DEFAULTS,
  ALL_SEVERITIES,
  SEVERITY_BTN_STYLE,
} from './constants/percentageRecovery.constants';
import type { Severity, SortKey, SortDir } from './types/PercentageRecovery.types';
import { recoveryGain, insightText, buildAllRows, applyFilterAndSort } from './helpers/percentageRecovery.helper';
import SortIcon from './components/SortIcon';

// ─── Pre-built base rows (never changes) ──────────────────────────────────────

const BASE_ROWS = buildAllRows();

// ─── Component ────────────────────────────────────────────────────────────────

function PercentageRecovery() {
  // ── Custom calculator state ──────────────────────────────────────────────
  const [customDrop, setCustomDrop] = useState('');
  const [customResult, setCustomResult] = useState<number | null>(null);
  const [customError, setCustomError] = useState('');

  // ── Filter state ─────────────────────────────────────────────────────────
  const [minDrop, setMinDrop] = useState<string>(DEFAULTS.MIN_DROP);
  const [maxDrop, setMaxDrop] = useState<string>(DEFAULTS.MAX_DROP);
  const [severityFilter, setSeverityFilter] = useState<Severity | 'All'>(DEFAULTS.SEVERITY);

  // ── Sort state ───────────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState<SortKey>(DEFAULTS.SORT_KEY);
  const [sortDir, setSortDir] = useState<SortDir>(DEFAULTS.SORT_DIR);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleCalculate = () => {
    const val = parseFloat(customDrop);
    if (isNaN(val) || val < 0) {
      setCustomError(TEXTS.ERRORS.INVALID_INPUT);
      setCustomResult(null);
      return;
    }
    if (val >= 100) {
      setCustomError(TEXTS.ERRORS.UNRECOVERABLE);
      setCustomResult(null);
      return;
    }
    setCustomError('');
    setCustomResult(recoveryGain(val));
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const resetFilters = () => {
    setMinDrop(DEFAULTS.MIN_DROP);
    setMaxDrop(DEFAULTS.MAX_DROP);
    setSeverityFilter(DEFAULTS.SEVERITY);
    setSortKey(DEFAULTS.SORT_KEY);
    setSortDir(DEFAULTS.SORT_DIR);
  };

  // ── Derived data ─────────────────────────────────────────────────────────

  const tableRows = useMemo(
    () => applyFilterAndSort(BASE_ROWS, { minDrop, maxDrop, severityFilter, sortKey, sortDir }),
    [minDrop, maxDrop, severityFilter, sortKey, sortDir],
  );

  const filtersActive =
    minDrop !== DEFAULTS.MIN_DROP ||
    maxDrop !== DEFAULTS.MAX_DROP ||
    severityFilter !== DEFAULTS.SEVERITY ||
    sortKey !== DEFAULTS.SORT_KEY ||
    sortDir !== DEFAULTS.SORT_DIR;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 md:p-8">
      <Breadcrumbs />

      <Link
        to="/investment/stock"
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs sm:text-sm font-medium inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-md transition-colors"
      >
        {TEXTS.LABELS.BACK_LINK}
      </Link>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1">{TEXTS.LABELS.PAGE_TITLE}</h1>
      <p className="text-sm sm:text-base text-gray-500 mb-6">{TEXTS.MESSAGES.PAGE_SUBTITLE}</p>

      {/* ── Math insight banner ──────────────────────────────────────── */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-sm font-semibold text-blue-800 mb-1">{TEXTS.LABELS.MATH_TITLE}</h2>
        <p className="text-xs text-blue-700">{TEXTS.MESSAGES.MATH_DESCRIPTION}</p>
        <code className="block mt-2 text-xs bg-white border border-blue-200 rounded px-3 py-2 text-blue-900 font-mono">
          {TEXTS.MESSAGES.MATH_FORMULA}
        </code>
        <p className="text-xs text-blue-600 mt-2">{TEXTS.MESSAGES.MATH_EXAMPLE}</p>
      </div>

      {/* ── Custom calculator ────────────────────────────────────────── */}
      <div className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-purple-800 mb-3">{TEXTS.LABELS.CALCULATOR_TITLE}</h2>
        <p className="text-xs text-purple-600 mb-4">{TEXTS.MESSAGES.PAGE_SUBTITLE}</p>

        <label htmlFor="custom-drop-input" className="block text-sm font-medium text-purple-700 mb-1">
          {TEXTS.LABELS.DROP_INPUT}
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              id="custom-drop-input"
              type="number"
              min="0"
              step="0.01"
              value={customDrop}
              onChange={(e) => {
                setCustomDrop(e.target.value);
                setCustomResult(null);
                setCustomError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
              className="w-full px-3 py-2.5 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-800"
              placeholder={TEXTS.PLACEHOLDERS.DROP_INPUT}
              aria-describedby="custom-drop-desc"
            />
            <p id="custom-drop-desc" className="text-xs text-purple-500 mt-1">
              {TEXTS.MESSAGES.INPUT_HINT}
            </p>
          </div>
          <button
            id="calculate-recovery-btn"
            onClick={handleCalculate}
            className="sm:self-start px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-md hover:from-purple-700 hover:to-pink-700 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 whitespace-nowrap"
            aria-label={TEXTS.ARIA.CALCULATE_BTN}
          >
            {TEXTS.BUTTONS.CALCULATE}
          </button>
        </div>

        {customError && (
          <div role="alert" className="mt-4 bg-red-50 border border-red-300 text-red-700 rounded-md px-4 py-3 text-sm">
            ⚠️ {customError}
          </div>
        )}

        {customResult !== null && !customError && (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 bg-white border-2 border-purple-300 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4"
          >
            <div className="text-center">
              <div className="text-gray-500 text-xs font-medium mb-1">{TEXTS.LABELS.RESULT_DROP}</div>
              <div className="text-2xl font-bold text-red-600">−{customDrop}%</div>
            </div>
            <div className="text-3xl text-gray-300 font-light hidden sm:block">→</div>
            <div className="text-center">
              <div className="text-gray-500 text-xs font-medium mb-1">{TEXTS.LABELS.RESULT_GAIN}</div>
              <div className="text-3xl font-bold text-green-600">+{customResult.toFixed(4)}%</div>
            </div>
            <div className="text-xs text-gray-400 sm:ml-4 max-w-xs text-center sm:text-left">
              A stock that drops <strong>{customDrop}%</strong> must gain <strong>{customResult.toFixed(2)}%</strong>{' '}
              from the new lower price to fully recover.
            </div>
          </div>
        )}
      </div>

      {/* ── Filter & Sort panel ──────────────────────────────────────── */}
      <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
            {TEXTS.LABELS.FILTER_TITLE}
          </h3>
          {filtersActive && (
            <button
              onClick={resetFilters}
              className="text-xs text-red-600 hover:text-red-800 font-medium border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition-colors"
              aria-label={TEXTS.ARIA.RESET_BTN}
            >
              {TEXTS.BUTTONS.RESET}
            </button>
          )}
        </div>

        {/* Drop range inputs */}
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="filter-min-drop" className="block text-xs font-medium text-gray-600 mb-1">
              {TEXTS.LABELS.MIN_DROP}
            </label>
            <input
              id="filter-min-drop"
              type="number"
              min="1"
              max="100"
              value={minDrop}
              onChange={(e) => setMinDrop(e.target.value)}
              className="w-24 px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              aria-label={TEXTS.ARIA.MIN_DROP}
            />
          </div>
          <div className="text-gray-400 pb-1 font-medium text-sm">→</div>
          <div>
            <label htmlFor="filter-max-drop" className="block text-xs font-medium text-gray-600 mb-1">
              {TEXTS.LABELS.MAX_DROP}
            </label>
            <input
              id="filter-max-drop"
              type="number"
              min="1"
              max="100"
              value={maxDrop}
              onChange={(e) => setMaxDrop(e.target.value)}
              className="w-24 px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              aria-label={TEXTS.ARIA.MAX_DROP}
            />
          </div>
          <div className="text-xs text-gray-400 pb-1">Showing {tableRows.length} of 100 rows</div>
        </div>

        {/* Severity filter buttons */}
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">{TEXTS.LABELS.SEVERITY_FILTER}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={TEXTS.ARIA.SEVERITY_GROUP}>
            {(['All', ...ALL_SEVERITIES] as const).map((sev) => {
              const styles = SEVERITY_BTN_STYLE[sev];
              const isActive = severityFilter === sev;
              return (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${isActive ? styles.active : styles.inactive}`}
                  aria-pressed={isActive}
                  aria-label={`Filter by ${sev} severity`}
                >
                  {sev}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        {tableRows.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-sm font-medium">{TEXTS.MESSAGES.EMPTY_STATE}</div>
            <button onClick={resetFilters} className="mt-3 text-xs text-blue-600 hover:underline">
              {TEXTS.BUTTONS.EMPTY_RESET}
            </button>
          </div>
        ) : (
          <table className="min-w-full text-sm" aria-label={TEXTS.ARIA.TABLE}>
            <thead>
              <tr className="bg-gradient-to-r from-gray-700 to-gray-800 text-white select-none">
                <th scope="col" className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide w-10">
                  {TEXTS.LABELS.COL_INDEX}
                </th>

                <th
                  scope="col"
                  onClick={() => handleSort('drop')}
                  className="px-4 py-3 text-center font-semibold text-xs uppercase tracking-wide cursor-pointer hover:bg-white/10 transition-colors"
                  aria-sort={sortKey === 'drop' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  aria-label={TEXTS.ARIA.SORT_DROP}
                >
                  <span className="inline-flex items-center justify-center gap-0.5">
                    {TEXTS.LABELS.COL_DROP}
                    <SortIcon active={sortKey === 'drop'} dir={sortDir} />
                  </span>
                </th>

                <th
                  scope="col"
                  onClick={() => handleSort('recovery')}
                  className="px-4 py-3 text-center font-semibold text-xs uppercase tracking-wide cursor-pointer hover:bg-white/10 transition-colors"
                  aria-sort={sortKey === 'recovery' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  aria-label={TEXTS.ARIA.SORT_RECOVERY}
                >
                  <span className="inline-flex items-center justify-center gap-0.5">
                    {TEXTS.LABELS.COL_RECOVERY}
                    <SortIcon active={sortKey === 'recovery'} dir={sortDir} />
                  </span>
                </th>

                <th
                  scope="col"
                  onClick={() => handleSort('severity')}
                  className="px-4 py-3 text-center font-semibold text-xs uppercase tracking-wide cursor-pointer hover:bg-white/10 transition-colors"
                  aria-sort={sortKey === 'severity' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  aria-label={TEXTS.ARIA.SORT_SEVERITY}
                >
                  <span className="inline-flex items-center justify-center gap-0.5">
                    {TEXTS.LABELS.COL_SEVERITY}
                    <SortIcon active={sortKey === 'severity'} dir={sortDir} />
                  </span>
                </th>

                <th
                  scope="col"
                  className="px-4 py-3 text-center font-semibold text-xs uppercase tracking-wide hidden sm:table-cell"
                >
                  {TEXTS.LABELS.COL_INSIGHT}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableRows.map(({ drop, gain, severity }, idx) => {
                const isInfinity = !isFinite(gain);
                return (
                  <tr key={drop} className={`${severity.rowClass} hover:brightness-95 transition-all`}>
                    <td className="px-4 py-2 text-gray-400 text-xs">{idx + 1}</td>
                    <td className="px-4 py-2 text-center font-bold text-red-600">−{drop}%</td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`font-bold text-base ${
                          isInfinity ? 'text-gray-400' : gain >= 100 ? 'text-red-700' : 'text-green-700'
                        }`}
                      >
                        {isInfinity ? '∞' : `+${gain.toFixed(4)}%`}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${severity.badgeClass}`}
                      >
                        {severity.label}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center text-xs text-gray-500 hidden sm:table-cell">
                      {insightText(drop, gain)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Row count summary */}
      <p className="mt-2 text-xs text-gray-400 text-right">
        Showing <strong>{tableRows.length}</strong> of <strong>100</strong> rows
        {filtersActive && ' (filtered)'}
      </p>

      {/* Footer note */}
      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-500">
        <strong>Note:</strong> {TEXTS.MESSAGES.FOOTER_NOTE}
      </div>
    </div>
  );
}

export default PercentageRecovery;
