interface WithdrawalSectionProps {
  swpAmount: string;
  swpPeriod: string;
  inflationRate: string;
  inflationStartFrom: 'current-year' | 'sip-start';
  onSwpAmountChange: (value: string) => void;
  onSwpPeriodChange: (value: string) => void;
  onInflationRateChange: (value: string) => void;
  onInflationStartFromChange: (value: 'current-year' | 'sip-start') => void;
}

export const WithdrawalSection = ({
  swpAmount,
  swpPeriod,
  inflationRate,
  inflationStartFrom,
  onSwpAmountChange,
  onSwpPeriodChange,
  onInflationRateChange,
  onInflationStartFromChange,
}: WithdrawalSectionProps) => {
  return (
    <div className="border-t-2 border-orange-200 pt-4 mt-4 bg-orange-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 rounded-lg">
      <h3 className="text-md font-semibold text-orange-700 mb-3">💸 Systematic Withdrawal Plan (SWP) - Optional</h3>
      <p className="text-xs text-orange-600 mb-3">Set up regular monthly withdrawals after holding period</p>

      <div className="mb-4">
        <label htmlFor="swp-amount" className="block text-sm font-medium text-orange-700 mb-2">
          Monthly SWP Amount (₹)
        </label>
        <input
          id="swp-amount"
          type="number"
          value={swpAmount}
          onChange={(e) => onSwpAmountChange(e.target.value)}
          placeholder="e.g., 20000"
          step="1"
          min="0"
          className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="swp-period" className="block text-sm font-medium text-orange-700 mb-2">
          SWP Duration (Years)
        </label>
        <input
          id="swp-period"
          type="number"
          value={swpPeriod}
          onChange={(e) => onSwpPeriodChange(e.target.value)}
          placeholder="e.g., 20"
          step="1"
          min="0"
          className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
        />
        <p className="text-xs text-orange-600 mt-1">How many years to continue monthly withdrawals</p>
      </div>

      <div className="mb-4">
        <label htmlFor="inflation-rate" className="block text-sm font-medium text-orange-700 mb-2">
          📊 Inflation Rate (%) - Optional
        </label>
        <input
          id="inflation-rate"
          type="number"
          value={inflationRate}
          onChange={(e) => onInflationRateChange(e.target.value)}
          placeholder="e.g., 6"
          step="0.1"
          min="0"
          className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
        />
        <p className="text-xs text-orange-600 mt-1">SWP amount will increase annually by this rate</p>
      </div>

      <div className="mb-4">
        <fieldset>
          <legend className="block text-sm font-medium text-orange-700 mb-2">Inflation Calculation Start From</legend>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="current-year"
                checked={inflationStartFrom === 'current-year'}
                onChange={(e) => onInflationStartFromChange(e.target.value as 'current-year' | 'sip-start')}
                className="mr-2"
              />
              <span className="text-sm">Current Year (SWP Start)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="sip-start"
                checked={inflationStartFrom === 'sip-start'}
                onChange={(e) => onInflationStartFromChange(e.target.value as 'current-year' | 'sip-start')}
                className="mr-2"
              />
              <span className="text-sm">SIP Start Year</span>
            </label>
          </div>
        </fieldset>
        <p className="text-xs text-orange-600 mt-1">
          Choose when to start calculating inflation: from when SWP begins or from when SIP investment started
        </p>
      </div>
    </div>
  );
};
