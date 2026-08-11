import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import type { AnnualMetric } from '../types';

Chart.register(...registerables);

interface FinancialPerformanceProps {
  annuals: AnnualMetric[] | null;
}

function formatCr(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }
  return `₹ ${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr`;
}

function formatGrowth(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export default function FinancialPerformance({ annuals }: FinancialPerformanceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const years = (annuals ?? []).slice(-5);
  const latest = years[years.length - 1];

  useEffect(() => {
    if (!canvasRef.current || years.length === 0) {
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
        labels: years.map((m) => m.year.replace('Mar ', "FY'").replace(' ', "'")),
        datasets: [
          {
            type: 'bar',
            label: 'Revenue (₹ Cr)',
            data: years.map((m) => m.sales),
            backgroundColor: 'rgba(59, 130, 246, 0.75)',
            borderRadius: 6,
            order: 2,
          },
          {
            type: 'line',
            label: 'Net Profit (₹ Cr)',
            data: years.map((m) => m.netProfit),
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22, 163, 74, 0.1)',
            borderWidth: 2,
            tension: 0.35,
            fill: true,
            pointBackgroundColor: '#15803d',
            pointRadius: 4,
            order: 1,
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
            ticks: {
              font: { size: 9 },
              callback: (val) => `${val}`,
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
  }, [annuals]);

  if (!years.length) {
    return null;
  }

  const statChips = [
    {
      label: `Sales Growth (${latest?.year.replace('Mar ', "FY'") ?? 'Latest'})`,
      value: formatGrowth(latest?.salesGrowth),
      positive: (latest?.salesGrowth ?? 0) >= 0,
    },
    {
      label: `Profit Growth (${latest?.year.replace('Mar ', "FY'") ?? 'Latest'})`,
      value: formatGrowth(latest?.netProfitGrowth),
      positive: (latest?.netProfitGrowth ?? 0) >= 0,
    },
    {
      label: 'OPM',
      value: latest?.opm !== null && latest?.opm !== undefined ? `${latest.opm.toFixed(1)}%` : '—',
      positive: (latest?.opm ?? 0) >= 0,
    },
    {
      label: 'ROCE',
      value: latest?.roce !== null && latest?.roce !== undefined ? `${latest.roce.toFixed(1)}%` : '—',
      positive: (latest?.roce ?? 0) >= 0,
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-gray-900">Financial Performance</h3>
        <p className="text-xs text-gray-500">
          Annual revenue vs net profit, standalone figures (₹ Cr). Source: screener.in (free).
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statChips.map((chip) => (
          <div
            key={chip.label}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex flex-col gap-0.5"
          >
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{chip.label}</span>
            <span className={`text-sm font-extrabold ${chip.positive ? 'text-green-600' : 'text-red-600'}`}>
              {chip.value}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="relative h-56 w-full">
          <canvas ref={canvasRef}></canvas>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left text-xs min-w-[480px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wide text-[10px]">
              <th className="py-2 px-3">Year</th>
              <th className="py-2 px-3 text-right">Revenue</th>
              <th className="py-2 px-3 text-right">OPM %</th>
              <th className="py-2 px-3 text-right">Net Profit</th>
              <th className="py-2 px-3 text-right">Sales Growth</th>
              <th className="py-2 px-3 text-right">Profit Growth</th>
              <th className="py-2 px-3 text-right">EPS (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {years.map((m) => (
              <tr key={m.year} className="hover:bg-gray-50/50 transition">
                <td className="py-2 px-3 font-bold text-gray-800">{m.year}</td>
                <td className="py-2 px-3 text-right text-gray-700">{formatCr(m.sales)}</td>
                <td className="py-2 px-3 text-right text-gray-700">{m.opm !== null ? `${m.opm.toFixed(1)}%` : '—'}</td>
                <td className="py-2 px-3 text-right text-gray-700">{formatCr(m.netProfit)}</td>
                <td
                  className={`py-2 px-3 text-right font-semibold ${(m.salesGrowth ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {formatGrowth(m.salesGrowth)}
                </td>
                <td
                  className={`py-2 px-3 text-right font-semibold ${(m.netProfitGrowth ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {formatGrowth(m.netProfitGrowth)}
                </td>
                <td className="py-2 px-3 text-right text-gray-700">{m.eps !== null ? `₹ ${m.eps.toFixed(2)}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
