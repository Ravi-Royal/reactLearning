import { memo } from 'react';
import type { SelectionItem } from './types';

interface ModalItemProps<T extends SelectionItem> {
  item: T;
  getCategoryColor: (category: string) => string;
  onSelect: (item: T) => void;
}

export const ModalItem = memo(<T extends SelectionItem>({ item, getCategoryColor, onSelect }: ModalItemProps<T>) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item);
        }
      }}
      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <div>
          <span className="font-medium text-gray-800">{item.name}</span>
          {item.symbol && <div className="text-xs text-gray-500 mt-1">Symbol: {item.symbol}</div>}
        </div>
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getCategoryColor(item.category)}`}>
          {item.category}
        </span>
      </div>
      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}) as <T extends SelectionItem>(props: ModalItemProps<T>) => JSX.Element;

ModalItem.displayName = 'ModalItem';
