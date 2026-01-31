import type { PriceResult } from '../types';
import { GOLD_SILVER_TEXTS } from '../constants/goldSilver.constants';

interface LivePriceTableProps {
  priceDetails: PriceResult[];
}

export function LivePriceTable({ priceDetails }: LivePriceTableProps) {
  if (priceDetails.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{GOLD_SILVER_TEXTS.LIVE_TABLE.TITLE}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2 px-3 text-gray-500 font-medium">
                {GOLD_SILVER_TEXTS.LIVE_TABLE.HEADERS.SOURCE}
              </th>
              <th className="text-right py-2 px-3 text-yellow-600 font-medium">
                <span className="flex items-center justify-end gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {GOLD_SILVER_TEXTS.LIVE_TABLE.HEADERS.GOLD}
                </span>
              </th>
              <th className="text-right py-2 px-3 text-gray-600 font-medium">
                <span className="flex items-center justify-end gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {GOLD_SILVER_TEXTS.LIVE_TABLE.HEADERS.SILVER}
                </span>
              </th>
              <th className="text-right py-2 px-3 text-gray-400 font-medium">
                {GOLD_SILVER_TEXTS.LIVE_TABLE.HEADERS.LAST_UPDATED}
              </th>
            </tr>
          </thead>
          <tbody>
            {priceDetails.map((detail, idx) => (
              <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-100">
                <td className="py-2 px-3 text-gray-700">{detail.source}</td>
                <td className="py-2 px-3 text-right font-mono">${detail.g.toFixed(2)}</td>
                <td className="py-2 px-3 text-right font-mono">${detail.s.toFixed(2)}</td>
                <td className="py-2 px-3 text-right text-gray-500 text-xs">
                  {detail.time || GOLD_SILVER_TEXTS.LIVE_TABLE.NA}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
