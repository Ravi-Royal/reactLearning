// Common constants used across the application
export const CHECKLIST_CATEGORIES = {
    AI: 'AI',
    PERSONAL: 'mine'
} as const;

export type ChecklistCategory = typeof CHECKLIST_CATEGORIES[keyof typeof CHECKLIST_CATEGORIES];

export interface MyBondItem {
    name: string;
    category: string;
    symbol?: string;
}

const BOND_LIST_CATEGORIES = {
    GOOD_BOND: 'Good Bond',
    CHECK_BOND: 'Check Bond',
    AVOID_BOND: 'Avoid Bond'
} as const;

export const MY_BOND_LIST: MyBondItem[] = [
    {
        name: 'Government Bond',
        category: BOND_LIST_CATEGORIES.GOOD_BOND,
        symbol: 'govbond'
    }
]