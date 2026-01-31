import React from 'react';
import { 
  STOCK_CONTROLS_TITLES, 
  STOCK_CONTROLS_ARIA_LABELS, 
  STOCK_CONTROLS_BUTTON_TEXT 
} from '../constants/stockControls.constants';

interface StockControlsProps {
  onUpdatePrices: () => void;
  onRefreshData: () => void;
  onSaveData: () => void;
  updatingPrices: boolean;
}

/**
 * Component for stock action controls (buttons)
 */
const StockControls: React.FC<StockControlsProps> = ({
  onUpdatePrices,
  onRefreshData,
  onSaveData,
  updatingPrices,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <button
        onClick={onUpdatePrices}
        disabled={updatingPrices}
        title={updatingPrices ? STOCK_CONTROLS_TITLES.UPDATE_PRICES_ACTIVE : STOCK_CONTROLS_TITLES.UPDATE_PRICES_IDLE}
        aria-label={updatingPrices ? STOCK_CONTROLS_ARIA_LABELS.UPDATE_PRICES_ACTIVE : STOCK_CONTROLS_ARIA_LABELS.UPDATE_PRICES_IDLE}
        className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 whitespace-nowrap"
      >
        {updatingPrices ? STOCK_CONTROLS_BUTTON_TEXT.UPDATE_PRICES_ACTIVE : STOCK_CONTROLS_BUTTON_TEXT.UPDATE_PRICES_IDLE}
      </button>
      <button
        onClick={onRefreshData}
        title={STOCK_CONTROLS_TITLES.REFRESH_DATA}
        aria-label={STOCK_CONTROLS_ARIA_LABELS.REFRESH_DATA}
        className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
      >
        {STOCK_CONTROLS_BUTTON_TEXT.REFRESH_DATA}
      </button>
      <button
        onClick={onSaveData}
        title={STOCK_CONTROLS_TITLES.SAVE_DATA}
        aria-label={STOCK_CONTROLS_ARIA_LABELS.SAVE_DATA}
        className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-purple-500 text-white rounded hover:bg-purple-600 whitespace-nowrap"
      >
        {STOCK_CONTROLS_BUTTON_TEXT.SAVE_DATA}
      </button>
    </div>
  );
};

export default StockControls;