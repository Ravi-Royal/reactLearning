/**
 * Checklist Helper Type Definitions
 */

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: string;
}

export interface CategoryGroup {
  name: string;
  items: ChecklistItem[];
  checkedCount: number;
}
