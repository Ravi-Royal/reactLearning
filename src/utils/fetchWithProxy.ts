import axios from 'axios';

/**
 * Fetch a URL with CORS workarounds.
 *
 * When running locally (Vite dev server) Yahoo Finance requests are rewritten
 * to the /yahooFinance1|2 dev proxies configured in vite.config.ts. In
 * production (GitHub Pages / Android WebView) the browser cannot reach those
 * hosts directly, so we rotate through public CORS proxies until one works.
 *
 * Used by the live-stock pages (current stock details, top losers & gainers).
 */
export async function fetchWithProxy<T = unknown>(url: string, signal?: AbortSignal): Promise<T> {
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocal) {
    let localUrl = url;
    if (url.startsWith('https://query1.finance.yahoo.com')) {
      localUrl = url.replace('https://query1.finance.yahoo.com', '/yahooFinance1');
    } else if (url.startsWith('https://query2.finance.yahoo.com')) {
      localUrl = url.replace('https://query2.finance.yahoo.com', '/yahooFinance2');
    }
    try {
      const res = await axios.get<T>(localUrl, { signal });
      if (res.data) {
        return res.data;
      }
    } catch (e) {
      console.warn('Local dev proxy failed or returned error, falling back to public CORS proxies', e);
    }
  }

  // List of public CORS proxies to try. corsproxy.io is the most reliable but
  // rate-limits aggressively, so each proxy gets one retry after a short pause
  // before moving on - and the list has several fallbacks for when one is down.
  const proxyBuilders = [
    (targetUrl: string) => `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`,
    (targetUrl: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    (targetUrl: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`,
    (targetUrl: string) => `https://thingproxy.freeboard.io/fetch/${targetUrl}`,
  ];

  const attempt = async (proxyUrl: string): Promise<T> => {
    const res = await axios.get<T>(proxyUrl, { timeout: 8000, signal });
    if (res.data) {
      return res.data;
    }
    throw new Error('empty response from proxy');
  };

  let lastError: Error | null = null;
  for (const buildProxyUrl of proxyBuilders) {
    const proxyUrl = buildProxyUrl(url);
    for (let retry = 0; retry < 2; retry++) {
      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }
      try {
        return await attempt(proxyUrl);
      } catch (err: unknown) {
        // Aborting must stop the retry loop immediately - otherwise a stale
        // request would keep hammering proxies after the caller gave up.
        if (signal?.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.warn(`CORS proxy failed: ${proxyUrl} (attempt ${retry + 1})`, errorMsg);
        lastError = err instanceof Error ? err : new Error(errorMsg);
      }
      // Brief pause before the retry so aggressive rate limits can reset.
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
  }

  throw lastError || new Error('All CORS proxies failed to fetch data');
}
