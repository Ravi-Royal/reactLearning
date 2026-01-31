import { useMutualFundForm } from '../hooks/useMutualFundForm';

export type MutualFundFormState = ReturnType<typeof useMutualFundForm>;

export interface InvestmentInputsProps {
  formState: MutualFundFormState;
  isResetting: boolean;
  onReset: () => void;
}

export interface InvestmentResultProps {
  result: MutualFundFormState['result'];
  formState: MutualFundFormState;
}
