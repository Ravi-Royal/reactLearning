// Common constants used across the application
export const CHECKLIST_CATEGORIES = {
    AI: 'AI',
    PERSONAL: 'mine'
} as const;

export type ChecklistCategory = typeof CHECKLIST_CATEGORIES[keyof typeof CHECKLIST_CATEGORIES];