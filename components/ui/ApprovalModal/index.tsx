"use client";

import { IoClose } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { showToast } from "@/components/ui/Toast";
import { User } from "@/services/reservations";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: string;
  courtName: string;
  courtAddress: string;
  price: number;
  reservedStartTime: string;
  status: 'requested' | 'approved' | 'rejected';
  user: User;
  reservationType: "SINGLE" | "MONTHLY";
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const statusTranslations: { [key: string]: string } = {
  requested: "Pendente",
  approved: "Aprovado",
  rejected: "Reprovado",
};

export function ApprovalModal({ 
  isOpen, 
  onClose, 
  reservationId, 
  courtName, 
  courtAddress, 
  price, 
  reservedStartTime, 
  status,
  user,
  reservationType,
  onApprove, 
  onReject 
}: ApprovalModalProps) {
  if (!isOpen) return null;

  const handleApprove = () => {
    if (onApprove) {
      onApprove(reservationId);
      showToast.success("Sucesso", "Reserva aprovada com sucesso!");
      onClose();
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(reservationId);
      showToast.success("Sucesso", "Reserva reprovada com sucesso!");
      onClose();
    }
  };

  const handleWhatsAppClick = () => {
    const formattedPhone = user.phone.replace(/\D/g, "");
    const whatsappLink = `https://wa.me/55${formattedPhone}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-enter">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Detalhes da Reserva
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <h4 className="text-sm font-medium text-secondary-500 mb-2">Informações da Quadra</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-lg font-semibold text-gray-900">{courtName}</p>
                <p className="text-sm text-secondary-500">{courtAddress}</p>
                <p className="text-sm text-secondary-500">
                  Valor: <span className="font-medium text-primary-500">R$ {price.toFixed(2)}</span>
                </p>
                <p className="text-sm text-secondary-500 flex flex-row gap-2">
                  Tipo de reserva:
                  <p className="font-medium text-primary-500">
                    {reservationType === "MONTHLY" ? "Mensal" : "Avulso"}
                  </p>
                </p>
                <p className="text-sm text-secondary-500">
                  Data e Hora: <span className="font-medium">
                    {reservedStartTime}
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary-500">Status:</span>
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${status === 'requested' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }
                  `}>
                    {statusTranslations[status]}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-secondary-500 mb-2">Informações do Usuário</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-gray-900">
                  <span className="font-medium">Nome:</span> {user?.firstName || 'Não informado'} {user?.lastName || 'Não informado'}
                </p>
                <p className="text-gray-900">
                  <span className="font-medium">Email:</span> {user?.email || 'Não informado'}
                </p>
                <p className="text-gray-900">
                  <span className="font-medium">Telefone:</span> {user?.phone || 'Não informado'}
                </p>
                {onApprove && (
                  <button
                    onClick={handleWhatsAppClick}
                    className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md
                      bg-green-500 hover:bg-green-600
                      transition-all duration-300 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                      shadow-md hover:shadow-lg"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    Conversar no WhatsApp
                  </button>
                )}
              </div>
            </div>
          </div>

          {(onApprove || onReject) && (
            <div className="flex justify-between space-x-3">
              {onApprove && (
                <button
                  onClick={handleApprove}
                  className="w-full px-4 py-2 text-white rounded-md
                    bg-gradient-to-r from-primary-600 to-primary-500
                    hover:from-primary-700 hover:to-primary-600
                    transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    shadow-lg hover:shadow-xl
                    disabled:opacity-70 disabled:cursor-not-allowed
                    flex items-center justify-center"
                >
                  Aprovar
                </button>
              )}
              {onReject && (
                <button
                  onClick={handleReject}
                  className="w-full px-4 py-2 text-primary-500 rounded-md
                    border-2 border-primary-500
                    hover:bg-primary-50
                    transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    shadow-lg hover:shadow-xl
                    flex items-center justify-center"
                >
                  Rejeitar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 