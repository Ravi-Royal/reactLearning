interface InvestmentTypeSectionProps {
  investmentType: 'sip' | 'yearly-sip' | 'lumpsum';
  onInvestmentTypeChange: (type: 'sip' | 'yearly-sip' | 'lumpsum') => void;
}

export const InvestmentTypeSection = ({ investmentType, onInvestmentTypeChange }: InvestmentTypeSectionProps) => {
  return (
    <div className="mb-4">
      <fieldset>
        <legend className="block text-sm font-medium text-purple-700 mb-2">Investment Type</legend>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="sip"
              checked={investmentType === 'sip'}
              onChange={() => onInvestmentTypeChange('sip')}
              className="mr-2"
            />
            <span className="text-sm">SIP (Monthly)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="yearly-sip"
              checked={investmentType === 'yearly-sip'}
              onChange={() => onInvestmentTypeChange('yearly-sip')}
              className="mr-2"
            />
            <span className="text-sm">SIP (Yearly)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="lumpsum"
              checked={investmentType === 'lumpsum'}
              onChange={() => onInvestmentTypeChange('lumpsum')}
              className="mr-2"
            />
            <span className="text-sm">Lumpsum</span>
          </label>
        </div>
      </fieldset>
    </div>
  );
};
