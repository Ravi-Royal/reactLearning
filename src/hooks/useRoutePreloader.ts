import { useEffect } from 'react';

/**
 * All lazy route chunks to preload.
 * Each entry is the same dynamic import() function used in Routing.tsx.
 * Keeping them in sync manually is intentional — we preload exactly what exists.
 */
const ROUTE_IMPORTERS: Array<() => Promise<unknown>> = [
  // Top-level pages
  () => import('@pages/Home'),
  () => import('@pages/About'),

  // Navigation hubs
  () => import('@pages/navigation/HooksNavigation'),
  () => import('@pages/navigation/InvestmentNavigation'),
  () => import('@pages/navigation/StockNavigation'),
  () => import('@pages/navigation/MutualFundNavigation'),
  () => import('@pages/navigation/CommoditiesNavigation'),
  () => import('@pages/navigation/CalculatorNavigation'),

  // Hooks reference
  () => import('@pages/components/hookRef/UseStateHook'),
  () => import('@pages/components/hookRef/UseEffectHook'),
  () => import('@pages/components/hookRef/UseRefHook'),
  () => import('@pages/components/hookRef/UseReducerHook'),
  () => import('@pages/components/hookRef/UseContextHook'),
  () => import('@pages/components/hookRef/UseCallbackHook'),

  // Investment: Bonds
  () => import('@pages/components/investment/bonds/Bonds'),
  () => import('@pages/components/investment/bonds/before-starting/BeforeStartingBondCheckList'),
  () => import('@pages/components/investment/bonds/checklist/BondCheckList'),

  // Investment: Stock
  () => import('@pages/components/investment/stock/analysis/Analysis'),
  () => import('@pages/components/investment/stock/analysis/zerodha/StockResult'),
  () => import('@pages/components/investment/stock/checklist/StockCheckList'),
  () => import('@pages/components/investment/stock/favorites/MyFavStocks'),
  () => import('@pages/components/investment/stock/average-calculator/AverageCalculator'),
  () => import('@pages/components/investment/stock/profit-calculator/StockProfitCalculator'),
  () => import('@pages/components/investment/stock/percentage-recovery/PercentageRecovery'),

  // Investment: Mutual Fund
  () => import('@pages/components/investment/mutual-fund/calculator/MutualFundCalculator'),
  () => import('@pages/components/investment/mutual-fund/checklist/MutualFundChecklist'),

  // Investment: Commodities
  () => import('@pages/components/investment/commodities/gold-silver-ratio/GoldVsSilverRatio'),
];

/**
 * Preloads all lazy route chunks during browser idle time so that navigation
 * is instant after the initial page load.
 *
 * Strategy:
 * - Waits 2 seconds after mount to avoid competing with the initial render.
 * - Then schedules each chunk via requestIdleCallback (or a 150ms timeout fallback)
 *   so they download one-by-one without blocking the UI thread.
 */
export function useRoutePreloader(): void {
  useEffect(() => {
    const idle =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback
        : (cb: IdleRequestCallback) => setTimeout(cb, 150);

    let importIndex = 0;

    const preloadNext = () => {
      if (importIndex >= ROUTE_IMPORTERS.length) {
        return;
      }
      const importer = ROUTE_IMPORTERS[importIndex++];
      if (importer) {
        // Fire and forget — the browser caches the module so React.lazy gets it for free later
        importer().catch(() => {
          /* silently ignore preload failures — the real load will retry on navigation */
        });
      }
      // Schedule the next one during idle time
      idle(preloadNext);
    };

    // Delay the first preload to avoid competing with initial render & hydration
    const startTimer = setTimeout(() => {
      idle(preloadNext);
    }, 2000);

    return () => {
      clearTimeout(startTimer);
    };
  }, []); // Run only once after initial mount
}
