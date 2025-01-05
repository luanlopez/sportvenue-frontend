'use client';

import { WeeklySchedule } from "@/types/courts";

interface WeeklyScheduleDisplayProps {
  schedule: WeeklySchedule;
}

const DAYS = {
  monday: 'Segunda',
  tuesday: 'Terça',
  wednesday: 'Quarta',
  thursday: 'Quinta',
  friday: 'Sexta',
  saturday: 'Sábado',
  sunday: 'Domingo'
} as const;

export function WeeklyScheduleDisplay({ schedule }: WeeklyScheduleDisplayProps) {
  return (
    <div className="space-y-4">
      {Object.entries(DAYS).map(([day, label]) => (
        <div key={day} className="border-b border-gray-200 pb-4 last:border-0">
          <h4 className="text-sm font-medium text-gray-700 mb-2">{label}</h4>
          <div className="flex flex-wrap gap-2">
            {schedule[day as keyof WeeklySchedule].length > 0 ? (
              schedule[day as keyof WeeklySchedule].map((hour) => (
                <span
                  key={hour}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm"
                >
                  {hour}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">Fechado</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 