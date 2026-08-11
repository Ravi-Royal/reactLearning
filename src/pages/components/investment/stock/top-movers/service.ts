import { fetchWithProxy } from '@utils';
import { MOVERS_TEXTS } from './constants/topMovers.constants';
import type { MoverPeriod, MoverStock, TopMoversResult, UniverseKey } from './types';

/**
 * Live top losers & gainers - mirrors the movement screens of the stock
 * Telegram bot, but 100% in the browser with free public APIs:
 *   1. Index constituents from the public NSE archives CSV (via CORS proxy).
 *   2. % move for all symbols from the Yahoo Finance spark endpoint, which
 *      returns up to 20 symbols per single request (5-min bars for intraday
 *      windows, daily bars for multi-day windows) - so NIFTY 50/100/500 need
 *      3/5/25 calls instead of one per stock.
 * Nothing is saved - every request hits the network and renders live.
 */

const NSE_INDEX_CSV: Record<UniverseKey, string> = {
  nifty50: 'https://archives.nseindia.com/content/indices/ind_nifty50list.csv',
  nifty100: 'https://archives.nseindia.com/content/indices/ind_nifty100list.csv',
  nifty500: 'https://archives.nseindia.com/content/indices/ind_nifty500list.csv',
};

const UNIVERSE_LABELS: Record<UniverseKey, string> = {
  nifty50: 'NIFTY 50',
  nifty100: 'NIFTY 100',
  nifty500: 'NIFTY 500',
};

/**
 * Built-in NIFTY 50 symbols - only used when the NSE index CSV is unreachable
 * so the page still works even if the free NSE feed is down. NIFTY 100/500
 * have no fallback (too large to maintain) and surface an error instead.
 */
const NIFTY50_FALLBACK_SYMBOLS: string[] = [
  'RELIANCE',
  'TCS',
  'HDFCBANK',
  'ICICIBANK',
  'INFY',
  'HINDUNILVR',
  'ITC',
  'SBIN',
  'BHARTIARTL',
  'KOTAKBANK',
  'LT',
  'AXISBANK',
  'BAJFINANCE',
  'MARUTI',
  'SUNPHARMA',
  'TITAN',
  'ULTRACEMCO',
  'WIPRO',
  'HCLTECH',
  'ASIANPAINT',
  'ADANIENT',
  'ADANIPORTS',
  'NTPC',
  'POWERGRID',
  'TATAMOTORS',
  'TATASTEEL',
  'JSWSTEEL',
  'ONGC',
  'COALINDIA',
  'M&M',
  'BAJAJFINSV',
  'NESTLEIND',
  'TECHM',
  'GRASIM',
  'HINDALCO',
  'LTIM',
  'TATACONSUM',
  'DRREDDY',
  'CIPLA',
  'APOLLOHOSP',
  'EICHERMOT',
  'BAJAJ-AUTO',
  'HEROMOTOCO',
  'SBILIFE',
  'HDFCLIFE',
  'INDUSINDBK',
  'BPCL',
  'DIVISLAB',
  'BRITANNIA',
  'SHRIRAMFIN',
];

interface YahooChartMeta {
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  previousClose?: number;
  longName?: string;
  shortName?: string;
}

interface YahooChartResponse {
  chart?: {
    result?: {
      meta?: YahooChartMeta;
      timestamp?: number[];
      indicators?: { quote?: { close?: (number | null)[] }[] };
    }[];
  };
}

/**
 * Yahoo Finance spark endpoint - returns up to 20 symbols per single request
 * (no cookie/crumb needed), each with its close bars and previous close:
 *
 *   { "TCS.NS": { symbol, timestamp[], close[], previousClose,
 *                 chartPreviousClose }, ... }
 *
 * For oversized batches Yahoo returns { spark: { result: [...], error } }
 * instead - both shapes are normalized below so the page stays resilient.
 */
interface SparkSymbolData {
  symbol: string;
  timestamp?: number[];
  close?: (number | null)[];
  previousClose?: number;
  chartPreviousClose?: number;
}

interface SparkWrapperItem {
  symbol?: string;
  response?: SparkSymbolData[];
}

type SparkPayload = Record<string, SparkSymbolData> | { spark?: { result?: SparkWrapperItem[]; error?: unknown } };

/** Normalize either spark response shape into symbol -> bars. */
function normalizeSpark(payload: SparkPayload | null | undefined): Map<string, SparkSymbolData> {
  const out = new Map<string, SparkSymbolData>();
  if (!payload || typeof payload !== 'object') {
    return out;
  }
  if ('spark' in payload && payload.spark) {
    for (const item of payload.spark.result ?? []) {
      const inner = item.response?.[0];
      if (item.symbol && inner) {
        out.set(item.symbol, { ...inner, symbol: item.symbol });
      }
    }
    return out;
  }
  for (const [symbol, data] of Object.entries(payload)) {
    if (data && typeof data === 'object' && 'close' in data) {
      out.set(symbol, { ...data, symbol });
    }
  }
  return out;
}

/** One spark request for up to SPARK_CHUNK_SIZE symbols. */
async function fetchSparkChunk(
  symbols: string[],
  range: string,
  interval: string,
  signal?: AbortSignal,
): Promise<Map<string, SparkSymbolData>> {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/spark?symbols=${encodeURIComponent(symbols.join(','))}` +
    `&range=${range}&interval=${interval}&indicators=close`;
  try {
    return normalizeSpark(await fetchWithProxy<SparkPayload>(url, signal));
  } catch {
    return new Map();
  }
}

/** Split one CSV line into fields, respecting double-quoted fields. */
function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

/**
 * Parse the NSE index constituents CSV.
 *
 * Column order differs between index files: ind_nifty50list.csv starts with
 * Symbol, while ind_nifty100list.csv / ind_nifty500list.csv start with
 * Company Name,Industry,Symbol,... - so the Symbol column is located from the
 * header row instead of assuming a fixed position.
 */
function parseUniverseCsv(text: string): { symbol: string; company: string }[] {
  const lines = (text || '')
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    return [];
  }
  const header = splitCsvLine(lines[0]).map((field) => field.trim().toLowerCase());
  const symbolIndex = header.indexOf('symbol');
  const companyIndex = header.indexOf('company name');
  const rows: { symbol: string; company: string }[] = [];
  for (const line of lines.slice(1)) {
    const fields = splitCsvLine(line);
    const rawSymbol = (symbolIndex >= 0 ? fields[symbolIndex] : fields[0]) ?? '';
    const symbol = rawSymbol.trim().toUpperCase();
    // Keep only equity rows (series EQ/BE) - skip non-equity rows like indices.
    if (!symbol || !/^[A-Z0-9&-]+$/.test(symbol)) {
      continue;
    }
    const company = (companyIndex >= 0 ? fields[companyIndex] : (fields[1] ?? '')).trim();
    rows.push({ symbol, company });
  }
  return rows;
}

type UniverseData = { symbols: string[]; names: Map<string, string>; sourceNote: string };

// In-flight dedupe: React StrictMode mounts the page twice, which would fire
// two identical universe fetches at the same instant - the free CORS proxies
// rate-limit concurrent duplicates, so concurrent callers share one request.
const universeInflight = new Map<string, Promise<UniverseData>>();

async function fetchUniverse(key: UniverseKey): Promise<UniverseData> {
  const csvUrl = NSE_INDEX_CSV[key];
  const inflight = universeInflight.get(key);
  if (inflight) {
    return inflight;
  }
  const promise = loadUniverse(key, csvUrl).finally(() => {
    universeInflight.delete(key);
  });
  universeInflight.set(key, promise);
  return promise;
}

async function loadUniverse(key: UniverseKey, csvUrl: string): Promise<UniverseData> {
  if (key === 'nifty50') {
    // Fast path: try the CSV, fall back to the built-in list if the feed is down.
    try {
      const text = await fetchWithProxy<string>(csvUrl);
      const rows = parseUniverseCsv(text);
      if (rows.length > 0) {
        return {
          symbols: rows.map((row) => row.symbol),
          names: new Map(rows.map((row) => [row.symbol, row.company])),
          sourceNote: UNIVERSE_LABELS[key],
        };
      }
    } catch {
      // fall through to the built-in list
    }
    return {
      symbols: [...NIFTY50_FALLBACK_SYMBOLS],
      names: new Map(),
      sourceNote: `${UNIVERSE_LABELS[key]} (built-in fallback - NSE feed down)`,
    };
  }
  try {
    const text = await fetchWithProxy<string>(csvUrl);
    const rows = parseUniverseCsv(text);
    if (rows.length === 0) {
      throw new Error('empty universe CSV');
    }
    return {
      symbols: rows.map((row) => row.symbol),
      names: new Map(rows.map((row) => [row.symbol, row.company])),
      sourceNote: UNIVERSE_LABELS[key],
    };
  } catch {
    throw new Error(`universe_unreachable:${key}`);
  }
}

async function fetchChart(symbol: string, url: string, signal?: AbortSignal): Promise<YahooChartResponse | null> {
  try {
    return await fetchWithProxy<YahooChartResponse>(url, signal);
  } catch {
    return null; // per-symbol failures are skipped, like the bot's best-effort fetches
  }
}

/** True for null or undefined (Yahoo JSON may contain either). */
function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/** First non-null close at-or-after the cutoff, else the first non-null close. */
function basePriceAtOrAfter(timestamps: number[], closes: (number | null)[], cutoff: number): number | null {
  for (let i = 0; i < timestamps.length; i++) {
    const close = closes[i];
    if (isNil(close)) {
      continue;
    }
    if (timestamps[i] >= cutoff) {
      return close;
    }
  }
  return closes.find((close) => !isNil(close)) ?? null;
}

function toMover(symbol: string, meta: YahooChartMeta | undefined, price: number, changePct: number): MoverStock {
  return {
    symbol,
    name: meta?.longName ?? meta?.shortName ?? '',
    price,
    changePct,
  };
}

/** Pick the spark range/interval for a period (mirrors the per-chart ranges). */
function sparkRange(period: MoverPeriod): { range: string; interval: string } {
  if (period.kind === 'intraday') {
    return { range: '1d', interval: '5m' };
  }
  const days = Math.max(1, period.days ?? 1);
  const range =
    days <= 1 ? '1d' : days <= 5 ? '5d' : days <= 30 ? '1mo' : days <= 90 ? '3mo' : days <= 180 ? '6mo' : '1y';
  return { range, interval: '1d' };
}

/** % move for one symbol from its spark bars (same logic as the chart path). */
function changeFromSpark(data: SparkSymbolData, period: MoverPeriod): MoverStock | null {
  const closes = data.close ?? [];
  const timestamps = data.timestamp ?? [];
  const valid = closes.filter((close): close is number => !isNil(close));
  const price = valid.at(-1) ?? null;
  if (isNil(price)) {
    return null;
  }
  let base: number | null;
  if (period.kind === 'intraday') {
    const cutoff = Date.now() / 1000 - (period.minutes ?? 60) * 60;
    base = basePriceAtOrAfter(timestamps, closes, cutoff);
  } else if ((period.days ?? 1) <= 1) {
    base = data.chartPreviousClose ?? data.previousClose ?? valid[0] ?? null;
  } else {
    const cutoff = Date.now() / 1000 - (period.days ?? 1) * 86400;
    base = basePriceAtOrAfter(timestamps, closes, cutoff);
  }
  if (isNil(base) || base <= 0) {
    return null;
  }
  return toMover(data.symbol, undefined, price, (price / base - 1) * 100);
}

/** % move over an intraday window using Yahoo 5-minute bars (range=1d). */
async function fetchIntradayChange(
  symbol: string,
  period: MoverPeriod,
  signal?: AbortSignal,
): Promise<MoverStock | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?range=1d&interval=5m`;
  const payload = await fetchChart(symbol, url, signal);
  const result = payload?.chart?.result?.[0];
  const meta = result?.meta;
  const price = meta?.regularMarketPrice;
  if (isNil(result) || isNil(price)) {
    return null;
  }
  const timestamps = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];
  const cutoff = Date.now() / 1000 - (period.minutes ?? 60) * 60;
  const base = basePriceAtOrAfter(timestamps, closes, cutoff);
  if (isNil(base)) {
    return null;
  }
  return toMover(symbol, meta, price, (price / base - 1) * 100);
}

/** % move over a multi-day window using Yahoo daily bars. */
async function fetchDailyChange(symbol: string, period: MoverPeriod, signal?: AbortSignal): Promise<MoverStock | null> {
  const days = Math.max(1, period.days ?? 1);
  const range =
    days <= 1 ? '1d' : days <= 5 ? '5d' : days <= 30 ? '1mo' : days <= 90 ? '3mo' : days <= 180 ? '6mo' : '1y';
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?range=${range}&interval=1d`;
  const payload = await fetchChart(symbol, url, signal);
  const result = payload?.chart?.result?.[0];
  const meta = result?.meta;
  if (isNil(result)) {
    return null;
  }
  const timestamps = result.timestamp ?? [];
  const closes = result.indicators?.quote?.[0]?.close ?? [];
  // When the market is closed the last close is the price to display.
  const price = meta?.regularMarketPrice ?? closes.filter((close): close is number => !isNil(close)).at(-1) ?? null;
  if (isNil(price)) {
    return null;
  }
  let base: number | null;
  if (days <= 1) {
    base = meta?.chartPreviousClose ?? meta?.previousClose ?? closes.find((close) => !isNil(close)) ?? null;
  } else {
    const cutoff = Date.now() / 1000 - days * 86400;
    base = basePriceAtOrAfter(timestamps, closes, cutoff);
  }
  if (isNil(base)) {
    return null;
  }
  return toMover(symbol, meta, price, (price / base - 1) * 100);
}

export async function fetchStockChange(
  symbol: string,
  period: MoverPeriod,
  signal?: AbortSignal,
): Promise<MoverStock | null> {
  if (period.kind === 'intraday') {
    return fetchIntradayChange(symbol, period, signal);
  }
  return fetchDailyChange(symbol, period, signal);
}

const SPARK_CHUNK_SIZE = 20;
const SPARK_RETRY_ROUNDS = 2;

/**
 * Fetch % moves for every symbol in the universe and report progress.
 *
 * Primary path: the Yahoo spark endpoint returns 20 symbols per request, so
 * NIFTY 50/100/500 need only 3/5/25 calls instead of one per stock. Symbols
 * spark drops per-request are retried in a second pass; if spark fails
 * entirely the page falls back to the classic per-symbol chart calls.
 *
 * Pass an AbortSignal (e.g. from an unmounting component) to stop all
 * in-flight requests immediately instead of letting them run to completion.
 */
export async function fetchTopMovers(
  universe: UniverseKey,
  period: MoverPeriod,
  onProgress: (done: number, total: number) => void,
  signal?: AbortSignal,
): Promise<TopMoversResult> {
  const { symbols, names, sourceNote } = await fetchUniverse(universe);

  const { range, interval } = sparkRange(period);
  const fetched = new Map<string, MoverStock>();
  const seen = new Set<string>();

  for (let round = 0; round < SPARK_RETRY_ROUNDS; round++) {
    const pending = symbols.filter((symbol) => !seen.has(symbol));
    if (pending.length === 0) {
      break;
    }
    for (let start = 0; start < pending.length; start += SPARK_CHUNK_SIZE) {
      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }
      const chunk = pending.slice(start, start + SPARK_CHUNK_SIZE);
      const data = await fetchSparkChunk(
        chunk.map((symbol) => `${symbol}.NS`),
        range,
        interval,
        signal,
      );
      for (const symbol of chunk) {
        const entry = data.get(`${symbol}.NS`);
        if (!entry) {
          continue; // left unseen -> retried next round
        }
        seen.add(symbol);
        const mover = changeFromSpark(entry, period);
        if (mover) {
          fetched.set(symbol, { ...mover, symbol });
        }
      }
      onProgress(Math.min(seen.size, symbols.length), symbols.length);
    }
  }

  // Fallback: spark returned nothing (endpoint down/rate-limited) - fetch each
  // symbol via the classic chart endpoint like before.
  if (fetched.size === 0 && symbols.length > 0) {
    const CONCURRENCY = 8;
    for (let start = 0; start < symbols.length; start += CONCURRENCY) {
      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }
      const chunk = symbols.slice(start, start + CONCURRENCY);
      const chunkResults = await Promise.all(chunk.map((symbol) => fetchStockChange(symbol, period, signal)));
      chunkResults.forEach((result, offset) => {
        if (result) {
          fetched.set(chunk[offset], { ...result, symbol: chunk[offset] });
        }
      });
      onProgress(Math.min(start + chunk.length, symbols.length), symbols.length);
    }
  }

  const stocks: MoverStock[] = symbols
    .map((symbol) => fetched.get(symbol))
    .filter((stock): stock is MoverStock => Boolean(stock));
  // Attach company names from the index CSV (when available).
  stocks.forEach((stock) => {
    if (!stock.name) {
      stock.name = names.get(stock.symbol) ?? '';
    }
  });

  return {
    stocks,
    total: symbols.length,
    loaded: stocks.length,
    failed: symbols.length - stocks.length,
    fetchedAt: new Date().toLocaleTimeString('en-IN', { hour12: true }),
    universeLabel: UNIVERSE_LABELS[universe],
    periodLabel: period.label,
    sourceNote,
  };
}

export function formatPrice(price: number | null): string {
  if (isNil(price)) {
    return '—';
  }
  return `₹ ${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatChange(changePct: number | null): string {
  if (isNil(changePct)) {
    return '—';
  }
  const sign = changePct >= 0 ? '+' : '';
  return `${sign}${changePct.toFixed(2)}%`;
}

export function moversProgressText(done: number, total: number, universeLabel: string): string {
  return MOVERS_TEXTS.LOADING_PROGRESS.replace('{universe}', universeLabel)
    .replace('{done}', String(done))
    .replace('{total}', String(total));
}
