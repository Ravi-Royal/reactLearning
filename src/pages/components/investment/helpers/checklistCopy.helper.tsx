import { logSuccess, logger } from '@utils/logger';
import { toast } from '@utils/toast';
import type { ChecklistItem, CategoryGroup } from './types/checklist.types';

/**
 * Copies a specific category of checklist items to clipboard
 */
export const copyChecklistCategory = (title: string, category: string, items: ChecklistItem[]): void => {
  const categoryItems = items.filter((item) => item.category === category);
  const checkedCount = categoryItems.filter((item) => item.checked).length;

  const text =
    `${title} - ${category}\n\n` +
    categoryItems.map((item) => `${item.checked ? '\u2713' : '\u2610'} ${item.label}`).join('\n') +
    `\n\nTotal: ${checkedCount}/${categoryItems.length} completed`;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      logSuccess('Checklist copied to clipboard!');
      toast.success('Checklist copied to clipboard!');
    })
    .catch((err) => {
      logger.error('Failed to copy:', err);
      toast.error('Failed to copy checklist');
    });
};

/**
 * Copies all checklist items grouped by categories to clipboard
 */
export const copyAllChecklistItems = (
  title: string,
  categoryGroups: CategoryGroup[],
  totalChecked: number,
  totalItems: number,
): void => {
  let text = `${title}\n\n`;

  categoryGroups.forEach((group, index) => {
    text += `${group.name} (${group.checkedCount}/${group.items.length}):\n`;
    text += group.items.map((item) => `${item.checked ? '\u2713' : '\u2610'} ${item.label}`).join('\n');
    if (index < categoryGroups.length - 1) {
      text += '\n\n';
    }
  });

  text += `\n\nTotal: ${totalChecked}/${totalItems} completed`;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      logSuccess('All checklist items copied to clipboard!');
      toast.success('All checklist items copied!');
    })
    .catch((err) => {
      logger.error('Failed to copy:', err);
      toast.error('Failed to copy checklist');
    });
};
