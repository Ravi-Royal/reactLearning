import React from 'react';

interface ProgressBarProps {
  label?: string;
  completed: number;
  total: number;
  colorClass?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label = 'Progress', completed, total, colorClass = 'bg-blue-500' }) => {
  const percent = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-blue-800">{label}:</span>
        <span className="text-sm font-bold text-blue-600">{completed}/{total} completed</span>
      </div>
      <div className="w-full bg-blue-100 rounded-full h-3">
        <div
          className={`${colorClass} h-3 rounded-full transition-all duration-300`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
