import { useState, useMemo, useCallback } from 'react';

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: string;
}

export interface CategoryStats {
  checked: number;
  total: number;
}

export interface UseChecklistReturn {
  items: ChecklistItem[];
  setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  toggleItem: (id: string) => void;
  uncheckAll: () => void;
  uncheckCategory: (category: string) => void;
  getCategoryItems: (category: string) => ChecklistItem[];
  getCategoryStats: (category: string) => CategoryStats;
  totalChecked: number;
  totalItems: number;
}

/**
 * Reusable hook for managing checklist state and operations
 * Provides consistent checklist functionality across all checklist pages
 */
export const useChecklist = (initialItems: ChecklistItem[]): UseChecklistReturn => {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);

  const toggleItem = useCallback((id: string): void => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  }, []);

  const uncheckAll = useCallback((): void => {
    setItems((prev) => prev.map((item) => ({ ...item, checked: false })));
  }, []);

  const uncheckCategory = useCallback((category: string): void => {
    setItems((prev) => prev.map((item) => (item.category === category ? { ...item, checked: false } : item)));
  }, []);

  const getCategoryItems = useCallback(
    (category: string): ChecklistItem[] => {
      return items.filter((item) => item.category === category);
    },
    [items],
  );

  const getCategoryStats = useCallback(
    (category: string): CategoryStats => {
      const categoryItems = items.filter((item) => item.category === category);
      return {
        checked: categoryItems.filter((item) => item.checked).length,
        total: categoryItems.length,
      };
    },
    [items],
  );

  const totalChecked = useMemo(() => items.filter((item) => item.checked).length, [items]);
  const totalItems = items.length;

  return {
    items,
    setItems,
    toggleItem,
    uncheckAll,
    uncheckCategory,
    getCategoryItems,
    getCategoryStats,
    totalChecked,
    totalItems,
  };
};
