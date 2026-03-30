/**
 * Percentage Recovery Helper Functions
 * Pure calculation and derivation logic — no React, no UI.
 */

import type { SeverityMeta, TableRow, FilterSortOptions } from '../types/PercentageRecovery.types';

// ─── Core calculation ─────────────────────────────────────────────────────────

/**
 * Given a drop of `drop`%, returns the % gain needed from the new lower price
 * to recover back to the original value.
 * Returns Infinity for drop >= 100 (complete loss).
 */
export function recoveryGain(drop: number): number {
  if (drop >= 100) {
    return Infinity;
  }
  return (1 / (1 - drop / 100) - 1) * 100;
}

// ─── Severity ─────────────────────────────────────────────────────────────────

export function getSeverity(drop: number): SeverityMeta {
  if (drop >= 90) {
    return { label: 'Catastrophic', order: 5, rowClass: 'bg-red-100', badgeClass: 'bg-red-600 text-white' };
  }
  if (drop >= 70) {
    return { label: 'Severe', order: 4, rowClass: 'bg-orange-50', badgeClass: 'bg-orange-500 text-white' };
  }
  if (drop >= 50) {
    return { label: 'Major', order: 3, rowClass: 'bg-yellow-50', badgeClass: 'bg-yellow-400 text-gray-900' };
  }
  if (drop >= 20) {
    return { label: 'Moderate', order: 2, rowClass: 'bg-blue-50', badgeClass: 'bg-blue-400 text-white' };
  }
  return { label: 'Minor', order: 1, rowClass: 'bg-green-50', badgeClass: 'bg-green-500 text-white' };
}

// ─── Insight text ─────────────────────────────────────────────────────────────

export function insightText(drop: number, gain: number): string {
  if (!isFinite(gain)) {
    return 'Complete loss — unrecoverable';
  }
  if (drop === 50) {
    return '50% drop = 100% gain needed!';
  }
  if (drop >= 90) {
    return `Needs ${gain.toFixed(0)}× original investment`;
  }
  if (drop >= 75) {
    return `Needs ${gain.toFixed(0)}% gain to break even`;
  }
  return `Needs ${gain.toFixed(2)}% gain to break even`;
}

// ─── Table data builder ───────────────────────────────────────────────────────

/** Builds all 100 base rows (drop 1% → 100%) */
export function buildAllRows(): TableRow[] {
  return Array.from({ length: 100 }, (_, i) => {
    const drop = i + 1;
    const gain = recoveryGain(drop);
    const severity = getSeverity(drop);
    return { drop, gain, severity };
  });
}

// ─── Filter + Sort ────────────────────────────────────────────────────────────

export function applyFilterAndSort(rows: TableRow[], options: FilterSortOptions): TableRow[] {
  const min = Math.max(1, parseInt(options.minDrop) || 1);
  const max = Math.min(100, parseInt(options.maxDrop) || 100);

  const filtered = rows.filter(({ drop, severity }) => {
    const inRange = drop >= min && drop <= max;
    const inSeverity = options.severityFilter === 'All' || severity.label === options.severityFilter;
    return inRange && inSeverity;
  });

  return filtered.sort((a, b) => {
    let cmp = 0;
    if (options.sortKey === 'drop') {
      cmp = a.drop - b.drop;
    } else if (options.sortKey === 'recovery') {
      const ga = isFinite(a.gain) ? a.gain : 1e9;
      const gb = isFinite(b.gain) ? b.gain : 1e9;
      cmp = ga - gb;
    } else if (options.sortKey === 'severity') {
      cmp = a.severity.order - b.severity.order;
    }
    return options.sortDir === 'asc' ? cmp : -cmp;
  });
}
