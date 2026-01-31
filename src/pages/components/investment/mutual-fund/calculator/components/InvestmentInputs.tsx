import { memo } from 'react';

interface InvestmentInputsProps {
  investmentType: 'sip' | 'yearly-sip' | 'lumpsum';
  sipAmount: string;
  lumpsumAmount: string;
  annualReturn: string;
  investmentPeriod: string;
  onSipAmountChange: (value: string) => void;
  onLumpsumAmountChange: (value: string) => void;
  onAnnualReturnChange: (value: string) => void;
  onInvestmentPeriodChange: (value: string) => void;
}

const InvestmentInputs = memo(
  ({
    investmentType,
    sipAmount,
    lumpsumAmount,
    annualReturn,
    investmentPeriod,
    onSipAmountChange,
    onLumpsumAmountChange,
    onAnnualReturnChange,
    onInvestmentPeriodChange,
  }: InvestmentInputsProps) => {
    return (
      <div className="space-y-4">
        {(investmentType === 'sip' || investmentType === 'yearly-sip') && (
          <div className="space-y-2">
            <label htmlFor="sipAmount" className="block text-sm font-semibold text-gray-700">
              {investmentType === 'sip' ? 'Monthly SIP Amount (₹)' : 'Yearly SIP Amount (₹)'}
            </label>
            <input
              id="sipAmount"
              type="number"
              value={sipAmount}
              onChange={(e) => onSipAmountChange(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder={investmentType === 'sip' ? 'e.g., 5000' : 'e.g., 60000'}
              min="0"
              step="1000"
            />
          </div>
        )}

        {investmentType === 'lumpsum' && (
          <div className="space-y-2">
            <label htmlFor="lumpsumAmount" className="block text-sm font-semibold text-gray-700">
              Lumpsum Amount (₹)
            </label>
            <input
              id="lumpsumAmount"
              type="number"
              value={lumpsumAmount}
              onChange={(e) => onLumpsumAmountChange(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="e.g., 100000"
              min="0"
              step="10000"
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="annualReturn" className="block text-sm font-semibold text-gray-700">
            Expected Annual Return (%)
          </label>
          <input
            id="annualReturn"
            type="number"
            value={annualReturn}
            onChange={(e) => onAnnualReturnChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder="e.g., 12"
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="investmentPeriod" className="block text-sm font-semibold text-gray-700">
            Investment Period (Years)
          </label>
          <input
            id="investmentPeriod"
            type="number"
            value={investmentPeriod}
            onChange={(e) => onInvestmentPeriodChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder="e.g., 10"
            min="1"
            max="50"
            step="1"
          />
        </div>
      </div>
    );
  },
);

InvestmentInputs.displayName = 'InvestmentInputs';

export default InvestmentInputs;
