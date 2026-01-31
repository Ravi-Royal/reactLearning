import React from 'react';
import { CATEGORY_COLORS } from '../../../constants/responsive.constants';
import type { CategoryBadgeProps } from './types';

/**
 * Standardized category badge component
 * Displays category labels with consistent styling
 */
export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  variant = 'default',
  className = '',
}) => {
  const colorClass = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700';
  const sizeClass = variant === 'compact'
    ? 'px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs'
    : 'px-2 py-1 text-xs';

  return (
    <span className={`${colorClass} ${sizeClass} rounded-full font-medium inline-block ${className}`}>
      {category}
    </span>
  );
};
