import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Breadcrumbs from '@pages/navigation/Breadcrumbs';

import { getFullData } from './service';
import type { StockDetails } from './types';

// React Children Imports
import StockSearch from './components/StockSearch';
import HeroHeader from './components/HeroHeader';
import CompanyOverview from './components/CompanyOverview';
import DebtAnalysis from './components/DebtAnalysis';
import FinancialScore from './components/FinancialScore';
import FinancialPerformance from './components/FinancialPerformance';
import QuarterlyResults from './components/QuarterlyResults';
import BalanceSheetCashFlow from './components/BalanceSheetCashFlow';
import ShareholdingPattern from './components/ShareholdingPattern';
import DividendHistory from './components/DividendHistory';

type ErrorType = 'NOT_FOUND' | 'RATE_LIMIT' | 'API_ERROR';

export default function CurrentStockDetailsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const symbolParam = searchParams.get('symbol') || '';

  // Component States
  const [details, setDetails] = useState<StockDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);

  // Sync details loading on query change
  useEffect(() => {
    if (!symbolParam) {
      setDetails(null);
      setError(null);
      return;
    }
    loadData(symbolParam);
  }, [symbolParam]);

  // SEO Updates
  useEffect(() => {
    if (details) {
      document.title = `${details.profile.name} (${details.profile.symbol}) Stock Fundamentals, Key Statistics & Health Score`;
      const description = `Analyze ${details.profile.name} key statistics: P/E Ratio (${
        details.fundamentals.peRatio || 'N/A'
      }), Debt to Equity (${
        details.fundamentals.debtToEquity || 'N/A'
      }), ROE, dividend history and our custom computed financial health score.`;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    } else {
      document.title = 'Current Stock Details & Fundamental Analyzer | Investment Portal';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Analyze NSE/BSE stocks with free, real-time metrics. Review key statistics, leverage ratios, dividend trends, and financial health scores.',
        );
      }
    }
  }, [details]);

  const loadData = async (sym: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFullData(sym);
      setDetails(data);
    } catch (err: unknown) {
      console.error('Error fetching stock information:', err);
      setDetails(null);
      const errMsg = err instanceof Error ? err.message : '';
      if (errMsg === 'RATE_LIMIT') {
        setError('RATE_LIMIT');
      } else if (errMsg === 'NOT_FOUND') {
        setError('NOT_FOUND');
      } else {
        setError('API_ERROR');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockSelect = (selectedSymbol: string) => {
    setSearchParams({ symbol: selectedSymbol });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 md:p-8 flex flex-col gap-6">
      <Breadcrumbs />

      <Link
        to="/investment/stock"
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs sm:text-sm font-medium inline-flex items-center gap-2 mb-1 px-3 py-2 rounded-md self-start transition-colors"
      >
        ← Back to Stock Navigation
      </Link>

      <div className="text-center mb-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800">Current Stock Details</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Real-time fundamental analysis, leverage assessment, and dividend trend trackers
        </p>
      </div>

      {/* Autocomplete Lookups */}
      <StockSearch onStockSelected={handleStockSelect} />

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="flex flex-col gap-6 w-full mt-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-4 animate-pulse">
            <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
            <div className="flex flex-col gap-2 w-1/3">
              <div className="h-5 bg-gray-200 rounded w-4/5"></div>
              <div className="h-3 bg-gray-200 rounded w-3/5"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-20"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="bg-gray-100 rounded-xl h-48"></div>
            <div className="bg-gray-100 rounded-xl h-48"></div>
          </div>
        </div>
      )}

      {/* Error boundaries */}
      {!isLoading && error && (
        <div className="flex justify-center py-6 mt-4">
          <div className="bg-white border border-red-200 border-l-4 border-l-red-600 rounded-2xl p-6 shadow-sm max-w-lg w-full flex flex-col items-center text-center gap-4">
            <span className="text-3xl">⚠️</span>
            <div className="flex flex-col gap-1.5">
              {error === 'RATE_LIMIT' ? (
                <>
                  <h3 className="text-sm font-bold text-red-800">API Rate Limit Reached</h3>
                  <p className="text-xs text-red-700 leading-relaxed">
                    Yahoo Finance public API endpoints are rate-limited. Please wait a few seconds before trying again
                    to reload the stock statistics.
                  </p>
                </>
              ) : error === 'NOT_FOUND' ? (
                <>
                  <h3 className="text-sm font-bold text-red-800">Stock Symbol Not Found</h3>
                  <p className="text-xs text-red-700 leading-relaxed">
                    We could not find any equity matching the symbol <strong>"{symbolParam}"</strong>. Make sure you
                    entered a valid Indian NSE (e.g. TCS) or BSE (e.g. 532540) ticker.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-bold text-red-800">Unable to Fetch Data</h3>
                  <p className="text-xs text-red-700 leading-relaxed">
                    A network error occurred while accessing the public stock API. Please check your internet connection
                    or try again.
                  </p>
                </>
              )}
            </div>
            <button
              onClick={() => loadData(symbolParam)}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition"
            >
              🔄 Retry Request
            </button>
          </div>
        </div>
      )}

      {/* Welcome / Initial lookup state */}
      {!isLoading && !error && !details && (
        <div className="flex justify-center mt-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center max-w-2xl w-full shadow-sm flex flex-col items-center gap-4">
            <div className="text-4xl w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center">
              📈
            </div>
            <h2 className="text-base font-extrabold text-gray-900">Indian Stock Fundamental Analyzer</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Lookup Indian stocks listed on the National Stock Exchange (NSE) or Bombay Stock Exchange (BSE). Search by
              typing the ticker symbol or company name (e.g. TCS, RELIANCE, INFY) to inspect vital valuation multiples,
              leverage details, dividend history, and financial score cards.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left mt-2">
              <div className="flex gap-2.5 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <span className="text-lg bg-white border border-gray-200 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                  📊
                </span>
                <div>
                  <strong className="block text-[11px] font-bold text-gray-700">Overview Cards</strong>
                  <span className="text-[10px] text-gray-500">
                    View P/E, P/B, ROE, Market Cap, EPS and Book Values.
                  </span>
                </div>
              </div>
              <div className="flex gap-2.5 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <span className="text-lg bg-white border border-gray-200 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                  🛡️
                </span>
                <div>
                  <strong className="block text-[11px] font-bold text-gray-700">Leverage Analysis</strong>
                  <span className="text-[10px] text-gray-500">
                    Color-coded Debt/Equity checks and cash evaluations.
                  </span>
                </div>
              </div>
              <div className="flex gap-2.5 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <span className="text-lg bg-white border border-gray-200 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                  🎯
                </span>
                <div>
                  <strong className="block text-[11px] font-bold text-gray-700">Health Score</strong>
                  <span className="text-[10px] text-gray-500">
                    100-point algorithm rating solvency and profit growth.
                  </span>
                </div>
              </div>
              <div className="flex gap-2.5 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <span className="text-lg bg-white border border-gray-200 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                  🎁
                </span>
                <div>
                  <strong className="block text-[11px] font-bold text-gray-700">Dividend History</strong>
                  <span className="text-[10px] text-gray-500">
                    Review paginated records and historical dividend lines.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard details (data loaded state) */}
      {!isLoading && !error && details && (
        <div className="flex flex-col gap-6 w-full mt-4 animate-fadeIn">
          {/* Limited fundamentals fallback warning banner */}
          {details.fundamentals.peRatio === null && (
            <div className="bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 rounded-xl p-4 flex gap-3 shadow-sm">
              <span className="text-xl">⚠️</span>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-bold text-amber-900">Limited Fundamental Data (Free Tier Fallback)</h4>
                <p className="text-[10px] text-amber-800 leading-relaxed">
                  Yahoo Finance's detailed statistics endpoints currently require cookie/crumb authentication. The
                  application has successfully fallen back to the crumb-free live chart feed to display real-time
                  prices, 52-week statistics, and computed dividend metrics. Other balance sheet data is unavailable.
                </p>
              </div>
            </div>
          )}

          {/* Hero: name, live price, sparkline, quick stats */}
          <HeroHeader details={details} />

          {/* Profile & Key Statistics */}
          <CompanyOverview details={details} />

          {/* Semicircle score & Debt sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <FinancialScore financialScore={details.financialScore} />
            <DebtAnalysis fundamentals={details.fundamentals} />
          </div>

          {/* Annual & quarterly performance */}
          <FinancialPerformance annuals={details.annuals} />
          <QuarterlyResults quarters={details.quarters} />

          {/* Balance sheet & cash flow */}
          <BalanceSheetCashFlow balanceSheet={details.balanceSheet} cashFlow={details.cashFlow} />

          {/* Shareholding & Dividend details */}
          <ShareholdingPattern details={details} />
          <DividendHistory dividends={details.dividends} />
        </div>
      )}
    </div>
  );
}
