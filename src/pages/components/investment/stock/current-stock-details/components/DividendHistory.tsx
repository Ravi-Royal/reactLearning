import { useState, useMemo, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import type { DividendItem } from '../types';

Chart.register(...registerables);

interface DividendHistoryProps {
  dividends: DividendItem[];
}

export default function DividendHistory({ dividends }: DividendHistoryProps) {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Toggle sort order
  const handleSort = () => {
    setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  // Memoize sorted items
  const sortedItems = useMemo(() => {
    const list = [...dividends];
    return list.sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      return sortDirection === 'desc' ? -cmp : cmp;
    });
  }, [dividends, sortDirection]);

  // Initialize and update Chart.js
  useEffect(() => {
    if (!chartCanvasRef.current || dividends.length === 0) {
      return;
    }

    // Destroy existing instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    // Sort oldest to newest for chronological representation
    const chartData = [...dividends].sort((a, b) => a.date.localeCompare(b.date));

    // Aggregate by year
    const annualDividendsMap = new Map<string, number>();
    chartData.forEach((item) => {
      const year = item.date.split('-')[0];
      annualDividendsMap.set(year, (annualDividendsMap.get(year) || 0) + item.amount);
    });

    const labels = Array.from(annualDividendsMap.keys());
    const values = Array.from(annualDividendsMap.values());

    const ctx = chartCanvasRef.current.getContext('2d');
    if (!ctx) {
      return;
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Annual Dividend (₹)',
            data: values,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            borderWidth: 2,
            tension: 0.35,
            fill: true,
            pointBackgroundColor: '#2563eb',
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Inter, sans-serif', size: 10, weight: 'bold' },
            },
          },
          tooltip: {
            padding: 8,
            callbacks: {
              label: (context) => `Total: ₹${Number(context.raw).toFixed(2)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 9 } },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: {
              font: { size: 9 },
              callback: (val) => `₹${val}`,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [dividends]);

  if (dividends.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <h3 className="text-base font-bold text-gray-900">Dividend History</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-start gap-4">
          <span className="text-2xl bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100 text-blue-500">
            🎁
          </span>
          <div>
            <h4 className="text-sm font-bold text-gray-800">No Dividend Payments Found</h4>
            <p className="text-xs text-gray-500 leading-relaxed mt-1">
              This company has either not distributed any dividends over the last 10 years or the data is not reported
              in public sheets.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <h3 className="text-base font-bold text-gray-900">Dividend History</h3>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
        {/* Table Column */}
        <div className="flex flex-col gap-3">
          <div className="overflow-y-auto max-h-60 rounded-lg border border-gray-100 shadow-sm relative scrollbar-thin">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                <tr className="border-b border-gray-200 text-gray-600 font-bold select-none">
                  <th
                    onClick={handleSort}
                    className="py-2.5 px-4 cursor-pointer hover:bg-blue-50/50 hover:text-blue-600 transition flex items-center gap-1 bg-gray-50"
                  >
                    Ex-Date
                    <span className="text-[10px] text-gray-400">{sortDirection === 'desc' ? '▼' : '▲'}</span>
                  </th>
                  <th className="py-2.5 px-4 bg-gray-50">Record Date</th>
                  <th className="py-2.5 px-4 text-right bg-gray-50">Dividend Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition bg-white">
                    <td className="py-2.5 px-4 font-bold text-gray-800">{item.date}</td>
                    <td className="py-2.5 px-4 text-gray-400">N/A*</td>
                    <td className="py-2.5 px-4 text-right font-bold text-gray-800">₹ {item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <span className="text-[9px] text-gray-400 font-medium italic pl-1">
            *Record Date is not exposed in public free API chart summaries.
          </span>
        </div>

        {/* Chart Column */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
          <div className="relative h-48 w-full">
            <canvas ref={chartCanvasRef}></canvas>
          </div>
          <p className="text-[10px] text-gray-400 text-center leading-normal">
            Quarterly dividend amounts aggregated by calendar year.
          </p>
        </div>
      </div>
    </div>
  );
}
