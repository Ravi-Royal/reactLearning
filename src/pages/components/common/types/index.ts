/**
 * Common Component Type Definitions
 */

import type { ReactNode } from 'react';

export interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  size?: 'xs' | 'sm' | 'md';
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface IconButtonProps {
  onClick: () => void;
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'xs' | 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  'aria-label': string;
}

export interface CategoryBadgeProps {
  category: string;
  variant?: 'default' | 'compact';
  className?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export interface SelectionItem {
  name: string;
  category: string;
  symbol?: string;
}

export interface SelectionModalProps<T extends SelectionItem> {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: T) => void;
  items: T[];
  title: string;
  getCategoryColor?: (category: string) => string;
}
