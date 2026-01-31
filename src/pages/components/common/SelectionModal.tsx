import { Button } from './Button';
import { ModalItem } from './ModalItem';
import type { SelectionItem, SelectionModalProps } from './types';
import { MODAL_ARIA_LABELS, MODAL_CATEGORY_COLORS, MODAL_CATEGORY_NAMES } from './constants/modal.constants';

const defaultGetCategoryColor = (category: string): string => {
  switch (category) {
    case MODAL_CATEGORY_NAMES.GOOD_STOCK:
    case MODAL_CATEGORY_NAMES.GOOD_BOND:
      return MODAL_CATEGORY_COLORS.GOOD_STOCK;
    case MODAL_CATEGORY_NAMES.CHECK_STOCK:
    case MODAL_CATEGORY_NAMES.CHECK_BOND:
      return MODAL_CATEGORY_COLORS.CHECK_STOCK;
    default:
      return MODAL_CATEGORY_COLORS.DEFAULT;
  }
};

export function SelectionModal<T extends SelectionItem>({
  isOpen,
  onClose,
  onSelect,
  items,
  title,
  getCategoryColor = defaultGetCategoryColor,
}: SelectionModalProps<T>) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden border border-gray-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200 group"
              aria-label={MODAL_ARIA_LABELS.CLOSE}
            >
              <svg
                className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {items.map((item, index) => (
              <ModalItem key={index} item={item} getCategoryColor={getCategoryColor} onSelect={onSelect} />
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <Button onClick={onClose} variant="secondary">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
