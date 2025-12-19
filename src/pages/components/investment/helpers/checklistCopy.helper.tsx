interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: string;
}

interface CategoryGroup {
  name: string;
  items: ChecklistItem[];
  checkedCount: number;
}

/**
 * Copies a specific category of checklist items to clipboard
 */
export const copyChecklistCategory = (
  title: string,
  category: string,
  items: ChecklistItem[],
): void => {
  const categoryItems = items.filter(item => item.category === category);
  const checkedCount = categoryItems.filter(item => item.checked).length;

  const text = `${title} - ${category}\n\n` +
    categoryItems.map(item => `${item.checked ? '\u2713' : '\u2610'} ${item.label}`).join('\n') +
    `\n\nTotal: ${checkedCount}/${categoryItems.length} completed`;

  navigator.clipboard.writeText(text).then(() => {
    console.warn('Checklist copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy:', err);
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
    text += group.items.map(item => `${item.checked ? '\u2713' : '\u2610'} ${item.label}`).join('\n');
    if (index < categoryGroups.length - 1) {
      text += '\n\n';
    }
  });

  text += `\n\nTotal: ${totalChecked}/${totalItems} completed`;

  navigator.clipboard.writeText(text).then(() => {
    console.warn('All checklist items copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
};

/**
 * Renders a copy button SVG icon
 */
export const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

/**
 * Renders a large copy button for headers
 */
export const CopyAllIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
