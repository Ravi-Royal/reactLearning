export type UniverseKey = 'nifty50' | 'nifty100' | 'nifty500';

export interface MoverPeriod {
  id: string;
  label: string;
  /** 'intraday' = Yahoo 5-minute bars over the trailing window; 'days' = daily bars. */
  kind: 'intraday' | 'days';
  /** Minutes for intraday periods (e.g. 60 = last 1 hour). */
  minutes?: number;
  /** Calendar days for daily periods (e.g. 7 = last week). */
  days?: number;
}

export interface MoverStock {
  symbol: string;
  name: string;
  price: number | null;
  /** % move over the selected period (null when the feed had no data). */
  changePct: number | null;
}

export interface TopMoversResult {
  stocks: MoverStock[];
  total: number;
  loaded: number;
  failed: number;
  fetchedAt: string;
  universeLabel: string;
  periodLabel: string;
  /** e.g. 'NIFTY 50 (built-in fallback)' when the NSE index list was unreachable. */
  sourceNote: string;
}
