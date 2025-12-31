import React from 'react';
import Breadcrumbs from '../../../../navigation/Breadcrumbs';

const MyFavList: React.FC = () => {
  // Simple placeholder — show instructions and a small empty table placeholder.
  return (
    <div className="p-4 sm:p-6">
      <Breadcrumbs />
      <h2 className="text-lg sm:text-xl font-bold mb-2">My Fav List Stock</h2>
      <p className="text-xs sm:text-sm text-gray-600 mb-4">This page will show your favorite stocks. Currently it's a placeholder — add favorites in the future.</p>
      <div className="p-3 sm:p-4 bg-gray-50 rounded border border-gray-200">
        <p className="text-sm sm:text-base text-gray-500">No favorites yet.</p>
      </div>
    </div>
  );
};

export default MyFavList;
