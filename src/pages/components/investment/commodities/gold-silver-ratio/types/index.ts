export interface RatioAnalysis {
  ratio: number;
  recommendation: 'buy-gold' | 'buy-silver' | 'neutral';
  strength: 'strong' | 'moderate' | 'weak';
  message: string;
}

export interface PriceResult {
  g: number;
  s: number;
  source: string;
  time?: string;
}
