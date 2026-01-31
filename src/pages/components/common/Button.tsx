import React from 'react';
import { RESPONSIVE_PATTERNS, ANIMATIONS } from '@constants/responsive.constants';
import type { ButtonProps } from './types';

/**
 * Standardized button component with consistent responsive behavior
 * Provides unified styling and interaction patterns across the application
 */
export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  size = 'sm',
  disabled = false,
  icon,
  className = '',
  type = 'button',
}) => {
  const baseClasses = `rounded-lg ${ANIMATIONS.transition} flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`;

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:bg-gray-100',
    danger: 'bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-400',
    success: 'bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400',
    warning: 'bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-400',
    info: 'bg-cyan-500 hover:bg-cyan-600 text-white disabled:bg-gray-400',
  };

  const sizeClasses = RESPONSIVE_PATTERNS.button[size];
  const gapClass = size === 'xs' ? 'gap-1' : 'gap-1 sm:gap-2';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${gapClass} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

/**
 * Icon-only button for compact actions
 */
export const IconButton: React.FC<Omit<ButtonProps, 'children'> & { icon: React.ReactNode; ariaLabel: string }> = ({
  onClick,
  icon,
  ariaLabel,
  variant = 'secondary',
  size = 'sm',
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const baseClasses = `rounded-lg ${ANIMATIONS.transition} flex items-center justify-center cursor-pointer`;

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-orange-500 hover:bg-orange-600 text-white',
    info: 'bg-cyan-500 hover:bg-cyan-600 text-white',
  };

  const sizeClasses = size === 'xs' ? 'p-1' : size === 'sm' ? 'p-2' : 'p-3';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${className}`}
    >
      {icon}
    </button>
  );
};
