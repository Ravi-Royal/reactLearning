import React from 'react';
const MyFavList: React.FC = () => {
  // Simple placeholder — show instructions and a small empty table placeholder.
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">My Fav List Stock</h2>
      <p className="text-sm text-gray-600 mb-4">This page will show your favorite stocks. Currently it's a placeholder — add favorites in the future.</p>
      <div className="p-4 bg-gray-50 rounded border border-gray-200">
        <p className="text-gray-500">No favorites yet.</p>
      </div>
    </div>
  );
};

export default MyFavList;
