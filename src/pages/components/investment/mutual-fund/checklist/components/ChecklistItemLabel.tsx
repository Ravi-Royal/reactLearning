import { AiOutlineInfoCircle } from 'react-icons/ai';

interface ChecklistInfoProps {
  label: string;
  info?: string;
  checked: boolean;
}

export function ChecklistItemLabel({ label, info, checked }: ChecklistInfoProps) {
  return (
    <label
      className={`text-sm font-medium cursor-pointer flex-1 ${checked ? 'text-green-800' : 'text-gray-700'}`}
      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
    >
      {label}
      {info && (
        <span title={info} style={{ marginLeft: 4, cursor: 'pointer' }}>
          <AiOutlineInfoCircle style={{ display: 'inline', color: '#6366f1' }} />
        </span>
      )}
    </label>
  );
}
