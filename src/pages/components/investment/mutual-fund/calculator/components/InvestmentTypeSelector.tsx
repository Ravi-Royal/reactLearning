import { memo } from 'react';

interface InvestmentTypeSelectorProps {
  investmentType: 'sip' | 'yearly-sip' | 'lumpsum';
  onInvestmentTypeChange: (type: 'sip' | 'yearly-sip' | 'lumpsum') => void;
}

const InvestmentTypeSelector = memo(({ investmentType, onInvestmentTypeChange }: InvestmentTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="investment-type" className="block text-sm font-semibold text-gray-700">
        Investment Type
      </label>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onInvestmentTypeChange('sip')}
          className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
            investmentType === 'sip'
              ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Monthly SIP
        </button>
        <button
          type="button"
          onClick={() => onInvestmentTypeChange('yearly-sip')}
          className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
            investmentType === 'yearly-sip'
              ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Yearly SIP
        </button>
        <button
          type="button"
          onClick={() => onInvestmentTypeChange('lumpsum')}
          className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
            investmentType === 'lumpsum'
              ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Lumpsum
        </button>
      </div>
    </div>
  );
});

InvestmentTypeSelector.displayName = 'InvestmentTypeSelector';

export default InvestmentTypeSelector;
