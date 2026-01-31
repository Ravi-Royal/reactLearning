import React from 'react';
import { RESPONSIVE_PATTERNS } from '../../../constants/responsive.constants';
import type { PageHeaderProps } from './types';

/**
 * Standardized page header with title, optional subtitle and actions
 * Provides consistent layout for page titles across the application
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  className = '',
}) => {
  return (
    <div className={`${RESPONSIVE_PATTERNS.margin.section} ${className}`}>
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${RESPONSIVE_PATTERNS.margin.subsection} ${RESPONSIVE_PATTERNS.gap.md}`}>
        <h1 className={`${RESPONSIVE_PATTERNS.text['3xl']} font-bold text-gray-800`}>
          {title}
        </h1>
        {actions && (
          <div className={`flex flex-wrap ${RESPONSIVE_PATTERNS.gap.sm}`}>
            {actions}
          </div>
        )}
      </div>
      {subtitle && (
        <p className={`${RESPONSIVE_PATTERNS.text.base} text-gray-600`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
