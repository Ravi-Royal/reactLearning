import { memo } from 'react';

interface NavigationCardProps {
  name: string;
  description: string;
  icon: string;
  path: string;
  onNavigate: (path: string) => void;
}

export const NavigationCard = memo(({ name, description, icon, path, onNavigate }: NavigationCardProps) => {
  return (
    <div
      onClick={() => onNavigate(path)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNavigate(path);
        }
      }}
      role="button"
      tabIndex={0}
      className="group cursor-pointer p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl sm:text-4xl flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{name}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
});

NavigationCard.displayName = 'NavigationCard';
