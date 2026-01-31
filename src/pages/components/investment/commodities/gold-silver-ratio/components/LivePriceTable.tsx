import type { PriceResult } from '../types';
import { GOLD_SILVER_TEXTS } from '../constants/goldSilver.constants';

interface LivePriceTableProps {
  priceDetails: PriceResult[];
}

export function LivePriceTable({ priceDetails }: LivePriceTableProps) {
  if (priceDetails.length === 0) {return null;}

  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{GOLD_SILVER_TEXTS.LIVE_TABLE.TITLE}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2 px-3 text-gray-500 font-medium">{GOLD_SILVER_TEXTS.LIVE_TABLE.HEADERS.SOURCE}</th>
              <th className="text-right py-2 px-3 text-yellow-600 font-medium">{GOLD_SILVER_TEXTS.LIVE_TABLE.HEADERS.GOLD}</th>
              <th className="text-right py-2 px-3 text-gray-600 font-medium">{GOLD_SILVER_TEXTS.LIVE_TABLE.HEADERS.SILVER}</th>
              <th className="text-right py-2 px-3 text-gray-400 font-medium">{GOLD_SILVER_TEXTS.LIVE_TABLE.HEADERS.LAST_UPDATED}</th>
            </tr>
          </thead>
          <tbody>
            {priceDetails.map((detail, idx) => (
              <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-100">
                <td className="py-2 px-3 text-gray-700">{detail.source}</td>
                <td className="py-2 px-3 text-right font-mono">${detail.g.toFixed(2)}</td>
                <td className="py-2 px-3 text-right font-mono">${detail.s.toFixed(2)}</td>
                <td className="py-2 px-3 text-right text-gray-500 text-xs">{detail.time || GOLD_SILVER_TEXTS.LIVE_TABLE.NA}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
