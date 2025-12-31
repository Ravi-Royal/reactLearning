import { Button } from './Button';

interface SelectionItem {
  name: string;
  category: string;
  symbol?: string;
}

interface SelectionModalProps<T extends SelectionItem> {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: T) => void;
  items: T[];
  title: string;
  getCategoryColor?: (category: string) => string;
}

const defaultGetCategoryColor = (category: string): string => {
  switch (category) {
  case 'Good Stock':
  case 'Good Bond':
    return 'bg-green-100 text-green-700';
  case 'Check Stock':
  case 'Check Bond':
    return 'bg-yellow-100 text-yellow-700';
  default:
    return 'bg-red-100 text-red-700';
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
              aria-label="Close modal"
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
              <div
                key={index}
                onClick={() => onSelect(item)}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <span className="font-medium text-gray-800">{item.name}</span>
                    {item.symbol && (
                      <div className="text-xs text-gray-500 mt-1">
                        Symbol: {item.symbol}
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
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
