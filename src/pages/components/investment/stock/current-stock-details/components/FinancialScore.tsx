import type { FinancialScoreResult } from '../types';

interface FinancialScoreProps {
  financialScore: FinancialScoreResult;
}

export default function FinancialScore({ financialScore }: FinancialScoreProps) {
  const { score, rating, reasons } = financialScore;

  const circumference = 238.76;
  const strokeDashoffset = circumference * (1 - Math.max(0, Math.min(100, score)) / 100);

  // Dynamic configuration based on rating
  const getRatingStyle = () => {
    switch (rating) {
      case 'Excellent':
        return {
          textColor: 'text-green-600',
          badgeBg: 'bg-green-600',
          bulletColor: 'text-green-600 bg-green-50 border-green-200',
          description:
            'The company exhibits outstanding financial strength, high profitability, and low leverage risk.',
        };
      case 'Good':
        return {
          textColor: 'text-blue-600',
          badgeBg: 'bg-blue-600',
          bulletColor: 'text-blue-600 bg-blue-50 border-blue-200',
          description:
            'The company is financially robust with stable sales and profit numbers, though with minor items to watch.',
        };
      case 'Average':
        return {
          textColor: 'text-yellow-600',
          badgeBg: 'bg-yellow-600',
          bulletColor: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          description:
            'The company shows moderate performance, showing stress in either profit growth or higher debt load.',
        };
      case 'Weak':
      default:
        return {
          textColor: 'text-red-600',
          badgeBg: 'bg-red-600',
          bulletColor: 'text-red-600 bg-red-50 border-red-200',
          description:
            'The company shows high risk, negative/stagnant earnings growth, or high leverage that demands caution.',
        };
    }
  };

  const style = getRatingStyle();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
      <h3 className="text-base font-bold text-gray-900">Financial Health Rating</h3>

      <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-6 items-center">
        {/* Gauge Column */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Background ring */}
              <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="8" fill="none" />
              {/* Active ring */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke={score >= 80 ? '#16a34a' : score >= 60 ? '#2563eb' : score >= 40 ? '#eab308' : '#dc2626'}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000 ease-out"
              />
              <text x="50" y="47" textAnchor="middle" className="text-[22px] font-black fill-gray-800">
                {score}
              </text>
              <text x="50" y="65" textAnchor="middle" className="text-[10px] font-bold fill-gray-400 tracking-wider">
                /100
              </text>
            </svg>
          </div>
          <div>
            <span
              className={`text-[10px] font-extrabold text-white px-4 py-1 rounded-full uppercase tracking-wider ${style.badgeBg}`}
            >
              {rating}
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-normal max-w-[220px]">{style.description}</p>
        </div>

        {/* Diagnostics Column */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Diagnostic Assessment</h4>
          <ul className="flex flex-col gap-2.5">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span
                  className={`text-xs font-bold w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${style.bulletColor}`}
                >
                  ✓
                </span>
                <span className="text-xs text-gray-600 leading-normal">{reason}</span>
              </li>
            ))}
          </ul>

          {/* Formula Documentation */}
          <div className="border-t border-gray-100 pt-3">
            <details className="group">
              <summary className="text-[11px] font-bold text-gray-500 hover:text-gray-700 cursor-pointer list-none flex items-center gap-1 outline-none">
                <span className="transition-transform group-open:rotate-90">▶</span>
                How is this score calculated?
              </summary>
              <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-[10px] text-gray-500 flex flex-col gap-1.5 animate-fadeIn">
                <p className="leading-relaxed">
                  Our algorithm calculates a 100-point rating based on 5 fundamental checkpoints:
                </p>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 font-bold text-gray-600">
                      <th className="py-1 px-1">Factor</th>
                      <th className="py-1 px-1">Weight</th>
                      <th className="py-1 px-1">Threshold</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-1 px-1 font-medium text-gray-700">Return on Equity (ROE)</td>
                      <td className="py-1 px-1">25 pts</td>
                      <td className="py-1 px-1">&gt;20%=25 | 15-20%=20 | 10-15%=15 | &lt;10%=5</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-1 font-medium text-gray-700">ROCE (ROE Fallback)</td>
                      <td className="py-1 px-1">20 pts</td>
                      <td className="py-1 px-1">&gt;15%=20 | 10-15%=15 | &lt;10%=10</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-1 font-medium text-gray-700">Debt to Equity Ratio</td>
                      <td className="py-1 px-1">25 pts</td>
                      <td className="py-1 px-1">&lt;0.5=25 | 0.5-1.0=15 | 1.0-1.5=5 | &gt;1.5=0</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-1 font-medium text-gray-700">Sales Growth (YoY)</td>
                      <td className="py-1 px-1">15 pts</td>
                      <td className="py-1 px-1">&gt;15%=15 | 5-15%=10 | 0-5%=5 | Neg=0</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-1 font-medium text-gray-700">Profit Growth (YoY)</td>
                      <td className="py-1 px-1">15 pts</td>
                      <td className="py-1 px-1">&gt;15%=15 | 5-15%=10 | 0-5%=5 | Neg=0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
