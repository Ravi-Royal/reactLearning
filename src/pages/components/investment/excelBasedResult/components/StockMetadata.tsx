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
  lastPriceUpdate
}) => {
  return (
    <div className="mb-4 space-y-1">
      <p className="text-gray-600">Total Records: {totalRecords}</p>
      {lastUpdated && (
        <p className="text-gray-600 text-sm">
          Data Last Updated: {new Date(lastUpdated).toLocaleString()}
        </p>
      )}
      {lastPriceUpdate && (
        <p className="text-gray-600 text-sm">
          Prices Last Updated: {new Date(lastPriceUpdate).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default StockMetadata;