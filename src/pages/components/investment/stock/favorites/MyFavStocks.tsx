import React from 'react';
import Breadcrumbs from '@pages/navigation/Breadcrumbs';
import { RESPONSIVE_PATTERNS } from '@constants/responsive.constants';

const MyFavList: React.FC = () => {
  // Simple placeholder — show instructions and a small empty table placeholder.
  return (
    <div className={RESPONSIVE_PATTERNS.padding.cardLg}>
      <Breadcrumbs />
      <h2 className={`${RESPONSIVE_PATTERNS.text.xl} font-bold ${RESPONSIVE_PATTERNS.margin.element}`}>
        My Fav List Stock
      </h2>
      <p className={`${RESPONSIVE_PATTERNS.text.sm} text-gray-600 mb-4`}>
        This page will show your favorite stocks. Currently it's a placeholder — add favorites in the future.
      </p>
      <div className={`${RESPONSIVE_PATTERNS.padding.card} bg-gray-50 rounded border border-gray-200`}>
        <p className={`${RESPONSIVE_PATTERNS.text.base} text-gray-500`}>No favorites yet.</p>
      </div>
    </div>
  );
};

export default MyFavList;
