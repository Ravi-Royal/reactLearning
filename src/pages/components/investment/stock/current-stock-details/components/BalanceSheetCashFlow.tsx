import type { BalanceSheetSnapshot, CashFlowSnapshot } from '../types';

interface BalanceSheetCashFlowProps {
  balanceSheet: BalanceSheetSnapshot | null;
  cashFlow: CashFlowSnapshot | null;
}

function formatCr(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }
  const abs = Math.abs(value);
  const sign = value < 0 ? '−' : '';
  return `${sign}₹ ${abs.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr`;
}

/** Bar width relative to the largest metric in a set (for visual proportion). */
function proportion(value: number | null | undefined, max: number): string {
  if (value === null || value === undefined || max <= 0) {
    return '0%';
  }
  return `${Math.max(4, Math.min(100, (Math.abs(value) / max) * 100))}%`;
}

interface MetricRow {
  label: string;
  value: number | null;
  barClass: string;
  note?: string;
}

function MetricList({ rows, max }: { rows: MetricRow[]; max: number }) {
  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{row.label}</span>
            <span className="text-xs sm:text-sm font-extrabold text-gray-800">{formatCr(row.value)}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${row.barClass}`} style={{ width: proportion(row.value, max) }}></div>
          </div>
          {row.note && <span className="text-[9px] text-gray-400 leading-tight">{row.note}</span>}
        </div>
      ))}
    </div>
  );
}

export default function BalanceSheetCashFlow({ balanceSheet, cashFlow }: BalanceSheetCashFlowProps) {
  if (!balanceSheet && !cashFlow) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      {/* Balance Sheet */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-gray-900">Balance Sheet</h3>
          <p className="text-xs text-gray-500">
            Latest fiscal year {balanceSheet ? `(${balanceSheet.year})` : ''}, standalone (₹ Cr). Source: screener.in
            (free).
          </p>
        </div>
        {balanceSheet ? (
          <MetricList
            max={
              Math.max(
                balanceSheet.totalAssets ?? 0,
                balanceSheet.borrowings ?? 0,
                balanceSheet.netWorth ?? 0,
                balanceSheet.fixedAssets ?? 0,
                balanceSheet.investments ?? 0,
              ) || 1
            }
            rows={[
              {
                label: 'Net Worth',
                value: balanceSheet.netWorth,
                barClass: 'bg-blue-500',
                note: 'Equity capital + reserves',
              },
              {
                label: 'Total Borrowings',
                value: balanceSheet.borrowings,
                barClass: 'bg-red-500',
                note: 'Debt on the balance sheet',
              },
              { label: 'Fixed Assets', value: balanceSheet.fixedAssets, barClass: 'bg-indigo-400' },
              { label: 'Investments', value: balanceSheet.investments, barClass: 'bg-teal-400' },
              {
                label: 'Total Assets',
                value: balanceSheet.totalAssets,
                barClass: 'bg-gray-400',
                note: 'Total liabilities + net worth',
              },
            ]}
          />
        ) : (
          <p className="text-xs text-gray-400">Balance sheet data not available.</p>
        )}
      </div>

      {/* Cash Flow */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-gray-900">Cash Flow</h3>
          <p className="text-xs text-gray-500">
            Latest fiscal year {cashFlow ? `(${cashFlow.year})` : ''}, standalone (₹ Cr). Source: screener.in (free).
          </p>
        </div>
        {cashFlow ? (
          <MetricList
            max={
              Math.max(
                Math.abs(cashFlow.cfo ?? 0),
                Math.abs(cashFlow.cfi ?? 0),
                Math.abs(cashFlow.cff ?? 0),
                Math.abs(cashFlow.freeCashFlow ?? 0),
              ) || 1
            }
            rows={[
              {
                label: 'Operating Cash Flow',
                value: cashFlow.cfo,
                barClass: 'bg-green-500',
                note: 'Cash generated from core business',
              },
              {
                label: 'Free Cash Flow',
                value: cashFlow.freeCashFlow,
                barClass: 'bg-teal-500',
                note: 'CFO − capital expenditure',
              },
              {
                label: 'Investing Cash Flow',
                value: cashFlow.cfi,
                barClass: 'bg-orange-400',
                note: 'Negative = buying assets',
              },
              {
                label: 'Financing Cash Flow',
                value: cashFlow.cff,
                barClass: 'bg-amber-400',
                note: 'Borrowings, dividends & buybacks',
              },
              {
                label: 'Net Cash Flow',
                value: cashFlow.netCashFlow,
                barClass: 'bg-gray-400',
                note: 'Total change in cash for the year',
              },
            ]}
          />
        ) : (
          <p className="text-xs text-gray-400">Cash flow data not available.</p>
        )}
      </div>
    </div>
  );
}
