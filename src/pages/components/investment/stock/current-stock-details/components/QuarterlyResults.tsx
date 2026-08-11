import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import type { QuarterlyResult } from '../types';

Chart.register(...registerables);

interface QuarterlyResultsProps {
  quarters: QuarterlyResult[] | null;
}

function formatCr(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }
  return `₹ ${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr`;
}

function formatQuarter(quarter: string): string {
  const match = quarter.match(/^(.+?)\s+(\d{4})$/);
  if (!match) {
    return quarter;
  }
  return `${match[1]}'${match[2].slice(2)}`;
}

/** % change vs the previous quarter (null when either side is missing or zero). */
function pctChange(value: number | null | undefined, previous: number | null | undefined): number | null {
  if (value === null || value === undefined || previous === null || previous === undefined || previous === 0) {
    return null;
  }
  return ((value - previous) / Math.abs(previous)) * 100;
}

function Delta({ change }: { change: number | null }) {
  if (change === null) {
    return null;
  }
  return (
    <span
      className={`ml-1 text-[9px] font-bold ${
        change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-400'
      }`}
    >
      ({change > 0 ? '▲ +' : change < 0 ? '▼ −' : ''}
      {Math.abs(change).toFixed(1)}%)
    </span>
  );
}

export default function QuarterlyResults({ quarters }: QuarterlyResultsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const recent = (quarters ?? []).slice(-8);

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
      type: 'bar',
      data: {
        labels: recent.map((q) => formatQuarter(q.quarter)),
        datasets: [
          {
            label: 'Revenue (₹ Cr)',
            data: recent.map((q) => q.sales),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderRadius: 5,
          },
          {
            label: 'Net Profit (₹ Cr)',
            data: recent.map((q) => q.netProfit),
            backgroundColor: 'rgba(22, 163, 74, 0.75)',
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 12, font: { family: 'Inter, sans-serif', size: 10, weight: 'bold' } },
          },
          tooltip: {
            padding: 8,
            callbacks: {
              label: (context) => `${context.dataset.label}: ${formatCr(context.raw as number)}`,
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 9 } } },
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { font: { size: 9 } },
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
  }, [quarters]);

  if (recent.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-gray-900">Quarterly Results</h3>
        <p className="text-xs text-gray-500">
          Last {recent.length} quarters, standalone figures (₹ Cr). Source: screener.in (free).
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="relative h-52 w-full">
          <canvas ref={canvasRef}></canvas>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left text-xs min-w-[480px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wide text-[10px]">
              <th className="py-2 px-3">Quarter</th>
              <th className="py-2 px-3 text-right">Revenue</th>
              <th className="py-2 px-3 text-right">OPM %</th>
              <th className="py-2 px-3 text-right">Net Profit</th>
              <th className="py-2 px-3 text-right">EPS (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...recent].reverse().map((q, index) => {
              // Newest first, so the previous quarter is the row below.
              const previous = recent[recent.length - 2 - index];
              return (
                <tr key={q.quarter} className="hover:bg-gray-50/50 transition">
                  <td className="py-2 px-3 font-bold text-gray-800">{q.quarter}</td>
                  <td className="py-2 px-3 text-right text-gray-700 whitespace-nowrap">
                    <span>{formatCr(q.sales)}</span>
                    <Delta change={pctChange(q.sales, previous?.sales)} />
                  </td>
                  <td className="py-2 px-3 text-right text-gray-700">
                    {q.opm !== null ? `${q.opm.toFixed(1)}%` : '—'}
                  </td>
                  <td className="py-2 px-3 text-right text-gray-700 whitespace-nowrap">
                    <span>{formatCr(q.netProfit)}</span>
                    <Delta change={pctChange(q.netProfit, previous?.netProfit)} />
                  </td>
                  <td className="py-2 px-3 text-right text-gray-700 whitespace-nowrap">
                    <span>{q.eps !== null ? `₹ ${q.eps.toFixed(2)}` : '—'}</span>
                    <Delta change={pctChange(q.eps, previous?.eps)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
