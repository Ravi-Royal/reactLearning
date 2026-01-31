import { Button } from '@components/common';
import { CopyIcon } from '@components/investment/helpers/CopyIcons';

interface SectionHeaderProps {
  title: string;
  checked: number;
  total: number;
  onCopy: () => void;
  colorClass: string;
}

export function SectionHeader({ title, checked, total, onCopy, colorClass }: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between border-b pb-2 ${colorClass}`}>
      <h3 className={`text-lg font-semibold ${colorClass.includes('purple') ? 'text-purple-800' : 'text-blue-800'}`}>
        {title} ({checked}/{total})
      </h3>
      <Button onClick={onCopy} variant="secondary" size="sm" icon={<CopyIcon />}>
        Copy
      </Button>
    </div>
  );
}
