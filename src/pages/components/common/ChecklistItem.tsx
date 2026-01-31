import { memo } from 'react';

interface ChecklistItemProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: (id: string) => void;
}

export const ChecklistItem = memo(({ id, label, checked, onToggle }: ChecklistItemProps) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
        checked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
      role="button"
      tabIndex={0}
      onClick={() => onToggle(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(id);
        }
      }}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(id)}
          onClick={(e) => e.stopPropagation()}
          className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
        />
        <label className={`text-sm font-medium cursor-pointer flex-1 ${checked ? 'text-green-800' : 'text-gray-700'}`}>
          {label}
        </label>
        {checked && (
          <svg
            className="w-5 h-5 text-green-600 ml-auto flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </div>
  );
});

ChecklistItem.displayName = 'ChecklistItem';
