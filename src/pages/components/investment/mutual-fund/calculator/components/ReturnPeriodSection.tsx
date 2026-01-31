import { MUTUAL_FUND_CALCULATOR_TEXTS } from '../constants/mutualFundCalculator.constants';

interface ReturnPeriodSectionProps {
  annualReturn: string;
  investmentPeriod: string;
  onAnnualReturnChange: (value: string) => void;
  onInvestmentPeriodChange: (value: string) => void;
}

export const ReturnPeriodSection = ({
  annualReturn,
  investmentPeriod,
  onAnnualReturnChange,
  onInvestmentPeriodChange,
}: ReturnPeriodSectionProps) => {
  return (
    <>
      <div className="mb-4">
        <label htmlFor="annual-return" className="block text-sm font-medium text-purple-700 mb-2">
          📈 Expected Annual Return (%)
        </label>
        <input
          id="annual-return"
          type="number"
          value={annualReturn}
          onChange={(e) => onAnnualReturnChange(e.target.value)}
          placeholder={MUTUAL_FUND_CALCULATOR_TEXTS.COMMON_INPUTS.ANNUAL_RETURN_PLACEHOLDER}
          step="1"
          min="0"
          className="w-full px-3 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="investment-period" className="block text-sm font-medium text-purple-700 mb-2">
          ⏱️ Investment Period (Years)
        </label>
        <input
          id="investment-period"
          type="number"
          value={investmentPeriod}
          onChange={(e) => onInvestmentPeriodChange(e.target.value)}
          placeholder={MUTUAL_FUND_CALCULATOR_TEXTS.COMMON_INPUTS.INVESTMENT_PERIOD_PLACEHOLDER}
          step="1"
          min="0"
          className="w-full px-3 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        />
      </div>
    </>
  );
};
