import type { SortIconProps } from '../types/PercentageRecovery.types';

/**
 * SortIcon — displays ▲▼ arrows, highlighting the active direction in yellow.
 */
function SortIcon({ active, dir }: SortIconProps) {
  return (
    <span className={`ml-1 inline-flex flex-col leading-none ${active ? 'opacity-100' : 'opacity-30'}`}>
      <span className={`text-[8px] leading-none ${active && dir === 'asc' ? 'text-yellow-300' : ''}`}>▲</span>
      <span className={`text-[8px] leading-none ${active && dir === 'desc' ? 'text-yellow-300' : ''}`}>▼</span>
    </span>
  );
}

export default SortIcon;
