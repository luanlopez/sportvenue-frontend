"use client";

import { useEffect, useState } from "react";
import { showToast } from "@/components/ui/Toast";
import { reservationService } from "@/services/reservations";
import { CreateReservationDTO } from "@/dtos/CreateReservationDTO";
import { Court } from "@/services/courts";
import { WeeklySchedule } from "@/types/courts";
import { FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";

enum ReservationType {
  SINGLE = 'SINGLE',
  MONTHLY = 'MONTHLY',
}

const DAYS = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
  sunday: "Domingo",
} as const;

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  court: Court;
  weeklySchedule: WeeklySchedule;
}

export function ReservationModal({
  isOpen,
  onClose,
  court,
  weeklySchedule,
}: ReservationModalProps) {
  const [selectedDay, setSelectedDay] = useState<keyof WeeklySchedule | null>(
    null
  );
  const [selectedHour, setSelectedHour] = useState<string>("");
  const [reservationType, setReservationType] = useState<ReservationType>(ReservationType.MONTHLY);

  useEffect(() => {
    if (!isOpen) {
      setSelectedDay(null);
      setSelectedHour("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedDay || !selectedHour) {
      showToast.error("Erro", "Selecione um dia e horário para continuar");
      return;
    }

    const reservationData: CreateReservationDTO = {
      ownerId: court?.owner_id || "",
      courtId: court?._id || "",
      reservedStartTime: selectedHour,
      status: "requested",
      dayOfWeek: selectedDay,
      reservationType: reservationType,
    };

    try {
      await reservationService.createReservation(reservationData);
      showToast.success("Sucesso", "Reserva realizada com sucesso!");
      onClose();
    } catch {
      showToast.error("Erro", "Não foi possível realizar a reserva");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200] p-4">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-enter relative">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Fazer Reserva
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Quadra</h4>
              <p className="text-gray-900">{court?.name}</p>
              <p className="text-sm text-gray-500">
                {`${court?.address}, ${court?.number} - ${court?.neighborhood}, ${court?.city}`}
              </p>
              <p className="text-sm font-semibold text-[#1345BA] mt-1">
                R$ {court?.pricePerHour?.toFixed(2) || 0} por hora
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Selecione o Dia
              </label>
              <select
                value={selectedDay || ""}
                onChange={(e) => {
                  setSelectedDay(e.target.value as keyof WeeklySchedule);
                  setSelectedHour("");
                }}
                className="w-full px-4 py-2 rounded-lg border text-gray-500 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1345BA] focus:border-[#1345BA]"
              >
                <option value="">Selecione um dia</option>
                {Object.entries(DAYS).map(([day, label]) => (
                  <option key={day} value={day}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {selectedDay && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Selecione o Horário
                </label>
                <select
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border text-gray-500 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1345BA] focus:border-[#1345BA]"
                >
                  <option value="">Selecione um horário</option>
                  {weeklySchedule[selectedDay].map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="flex items-center text-sm font-medium text-gray-500 mb-3">
                <FaCalendarAlt className="w-4 h-4 mr-2" />
                Tipo de Reserva
              </label>
              <div className="grid grid-cols-1 gap-2">
                {/* Temporarily commented out - Avulso option
                <button
                  type="button"
                  onClick={() => setReservationType(ReservationType.SINGLE)}
                  className={`
                    px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-200
                    flex items-center justify-center gap-2
                    ${reservationType === ReservationType.SINGLE
                      ? "bg-[#1345BA] text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  <FaClock className="w-4 h-4" />
                  Avulso
                </button>
                */}
                <button
                  type="button"
                  onClick={() => setReservationType(ReservationType.MONTHLY)}
                  className={`
                    px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-200
                    flex items-center justify-center gap-2
                    ${reservationType === ReservationType.MONTHLY
                      ? "bg-[#1345BA] text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  <FaCalendarAlt className="w-4 h-4" />
                  Mensal
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <div className="flex items-center text-gray-600">
                <FaMoneyBillWave className="w-5 h-5 mr-2" />
                <span>
                  Valor
                </span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                R$ {court?.pricePerHour?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedDay || !selectedHour}
            className="flex-1 px-4 py-2 bg-[#1345BA] text-white rounded-lg hover:bg-[#0A3B8A] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1345BA] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  );
}
