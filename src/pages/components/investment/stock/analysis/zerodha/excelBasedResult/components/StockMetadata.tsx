import React from 'react';

interface StockMetadataProps {
  totalRecords: number;
  lastUpdated: string | null;
  lastPriceUpdate: string | null;
}

/**
 * Component for displaying stock data metadata (timestamps, record count)
 */
const StockMetadata: React.FC<StockMetadataProps> = ({
  totalRecords,
  lastUpdated,
  lastPriceUpdate,
}) => {
  return (
    <div className="mb-4 space-y-1 text-xs sm:text-sm">
      <p className="text-gray-600">Total Records: <span className="font-semibold">{totalRecords}</span></p>
      {lastUpdated && (
        <p className="text-gray-600">
          Data Last Updated: <span className="font-medium">{new Date(lastUpdated).toLocaleString()}</span>
        </p>
      )}
      {lastPriceUpdate && (
        <p className="text-gray-600">
          Prices Last Updated: <span className="font-medium">{new Date(lastPriceUpdate).toLocaleString()}</span>
        </p>
      )}
    </div>
  );
};

export default StockMetadata;