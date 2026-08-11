import type { MoverPeriod, UniverseKey } from '../types';

export const UNIVERSE_OPTIONS: { value: UniverseKey; label: string; count: number }[] = [
  { value: 'nifty50', label: 'NIFTY 50', count: 50 },
  { value: 'nifty100', label: 'NIFTY 100', count: 100 },
  { value: 'nifty500', label: 'NIFTY 500', count: 500 },
];

export const PERIOD_OPTIONS: MoverPeriod[] = [
  { id: '30m', label: 'Last 30 minutes', kind: 'intraday', minutes: 30 },
  { id: '1h', label: 'Last 1 hour', kind: 'intraday', minutes: 60 },
  { id: '4h', label: 'Last 4 hours', kind: 'intraday', minutes: 240 },
  { id: 'today', label: 'Today', kind: 'days', days: 1 },
  { id: '2d', label: 'Last 2 days', kind: 'days', days: 2 },
  { id: '5d', label: 'Last 5 days', kind: 'days', days: 5 },
  { id: '1w', label: 'Last 1 week', kind: 'days', days: 7 },
  { id: '1mo', label: 'Last 1 month', kind: 'days', days: 30 },
  { id: '3mo', label: 'Last 3 months', kind: 'days', days: 90 },
  { id: '1y', label: 'Last 1 year', kind: 'days', days: 365 },
];

export const COUNT_OPTIONS = [5, 10, 15, 25, 50] as const;

export const DEFAULT_PERIOD_ID = 'today';
export const DEFAULT_UNIVERSE: UniverseKey = 'nifty100';
export const DEFAULT_COUNT = 10;

export const MOVERS_TEXTS = {
  TITLE: 'Top Losers & Gainers',
  SUBTITLE: 'Live top falling and rising NIFTY stocks over any period - free public APIs, no login',
  DIRECTION: {
    GAINERS: 'Top Gainers',
    LOSERS: 'Top Losers',
  },
  UNIVERSE_LABEL: 'Universe',
  PERIOD_LABEL: 'Period',
  COUNT_LABEL: 'Show top',
  REFRESH: '⟳ Refresh',
  LOADING: 'Fetching live quotes…',
  LOADING_PROGRESS: 'Loading quotes for {universe} stocks ({done}/{total})',
  UPDATED_AT: 'Updated at',
  FETCH_FAILED: 'Could not load market data. The free API / CORS proxy may be down - try again in a moment.',
  UNIVERSE_FAILED:
    'Could not load the NIFTY index list. Try another universe or press Refresh - if this persists the free NSE feed is down.',
  EMPTY_GAINERS: 'No gainers right now - market may be closed or everything is falling.',
  EMPTY_LOSERS: 'No losers right now - market may be closed or everything is rising.',
  LOADED_NOTE: 'Live data from Yahoo Finance + NSE index lists (free public APIs). Refresh to update.',
  RANK: '#',
  SYMBOL: 'Symbol',
  COMPANY: 'Company',
  PRICE: 'Price (₹)',
  CHANGE: '% Change',
  OPEN_DETAILS: 'Open full details',
  LOADED_PARTIAL: '({loaded} of {total} stocks loaded - {failed} had no data)',
} as const;
