import type { StockDetails } from '../types';

interface CompanyOverviewProps {
  details: StockDetails;
}

export default function CompanyOverview({ details }: CompanyOverviewProps) {
  const { profile, fundamentals } = details;

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatMarketCap = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    const crores = value / 10_000_000;
    return `₹ ${new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
    }).format(crores)} Cr`;
  };

  const formatPercent = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    const absolute = Math.abs(value);
    const multiplier = absolute > 0 && absolute <= 1.0 ? 100 : 1;
    return `${(value * multiplier).toFixed(2)}%`;
  };

  const formatDecimal = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    return value.toFixed(2);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="text-3xl w-14 h-14 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0">
            🏭
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 leading-tight">{profile.name}</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">
                {profile.symbol}
              </span>
              <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                {profile.sector}
              </span>
              <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                {profile.industry}
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-gray-600 text-justify">{profile.description}</p>
        {profile.website && (
          <div className="mt-2">
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
            >
              🌐 Visit Corporate Website
            </a>
          </div>
        )}
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Current Price */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 border border-blue-200 hover:border-blue-300 hover:-translate-y-0.5 rounded-xl p-4 flex items-center gap-3 shadow-sm transition duration-300">
          <div className="text-2xl w-11 h-11 rounded-lg bg-white border border-blue-100 flex items-center justify-center flex-shrink-0">
            💵
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Current Price</span>
            <span className="text-base font-extrabold text-blue-900 truncate">
              {formatCurrency(fundamentals.currentPrice)}
            </span>
          </div>
        </div>

        {/* Market Cap */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 rounded-xl p-4 flex items-center gap-3 shadow-sm transition duration-300">
          <div className="text-2xl w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
            🏢
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Market Cap</span>
            <span className="text-sm font-bold text-gray-800 truncate">{formatMarketCap(fundamentals.marketCap)}</span>
          </div>
        </div>

        {/* 52W High */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 rounded-xl p-4 flex items-center gap-3 shadow-sm transition duration-300">
          <div className="text-2xl w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
            📈
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">52 Week High</span>
            <span className="text-sm font-bold text-green-600 truncate">
              {formatCurrency(fundamentals.fiftyTwoWeekHigh)}
            </span>
          </div>
        </div>

        {/* 52W Low */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 rounded-xl p-4 flex items-center gap-3 shadow-sm transition duration-300">
          <div className="text-2xl w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
            📉
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">52 Week Low</span>
            <span className="text-sm font-bold text-red-600 truncate">
              {formatCurrency(fundamentals.fiftyTwoWeekLow)}
            </span>
          </div>
        </div>

        {/* PE Ratio */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 rounded-xl p-4 flex items-center gap-3 shadow-sm transition duration-300">
          <div className="text-2xl w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
            📊
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">P/E Ratio (TTM)</span>
            <span className="text-sm font-bold text-gray-800 truncate">{formatDecimal(fundamentals.peRatio)}</span>
          </div>
        </div>

        {/* PB Ratio */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 rounded-xl p-4 flex items-center gap-3 shadow-sm transition duration-300">
          <div className="text-2xl w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
            📘
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">P/B Ratio</span>
            <span className="text-sm font-bold text-gray-800 truncate">{formatDecimal(fundamentals.pbRatio)}</span>
          </div>
        </div>

        {/* ROE */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 rounded-xl p-4 flex items-center gap-3 shadow-sm transition duration-300">
          <div className="text-2xl w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
            🎯
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ROE</span>
            <span className="text-sm font-bold text-gray-800 truncate">{formatPercent(fundamentals.roe)}</span>
          </div>
        </div>

        {/* ROCE */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 rounded-xl p-4 flex items-center gap-3 shadow-sm transition duration-300">
          <div className="text-2xl w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
            🛡️
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ROCE</span>
            <span className="text-sm font-bold text-gray-800 truncate">{formatPercent(fundamentals.roce)}</span>
          </div>
        </div>

        {/* EPS */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 rounded-xl p-4 flex items-center gap-3 shadow-sm transition duration-300">
          <div className="text-2xl w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
            💸
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">EPS (TTM)</span>
            <span className="text-sm font-bold text-gray-800 truncate">{formatCurrency(fundamentals.eps)}</span>
          </div>
        </div>

        {/* Book Value */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 rounded-xl p-4 flex items-center gap-3 shadow-sm transition duration-300">
          <div className="text-2xl w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
            📖
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Book Value</span>
            <span className="text-sm font-bold text-gray-800 truncate">{formatCurrency(fundamentals.bookValue)}</span>
          </div>
        </div>

        {/* Dividend Yield */}
        <div className="bg-white border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 rounded-xl p-4 flex items-center gap-3 shadow-sm transition duration-300">
          <div className="text-2xl w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
            🎁
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Dividend Yield</span>
            <span className="text-sm font-bold text-gray-800 truncate">
              {formatPercent(fundamentals.dividendYield)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
