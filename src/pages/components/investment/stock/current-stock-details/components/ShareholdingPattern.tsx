import type { StockDetails } from '../types';

interface ShareholdingPatternProps {
  details: StockDetails;
}

export default function ShareholdingPattern({ details: _details }: ShareholdingPatternProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <h3 className="text-base font-bold text-gray-900">Shareholding Pattern & Trends</h3>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6 items-stretch">
        {/* Info notice */}
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-5 flex gap-4 items-start">
          <div className="text-3xl bg-white border border-gray-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm animate-bounce">
            🔒
          </div>
          <div className="flex flex-col gap-2.5">
            <h4 className="text-sm font-bold text-gray-800">Data Not Available from Free Source</h4>
            <p className="text-xs text-gray-500 leading-relaxed text-justify">
              Promoter, FII (Foreign Institutional Investors), DII (Domestic Institutional Investors), and Public
              ownership breakdowns are reported quarterly to <strong>NSE & BSE</strong> in accordance with SEBI
              guidelines.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed text-justify font-normal">
              Free global finance endpoints (e.g. Yahoo Finance or Alpha Vantage) do not capture or compile these
              micro-level regional statistics. Accessing SEBI shareholding data programmatically requires paid APIs from
              regional vendors (e.g., TrueData) or server-based exchange scrapers.
            </p>
            <span className="self-start text-[8px] font-bold tracking-wider uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded">
              SEBI Filing Data Restricted
            </span>
          </div>
        </div>

        {/* Skeleton Trend Chart */}
        <div className="bg-slate-50 border border-gray-200 rounded-xl p-5 flex items-center justify-center min-h-[160px]">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-end gap-2.5 h-16 w-28 border-b-2 border-gray-300 pb-0.5 select-none">
              <div className="w-4 bg-gray-200 rounded-t h-[40%] animate-pulse"></div>
              <div className="w-4 bg-gray-200 rounded-t h-[75%] animate-pulse delay-150"></div>
              <div className="w-4 bg-gray-200 rounded-t h-[50%] animate-pulse delay-300"></div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Quarterly Trend Charts Unavailable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
