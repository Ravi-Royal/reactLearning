import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import type { StockDetails } from '../types';

Chart.register(...registerables);

interface ShareholdingPatternProps {
  details: StockDetails;
}

const CATEGORIES = [
  { key: 'promoter', label: 'Promoter', color: '#6366f1', textColor: 'text-indigo-600' },
  { key: 'fii', label: 'FII', color: '#3b82f6', textColor: 'text-blue-600' },
  { key: 'dii', label: 'DII', color: '#14b8a6', textColor: 'text-teal-600' },
  { key: 'public', label: 'Public', color: '#9ca3af', textColor: 'text-gray-500' },
] as const;

function formatPct(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : `${value.toFixed(2)}%`;
}

function formatQuarter(quarter: string): string {
  const match = quarter.match(/^(.+?)\s+(\d{4})$/);
  if (!match) {
    return quarter;
  }
  return `${match[1]}'${match[2].slice(2)}`;
}

function delta(current: number | null | undefined, previous: number | null | undefined): number | null {
  if (current === null || current === undefined || previous === null || previous === undefined) {
    return null;
  }
  return current - previous;
}

export default function ShareholdingPattern({ details }: ShareholdingPatternProps) {
  const { shareholding } = details;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const recent = (shareholding?.trend ?? []).slice(-8);

  // Draw the quarterly trend as a single multi-line chart.
  useEffect(() => {
    if (!canvasRef.current || recent.length === 0) {
      return;
    }
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      return;
    }
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: recent.map((row) => formatQuarter(row.quarter)),
        datasets: CATEGORIES.map((category) => ({
          label: category.label,
          data: recent.map((row) => row[category.key]),
          borderColor: category.color,
          backgroundColor: category.color,
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 3.5,
          pointHoverRadius: 6,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: category.color,
          pointBorderWidth: 2,
          spanGaps: true,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 12, font: { family: 'Inter, sans-serif', size: 11, weight: 'bold' } },
          },
          tooltip: {
            padding: 10,
            callbacks: {
              label: (context) => `${context.dataset.label}: ${formatPct(context.raw as number)}`,
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: {
              font: { size: 10 },
              callback: (val) => `${val}%`,
            },
          },
        },
      },
    });
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [shareholding]);

  if (!shareholding || shareholding.trend.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <h3 className="text-base font-bold text-gray-900">Shareholding Pattern & Trends</h3>
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-5 flex gap-4 items-start">
          <div className="text-3xl bg-white border border-gray-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            🔒
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-gray-800">Shareholding Data Unavailable</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Quarterly promoter/FII/DII/Public ownership was not found for this symbol on the free screener.in feed.
              Try the NSE ticker (e.g. TCS, RELIANCE) instead of a BSE code.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { current, previous } = shareholding;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-gray-900">Shareholding Pattern & Trends</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Quarterly promoter, FII, DII and public ownership reported to exchanges. Source: screener.in (free).
        </p>
      </div>

      {/* Current vs previous summary tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {CATEGORIES.map((category) => {
          const currentValue = current[category.key];
          const previousValue = previous[category.key];
          const change = delta(currentValue, previousValue);
          return (
            <div key={category.key} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{category.label}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-gray-800">{formatPct(currentValue)}</span>
                {change !== null && (
                  <span
                    className={`text-[10px] font-bold ${
                      change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-400'
                    }`}
                  >
                    {change > 0 ? '▲' : change < 0 ? '▼' : '•'} {Math.abs(change).toFixed(2)}%
                  </span>
                )}
              </div>
              <span className="text-[9px] text-gray-400">vs {formatQuarter(previous.quarter)}</span>
            </div>
          );
        })}
      </div>

      {/* Quarterly trend - single readable multi-line chart */}
      {recent.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quarterly Trend</h4>
            <span className="text-[10px] font-semibold text-gray-400">
              {formatQuarter(recent[0].quarter)} → {formatQuarter(recent[recent.length - 1].quarter)}
            </span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="relative h-64 w-full">
              <canvas ref={canvasRef}></canvas>
            </div>
          </div>
        </div>
      )}

      {/* Quarter table */}
      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left border-collapse min-w-[480px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-2 px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Holder</th>
              {recent.map((row) => (
                <th
                  key={row.quarter}
                  className="py-2 px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider"
                >
                  {formatQuarter(row.quarter)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {CATEGORIES.map((category) => (
              <tr key={category.key}>
                <td className={`py-2 px-3 text-[11px] font-bold ${category.textColor}`}>{category.label}</td>
                {recent.map((row, index) => {
                  const change = delta(row[category.key], index > 0 ? recent[index - 1][category.key] : null);
                  return (
                    <td
                      key={row.quarter}
                      className="py-2 px-3 text-[11px] font-semibold text-gray-700 whitespace-nowrap"
                    >
                      <span>{formatPct(row[category.key])}</span>
                      {change !== null && (
                        <span
                          className={`ml-1 text-[9px] font-bold ${
                            change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-400'
                          }`}
                        >
                          ({change > 0 ? '▲ +' : change < 0 ? '▼ −' : ''}
                          {Math.abs(change).toFixed(2)}%)
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[9px] text-gray-400 leading-relaxed">
        Data reflects quarterly shareholding filings submitted to NSE/BSE. Values are percentages of total equity.
      </p>
    </div>
  );
}
