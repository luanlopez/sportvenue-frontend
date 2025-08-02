"use client";

export interface TagSelectProps {
  value: string;
  label: string;
  isSelected: boolean;
  onChange: (value: string) => void;
  className?: string;
}

export function TagSelect({ value, label, isSelected, onChange, className }: TagSelectProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`px-4 py-2 rounded-full border text-sm font-medium transition ${isSelected ? 'bg-sky-500 text-white border-sky-500' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-sky-50'} ${className ?? ''}`}
    >
      {label}
    </button>
  );
} 