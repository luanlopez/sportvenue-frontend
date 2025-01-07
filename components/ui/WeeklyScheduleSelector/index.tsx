'use client';

import { useState } from 'react';
import { WeeklySchedule } from '@/types/courts';
import { TimeSelect } from "@/components/ui/TimeSelect";
import { TagSelect } from '../TagSelect';

interface WeeklyScheduleSelectorProps {
  value: WeeklySchedule;
  onChange: (schedule: WeeklySchedule) => void;
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

const HOURS = Array.from({ length: 24 }, (_, i) => 
  `${String(i).padStart(2, '0')}:00`
);

export function WeeklyScheduleSelector({ value, onChange }: WeeklyScheduleSelectorProps) {
  const [selectedDay, setSelectedDay] = useState<keyof WeeklySchedule>('monday');

  const handleHourToggle = (hour: string) => {
    const newSchedule = { ...value };
    const dayHours = newSchedule[selectedDay];

    if (dayHours.includes(hour)) {
      newSchedule[selectedDay] = dayHours.filter(h => h !== hour);
    } else {
      newSchedule[selectedDay] = [...dayHours, hour].sort();
    }

    onChange(newSchedule);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(DAYS).map(([day, label]) => (
          <TagSelect
            key={day}
            value={day}
            label={label}
            isSelected={selectedDay === day}
            onChange={(value) => setSelectedDay(value as keyof WeeklySchedule)}
          />
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700">
          Horários disponíveis - {DAYS[selectedDay]}
        </h4>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {HOURS.map(hour => (
          <TimeSelect
            key={hour}
            value={hour}
            isSelected={value[selectedDay].includes(hour)}
            onChange={handleHourToggle}
          />
        ))}
      </div>
    </div>
  );
} 