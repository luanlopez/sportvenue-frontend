"use client";

interface TagSelectProps {
  value: string;
  label: string;
  isSelected: boolean;
  onChange: (value: string) => void;
}

export function TagSelect({ value, label, isSelected, onChange }: TagSelectProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`
        px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-200 ease-in-out
        ${isSelected 
          ? 'bg-primary-500 text-white shadow-sm hover:bg-primary-600' 
          : 'bg-tertiary-500 text-primary-500 hover:bg-primary-500 border border-primary-500 shadow-sm hover:text-tertiary-500'
        }
      `}
    >
      {label}
    </button>
  );
} 