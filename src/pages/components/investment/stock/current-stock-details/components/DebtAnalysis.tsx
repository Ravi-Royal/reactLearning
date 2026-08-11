import type { StockFundamentals } from '../types';

interface DebtAnalysisProps {
  fundamentals: StockFundamentals;
}

export default function DebtAnalysis({ fundamentals }: DebtAnalysisProps) {
  const { debtToEquity, totalDebt, cashReserves, interestCoverageRatio } = fundamentals;

  // Determine status configurations
  const getDebtStatus = () => {
    if (debtToEquity === null || debtToEquity === undefined) {
      return {
        borderColor: 'border-l-gray-400',
        textColor: 'text-gray-700',
        bgColor: 'bg-gray-50',
        badgeColor: 'bg-gray-100 text-gray-700 border-gray-200',
        labelText: 'Data Not Available',
      };
    }
    if (debtToEquity < 0.5) {
      return {
        borderColor: 'border-l-green-500',
        textColor: 'text-green-800',
        bgColor: 'bg-green-50/20',
        badgeColor: 'bg-green-100 text-green-800 border-green-200',
        labelText: 'Low Debt (Healthy)',
      };
    } else if (debtToEquity <= 1.0) {
      return {
        borderColor: 'border-l-yellow-500',
        textColor: 'text-yellow-800',
        bgColor: 'bg-yellow-50/20',
        badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        labelText: 'Moderate Debt (Stable)',
      };
    } else {
      return {
        borderColor: 'border-l-red-500',
        textColor: 'text-red-800',
        bgColor: 'bg-red-50/20',
        badgeColor: 'bg-red-100 text-red-800 border-red-200',
        labelText: 'High Debt (Leveraged)',
      };
    }
  };

  const status = getDebtStatus();

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (value >= 10_000_000) {
      const crores = value / 10_000_000;
      return `₹ ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(crores)} Cr`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatRatio = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    return value.toFixed(2);
  };

  // Interest coverage status: > 4x comfortable, 2-4x acceptable, < 2x risky
  const getCoverageStatus = () => {
    if (interestCoverageRatio === null || interestCoverageRatio === undefined) {
      return { textColor: 'text-gray-400', note: 'Not reported by free sources' };
    }
    if (interestCoverageRatio > 4) {
      return { textColor: 'text-green-600', note: 'Comfortably covers interest expenses' };
    }
    if (interestCoverageRatio >= 2) {
      return { textColor: 'text-yellow-600', note: 'Adequate but watch during downturns' };
    }
    return { textColor: 'text-red-600', note: 'Elevated interest payment risk' };
  };

  const coverageStatus = getCoverageStatus();

  // Map 0.0 to 2.0+ onto 0% to 100%
  const getProgressWidth = () => {
    if (debtToEquity === null || debtToEquity === undefined) {
      return 0;
    }
    return Math.min(debtToEquity * 50, 100);
  };

  return (
    <div
      className={`bg-white border border-gray-200 border-l-4 rounded-2xl p-6 shadow-sm flex flex-col gap-6 transition-all duration-300 ${status.borderColor}`}
    >
      {/* Banner */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-bold text-gray-900">Debt & Solvency Analysis</h3>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${status.badgeColor}`}>
            {status.labelText}
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Analyzing the firm's balance sheet leverage and cash buffer. A low debt-to-equity ratio ensures stability
          during market downturns.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Debt to Equity Ratio */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-2 relative">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Debt to Equity</span>
          <span className="text-xl font-extrabold text-gray-800">{formatRatio(debtToEquity)}</span>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                debtToEquity === null || debtToEquity === undefined
                  ? 'bg-gray-400'
                  : debtToEquity < 0.5
                    ? 'bg-green-500'
                    : debtToEquity <= 1.0
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
              }`}
              style={{ width: `${getProgressWidth()}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[8px] font-semibold text-gray-400">
            <span>0.0 (Debt Free)</span>
            <span>0.5 (Ideal)</span>
            <span>1.0 (Limit)</span>
          </div>
        </div>

        {/* Total Debt */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Debt</span>
          <span className="text-xl font-extrabold text-red-600">{formatCurrency(totalDebt)}</span>
          <span className="text-[10px] text-gray-400 leading-tight">Total short and long-term liabilities</span>
        </div>

        {/* Cash Reserves */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Cash & Equivalents</span>
          <span className="text-xl font-extrabold text-green-600">{formatCurrency(cashReserves)}</span>
          <span className="text-[10px] text-gray-400 leading-tight">Liquidity available on balance sheet</span>
        </div>

        {/* Interest Coverage Ratio */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Interest Coverage Ratio</span>
          <span className={`text-xl font-extrabold ${coverageStatus.textColor}`}>
            {interestCoverageRatio === null || interestCoverageRatio === undefined
              ? 'Not Available'
              : `${interestCoverageRatio.toFixed(1)}x`}
          </span>
          <span className="text-[10px] text-gray-400 leading-tight">{coverageStatus.note}</span>
        </div>
      </div>

      {/* Threshold reference */}
      <div className="flex flex-col gap-1.5 pt-4 border-t border-gray-100 text-[11px] text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0"></span>
          <span>
            <strong>Green (&lt; 0.5):</strong> Minimal debt. Excellent financial cushion.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 flex-shrink-0"></span>
          <span>
            <strong>Yellow (0.5 - 1.0):</strong> Moderate debt. Normal for asset-heavy industries.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0"></span>
          <span>
            <strong>Red (&gt; 1.0):</strong> High leverage. Elevated interest and solvency obligation risk.
          </span>
        </div>
      </div>
    </div>
  );
}
