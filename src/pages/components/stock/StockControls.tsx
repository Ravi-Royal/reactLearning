import React from 'react';

interface StockControlsProps {
  onUpdatePrices: () => void;
  onRefreshData: () => void;
  updatingPrices: boolean;
}

/**
 * Component for stock action controls (buttons)
 */
const StockControls: React.FC<StockControlsProps> = ({
  onUpdatePrices,
  onRefreshData,
  updatingPrices
}) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onUpdatePrices}
        disabled={updatingPrices}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {updatingPrices ? 'Updating...' : 'Update Prices'}
      </button>
      <button
        onClick={onRefreshData}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh Data
      </button>
    </div>
  );
};

export default StockControls;