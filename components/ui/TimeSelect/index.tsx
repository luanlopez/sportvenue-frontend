'use client';

interface TimeSelectProps {
  value: string;
  isSelected: boolean;
  onChange: (value: string) => void;
}

export function TimeSelect({ value, isSelected, onChange }: TimeSelectProps) {
  return (
    <div
      onClick={() => onChange(value)}
      className={`
        px-3 py-2 rounded-md text-sm font-medium cursor-pointer
        transition-all duration-200 ease-in-out
        ${isSelected 
          ? 'bg-primary-500 text-white shadow-sm hover:bg-primary-600' 
          : 'bg-tertiary-500 text-primary-500 hover:bg-primary-500 border border-primary-500 shadow-sm hover:text-tertiary-500'
        }
      `}
    >
      {value}
    </div>
  );
} 