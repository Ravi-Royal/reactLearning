/**
 * Stock Profit Calculator Type Definitions
 */

export interface StockGroup {
  id: number;
  numStocks: string;
  pricePerStock: string;
  profitInputType: 'total' | 'perShare' | 'currentPrice';
  totalProfit: string;
  profitPerShare: string;
  currentPricePerShare?: string;
  age: string;
  ageUnit: 'days' | 'months';
}

export interface ProfitSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricePerStock: number;
  profitPerStock: number;
}
