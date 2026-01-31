import { MUTUAL_FUND_CALCULATOR_TEXTS } from '../constants/mutualFundCalculator.constants';

interface AmountInputSectionProps {
  investmentType: 'sip' | 'yearly-sip' | 'lumpsum';
  sipAmount: string;
  lumpsumAmount: string;
  onSipAmountChange: (value: string) => void;
  onLumpsumAmountChange: (value: string) => void;
}

export const AmountInputSection = ({
  investmentType,
  sipAmount,
  lumpsumAmount,
  onSipAmountChange,
  onLumpsumAmountChange,
}: AmountInputSectionProps) => {
  if (investmentType === 'sip' || investmentType === 'yearly-sip') {
    return (
      <div className="mb-4">
        <label htmlFor="sip-amount" className="block text-sm font-medium text-purple-700 mb-2">
          💵 {investmentType === 'sip' ? 'Monthly' : 'Yearly'} SIP Amount (₹)
        </label>
        <input
          id="sip-amount"
          type="number"
          value={sipAmount}
          onChange={(e) => onSipAmountChange(e.target.value)}
          placeholder={
            investmentType === 'sip'
              ? MUTUAL_FUND_CALCULATOR_TEXTS.SIP_INPUTS.MONTHLY_AMOUNT_PLACEHOLDER
              : MUTUAL_FUND_CALCULATOR_TEXTS.SIP_INPUTS.YEARLY_AMOUNT_PLACEHOLDER
          }
          step="1"
          min="0"
          className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label htmlFor="lumpsum-amount" className="block text-sm font-medium text-purple-700 mb-2">
        💰 Lumpsum Amount (₹)
      </label>
      <input
        id="lumpsum-amount"
        type="number"
        value={lumpsumAmount}
        onChange={(e) => onLumpsumAmountChange(e.target.value)}
        placeholder={MUTUAL_FUND_CALCULATOR_TEXTS.LUMPSUM_INPUTS.INVESTMENT_AMOUNT_PLACEHOLDER}
        step="1"
        min="0"
        className="w-full px-3 py-2 border-2 border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
      />
    </div>
  );
};
