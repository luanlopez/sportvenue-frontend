"use client";

import { useEffect, useState } from "react";
import { showToast } from "@/components/ui/Toast";
import { reservationService } from "@/services/reservations";
import { courtService } from "@/services/courts";
import { CreateReservationDTO } from "@/dtos/CreateReservationDTO";
import { Reservation } from "@/services/reservations";
import { Court } from "@/services/courts";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  courtId: string;
  onApprove?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  reservation?: Reservation;
  isUserView?: boolean;
}

export function ReservationModal({
  isOpen,
  onClose,
  courtId,
}: ReservationModalProps) {
  const [court, setCourt] = useState<Court | null>(null);
  const [selectedHour, setSelectedHour] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      const fetchCourtDetails = async () => {
        try {
          const courtDetails = await courtService.getCourtById(courtId);
          setCourt(courtDetails);
        } catch {
          showToast.error(
            "Erro",
            "Não foi possível carregar os detalhes da quadra"
          );
        }
      };

      fetchCourtDetails();
    }
  }, [isOpen, courtId]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedHour) {
      showToast.error("Erro", "Selecione um horário para continuar");
      return;
    }

    const reservedStartTime = `${selectedHour}`;

    const reservationData: CreateReservationDTO = {
      ownerId: court?.owner_id || "",
      courtId: court?._id || "",
      reservedStartTime: reservedStartTime,
      status: "requested",
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
              <p className="text-sm font-semibold text-primary-600 mt-1">
                R$ {court?.price_per_hour?.toFixed(2) || 0} por hora
              </p>
            </div>

            <div>
              <label
                htmlFor="hour"
                className="block text-sm font-medium text-gray-500 mb-2"
              >
                Selecione o Horário
              </label>
              <select
                id="hour"
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
                className={`
                  w-full px-4 py-2 rounded-lg border
                  ${selectedHour ? "border-primary-500" : "border-gray-200"}
                  focus:outline-none focus:ring-2 focus:ring-primary-500
                  transition-colors
                `}
              >
                <option value="">Selecione um horário</option>
                {court?.availableHours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>

            {selectedHour && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Resumo da Reserva
                </h4>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Horário selecionado:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedHour}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Valor total:</span>
                  <span className="font-semibold text-primary-600">
                    R$ {court?.price_per_hour?.toFixed(2) || 0}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 rounded-lg
              hover:bg-gray-100 transition-colors duration-300
              focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedHour}
            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg
              hover:bg-primary-600 transition-colors duration-300
              focus:outline-none focus:ring-2 focus:ring-primary-500
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  );
}
