/**
 * Average Calculator Type Definitions
 */

export interface CalculationResult {
  newAvgPrice: number | null;
  requiredQuantity: number | null;
}

export type CalculationMode = 'purchase' | 'target';
export type InputMode = 'price' | 'total';
