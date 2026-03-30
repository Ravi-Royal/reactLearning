import { useState } from 'react';
import Breadcrumbs from '@pages/navigation/Breadcrumbs';
import { Link } from 'react-router-dom';

/** Given a drop of `drop`%, calculate the % gain needed to recover */
function recoveryGain(drop: number): number {
  if (drop >= 100) {
    return Infinity;
  }
  // After a drop of d%, value becomes (1 - d/100)
  // To get back to 1: gain = 1 / (1 - d/100) - 1
  return (1 / (1 - drop / 100) - 1) * 100;
}

function formulaText(drop: number): string {
  const val = recoveryGain(drop);
  if (!isFinite(val)) {
    return '∞';
  }
  return val.toFixed(4) + '%';
}

function severityLabel(drop: number): { label: string; rowClass: string; badgeClass: string } {
  if (drop >= 90) {
    return { label: 'Catastrophic', rowClass: 'bg-red-100', badgeClass: 'bg-red-600 text-white' };
  }
  if (drop >= 70) {
    return { label: 'Severe', rowClass: 'bg-orange-50', badgeClass: 'bg-orange-500 text-white' };
  }
  if (drop >= 50) {
    return { label: 'Major', rowClass: 'bg-yellow-50', badgeClass: 'bg-yellow-400 text-gray-900' };
  }
  if (drop >= 20) {
    return { label: 'Moderate', rowClass: 'bg-blue-50', badgeClass: 'bg-blue-400 text-white' };
  }
  return { label: 'Minor', rowClass: 'bg-green-50', badgeClass: 'bg-green-500 text-white' };
}

function PercentageRecovery() {
  const [customDrop, setCustomDrop] = useState('');
  const [customResult, setCustomResult] = useState<number | null>(null);
  const [customError, setCustomError] = useState('');

  const handleCalculate = () => {
    const val = parseFloat(customDrop);
    if (isNaN(val) || val < 0) {
      setCustomError('Please enter a valid positive number.');
      setCustomResult(null);
      return;
    }
    if (val >= 100) {
      setCustomError('A 100% or more drop means the value reaches zero — no recovery possible.');
      setCustomResult(null);
      return;
    }
    setCustomError('');
    setCustomResult(recoveryGain(val));
  };

  const rows = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 md:p-8">
      <Breadcrumbs />

      {/* Back link */}
      <Link
        to="/investment/stock"
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs sm:text-sm font-medium inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-md transition-colors"
      >
        ← Back to Stock Dashboard
      </Link>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1">📉 Stock Loss Recovery Table</h1>
      <p className="text-sm sm:text-base text-gray-500 mb-6">
        If a stock drops by X%, how much does it need to gain (from the new lower price) to get back to the original
        value?
      </p>

      {/* Insight banner */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-sm font-semibold text-blue-800 mb-1">💡 The Math Behind It</h2>
        <p className="text-xs text-blue-700">
          If a stock falls by <strong>d%</strong>, the new price is <strong>(1 − d/100)</strong> of the original. To
          reach the original price again, the gain needed is:
        </p>
        <code className="block mt-2 text-xs bg-white border border-blue-200 rounded px-3 py-2 text-blue-900 font-mono">
          Recovery % = [1 ÷ (1 − d/100) − 1] × 100
        </code>
        <p className="text-xs text-blue-600 mt-2">
          A <strong>50% drop</strong> needs a <strong>100% gain</strong>; a <strong>90% drop</strong> needs a massive{' '}
          <strong>900% gain</strong>!
        </p>
      </div>

      {/* Custom calculator for >100 or any value */}
      <div className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-purple-800 mb-3">🔢 Custom Drop Calculator</h2>
        <p className="text-xs text-purple-600 mb-4">
          Enter any drop percentage (including values above 100 for theoretical scenarios).
        </p>
        {/* Label above the row */}
        <label htmlFor="custom-drop-input" className="block text-sm font-medium text-purple-700 mb-1">
          Drop Percentage (%)
        </label>
        {/* Input + button on the same baseline row */}
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
              placeholder="e.g. 35.5"
              aria-describedby="custom-drop-desc"
            />
            <p id="custom-drop-desc" className="text-xs text-purple-500 mt-1">
              Values ≥ 100% are theoretically unrecoverable
            </p>
          </div>
          <button
            id="calculate-recovery-btn"
            onClick={handleCalculate}
            className="sm:self-start px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-md hover:from-purple-700 hover:to-pink-700 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 whitespace-nowrap"
            aria-label="Calculate recovery percentage for custom drop value"
          >
            Calculate Recovery
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
              <div className="text-gray-500 text-xs font-medium mb-1">Drop entered</div>
              <div className="text-2xl font-bold text-red-600">−{customDrop}%</div>
            </div>
            <div className="text-3xl text-gray-300 font-light hidden sm:block">→</div>
            <div className="text-center">
              <div className="text-gray-500 text-xs font-medium mb-1">Recovery gain needed</div>
              <div className="text-3xl font-bold text-green-600">+{customResult.toFixed(4)}%</div>
            </div>
            <div className="text-xs text-gray-400 sm:ml-4 max-w-xs text-center sm:text-left">
              A stock that drops <strong>{customDrop}%</strong> must gain <strong>{customResult.toFixed(2)}%</strong>{' '}
              from the new lower price to fully recover.
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="min-w-full text-sm" aria-label="Stock loss recovery percentage table from 1% to 100% drop">
          <thead>
            <tr className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
              <th scope="col" className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">
                #
              </th>
              <th scope="col" className="px-4 py-3 text-center font-semibold text-xs uppercase tracking-wide">
                Drop (%)
              </th>
              <th scope="col" className="px-4 py-3 text-center font-semibold text-xs uppercase tracking-wide">
                Recovery Gain Needed (%)
              </th>
              <th scope="col" className="px-4 py-3 text-center font-semibold text-xs uppercase tracking-wide">
                Severity
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center font-semibold text-xs uppercase tracking-wide hidden sm:table-cell"
              >
                Insight
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((drop) => {
              const gain = recoveryGain(drop);
              const { label, rowClass, badgeClass } = severityLabel(drop);
              const isInfinity = !isFinite(gain);

              return (
                <tr key={drop} className={`${rowClass} hover:brightness-95 transition-all`}>
                  <td className="px-4 py-2 text-gray-400 text-xs">{drop}</td>
                  <td className="px-4 py-2 text-center font-bold text-red-600">−{drop}%</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`font-bold text-base ${
                        isInfinity ? 'text-gray-400' : gain >= 100 ? 'text-red-700' : 'text-green-700'
                      }`}
                    >
                      {isInfinity ? '∞' : `+${formulaText(drop)}`}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
                      {label}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center text-xs text-gray-500 hidden sm:table-cell">
                    {isInfinity
                      ? 'Complete loss — unrecoverable'
                      : drop === 50
                        ? '50% drop = 100% gain needed!'
                        : drop >= 90
                          ? `Needs ${gain.toFixed(0)}× original investment`
                          : drop >= 75
                            ? `Needs ${gain.toFixed(0)}% gain to break even`
                            : `Needs ${gain.toFixed(2)}% gain to break even`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-500">
        <strong>Note:</strong> The recovery percentage is calculated from the <em>new lower price</em>, not the original
        price. This illustrates why avoiding large losses is critical — recovering from deep drawdowns requires
        disproportionately large gains.
      </div>
    </div>
  );
}

export default PercentageRecovery;
