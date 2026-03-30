/**
 * Percentage Recovery Type Definitions
 */

export type Severity = 'Minor' | 'Moderate' | 'Major' | 'Severe' | 'Catastrophic';

/** Extends Severity to include the 'All' filter option */
export type SeverityOption = Severity | 'All';

export interface SeverityMeta {
  label: Severity;
  /** Numeric order used for sorting (1 = Minor … 5 = Catastrophic) */
  order: number;
  rowClass: string;
  badgeClass: string;
}

export type SortKey = 'drop' | 'recovery' | 'severity';

export type SortDir = 'asc' | 'desc';

export interface TableRow {
  drop: number;
  gain: number;
  severity: SeverityMeta;
}

export interface SortIconProps {
  active: boolean;
  dir: SortDir;
}

/** Options passed to the filter + sort helper */
export interface FilterSortOptions {
  minDrop: string;
  maxDrop: string;
  severityFilter: SeverityOption;
  sortKey: SortKey;
  sortDir: SortDir;
}
