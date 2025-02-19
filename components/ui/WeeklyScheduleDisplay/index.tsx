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
        <div key={day} className="border-b border-primary-500/20 pb-4 last:border-0">
          <h4 className="text-sm font-medium text-primary-500 mb-2">{label}</h4>
          <div className="flex flex-wrap gap-2">
            {schedule[day as keyof WeeklySchedule].length > 0 ? (
              schedule[day as keyof WeeklySchedule].map((hour) => (
                <span
                  key={hour}
                  className="px-3 py-1 bg-tertiary-500 text-primary-500 rounded-md text-sm border border-primary-500 font-bold"
                >
                  {hour}
                </span>
              ))
            ) : (
              <span className="text-sm text-primary-500">Fechado</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 