"use client";

import { CalendarIcon, FunnelIcon } from "@heroicons/react/24/outline";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  statusFilter: string;
  dateFilter: string;
  onStatusChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

const statusOptions: FilterOption[] = [
  { value: "all", label: "Todos os status" },
  { value: "completed", label: "Pagos" },
  { value: "pending", label: "Aguardando" },
  { value: "failed", label: "Falhos" },
];

const dateOptions: FilterOption[] = [
  { value: "today", label: "Hoje" },
  { value: "week", label: "Última semana" },
  { value: "month", label: "Último mês" },
  { value: "year", label: "Último ano" },
];

export function FilterBar({ 
  statusFilter, 
  dateFilter, 
  onStatusChange, 
  onDateChange 
}: FilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <FunnelIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Status</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${statusFilter === option.value
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Período</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {dateOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onDateChange(option.value)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${dateFilter === option.value
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 