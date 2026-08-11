import { useMemo } from 'react';
import type { StockDetails } from '../types';

interface HeroHeaderProps {
  details: StockDetails;
}

function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }
  return `₹ ${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatCr(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }
  // marketCap is stored in raw rupees - convert to Cr for display.
  const crores = value / 10_000_000;
  return `₹${crores.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr`;
}

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }
  const absolute = Math.abs(value);
  const multiplier = absolute > 0 && absolute <= 1.0 ? 100 : 1;
  return `${(value * multiplier).toFixed(2)}%`;
}

function formatDecimal(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }
  return value.toFixed(2);
}

/** Build the SVG polyline points for the 1y price sparkline. */
function buildSparkline(closes: number[], width = 240, height = 56): string {
  if (closes.length < 2) {
    return '';
  }
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const span = max - min || 1;
  return closes
    .map((close, index) => {
      const x = (index / (closes.length - 1)) * width;
      const y = height - ((close - min) / span) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export default function HeroHeader({ details }: HeroHeaderProps) {
  const { profile, fundamentals, priceHistory } = details;

  const previousClose = priceHistory?.previousClose ?? null;
  const price = fundamentals.currentPrice;
  const dayChange =
    price !== null && previousClose !== null && previousClose > 0
      ? ((price - previousClose) / previousClose) * 100
      : null;
  const isUp = dayChange !== null && dayChange >= 0;

  const sparkPoints = useMemo(
    () => (priceHistory?.closes && priceHistory.closes.length > 1 ? buildSparkline(priceHistory.closes) : ''),
    [priceHistory],
  );

  const chips: { label: string; value: string; accent: boolean }[] = [
    { label: 'Market Cap', value: formatCr(fundamentals.marketCap), accent: false },
    { label: 'P/E (TTM)', value: formatDecimal(fundamentals.peRatio), accent: false },
    { label: 'P/B', value: formatDecimal(fundamentals.pbRatio), accent: false },
    { label: 'ROE', value: formatPercent(fundamentals.roe), accent: false },
    { label: 'ROCE', value: formatPercent(fundamentals.roce), accent: false },
    { label: 'Div Yield', value: formatPercent(fundamentals.dividendYield), accent: false },
    { label: '52W High', value: formatPrice(fundamentals.fiftyTwoWeekHigh), accent: true },
    { label: '52W Low', value: formatPrice(fundamentals.fiftyTwoWeekLow), accent: true },
  ];

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white">
      {/* Top row: identity */}
      <div className="px-5 sm:px-7 pt-5 sm:pt-6 pb-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-xl sm:text-2xl font-black flex-shrink-0">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-extrabold leading-tight truncate">{profile.name}</h2>
              <span className="text-[10px] font-bold bg-white/15 border border-white/20 px-2 py-0.5 rounded-md">
                {profile.symbol}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/20 px-2 py-0.5 rounded-md">
                {profile.sector}
              </span>
              <span className="text-[10px] font-semibold bg-white/10 text-slate-200 border border-white/10 px-2 py-0.5 rounded-md">
                {profile.industry}
              </span>
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-semibold text-sky-300 hover:text-sky-200 hover:underline px-1 py-0.5 flex items-center gap-1"
                >
                  🌐 Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Price + day change */}
        <div className="flex items-center gap-5 sm:ml-auto shrink-0">
          <div className="text-right">
            <div className="text-3xl sm:text-4xl font-black tracking-tight">{formatPrice(price)}</div>
            <div className="mt-1 flex items-center justify-end gap-1.5">
              {dayChange !== null && (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    isUp ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {isUp ? '▲' : '▼'} {Math.abs(dayChange).toFixed(2)}%
                </span>
              )}
              <span className="text-[10px] text-slate-400">vs previous close</span>
            </div>
          </div>

          {/* Sparkline */}
          {sparkPoints && (
            <svg viewBox="0 0 240 56" className="w-28 sm:w-36 h-14 shrink-0" aria-hidden="true">
              <polyline
                points={sparkPoints}
                fill="none"
                stroke={isUp ? '#4ade80' : '#f87171'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polygon
                points={`0,56 ${sparkPoints} 240,56`}
                fill={isUp ? 'rgba(74,222,128,0.10)' : 'rgba(248,113,113,0.10)'}
              />
            </svg>
          )}
        </div>
      </div>

      {/* Chips strip */}
      <div className="px-5 sm:px-7 pb-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {chips.map((chip) => (
          <div
            key={chip.label}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex flex-col gap-0.5"
          >
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{chip.label}</span>
            <span className={`text-xs sm:text-sm font-bold ${chip.accent ? 'text-sky-300' : 'text-white'}`}>
              {chip.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
