"use client";

import { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { FaClock, FaMoneyBillWave } from "react-icons/fa";
import { showToast } from "@/components/ui/Toast";

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  courtName: string;
  price: number;
}

export function BookingConfirmationModal({ 
  isOpen, 
  onClose, 
  courtName,
  price 
}: BookingConfirmationModalProps) {
  const [selectedTime, setSelectedTime] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedTime) {
      showToast.error("Erro", "Por favor, selecione um horário");
      return;
    }

    showToast.success("Sucesso", "Reserva realizada com sucesso!");
    onClose();
  };

  // Horários disponíveis (mock)
  const availableTimes = [
    "08:00", "09:00", "10:00", "11:00",
    "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-enter">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Confirmar Reserva
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Quadra</h4>
              <p className="text-gray-900">{courtName}</p>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-500 mb-3">
                <FaClock className="w-4 h-4 mr-2" />
                Horários Disponíveis Hoje
              </label>
              <div className="grid grid-cols-4 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors
                      ${selectedTime === time
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <div className="flex items-center text-gray-600">
                <FaMoneyBillWave className="w-5 h-5 mr-2" />
                <span>Valor</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(price)}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <button
            onClick={handleConfirm}
            className="w-full px-4 py-2 text-white rounded-lg
              bg-primary-500 hover:bg-primary-600
              transition-colors duration-300
              focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  );
} 