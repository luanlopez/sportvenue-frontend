"use client";

import { IoClose } from "react-icons/io5";
import { FaWhatsapp, FaHistory } from "react-icons/fa";
import { showToast } from "@/components/ui/Toast";
import { User } from "@/services/reservations";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  
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

  const handleViewBillingHistory = () => {
    router.push(`/bookings/billing-history/${reservationId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-enter border border-primary-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-primary-700">Detalhes da Reserva</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          {/* Quadra Info */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-primary-500 mb-2 uppercase tracking-wide">Informações da Quadra</h4>
            <div className="bg-primary-50 rounded-xl p-4 space-y-2 shadow-sm">
              <div className="text-lg font-bold text-primary-700">{courtName}</div>
              <div className="text-sm text-primary-600">{courtAddress}</div>
              <div className="flex flex-wrap gap-4 mt-2">
                <span className="text-sm text-gray-700">Valor: <span className="font-semibold text-primary-700">R$ {price.toFixed(2)}</span></span>
                <span className="text-sm text-gray-700">Tipo: <span className="font-semibold">{reservationType === "MONTHLY" ? "Mensal" : "Avulso"}</span></span>
                <span className="text-sm text-gray-700">Data/Hora: <span className="font-semibold">{reservedStartTime}</span></span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-700">Status:</span>
                <span className={`
                  px-3 py-1 text-xs font-bold rounded-full
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

          {/* User Info */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-primary-500 mb-2 uppercase tracking-wide">Informações do Usuário</h4>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 shadow-sm">
              <div className="text-gray-900"><span className="font-semibold">Nome:</span> {user?.firstName} {user?.lastName}</div>
              <div className="text-gray-900"><span className="font-semibold">Email:</span> {user?.email}</div>
              <div className="text-gray-900"><span className="font-semibold">Telefone:</span> {user?.phone}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {onApprove && (
              <button
                onClick={handleWhatsAppClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg
                  bg-green-500 hover:bg-green-600
                  transition-all duration-300 font-semibold shadow"
              >
                <FaWhatsapp className="w-5 h-5" />
                Conversar no WhatsApp
              </button>
            )}
            {status === 'approved' && <button
              onClick={handleViewBillingHistory}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg
                bg-primary-500 hover:bg-primary-600
                transition-all duration-300 font-semibold shadow"
            >
              <FaHistory className="w-5 h-5" />
              Ver Histórico de Cobrança
            </button>}
            {(onApprove || onReject) && (
              <div className="flex gap-2 mt-2">
                {onApprove && (
                  <button
                    onClick={handleApprove}
                    className="w-full px-4 py-2 text-white rounded-lg
                      bg-gradient-to-r from-primary-600 to-primary-500
                      hover:from-primary-700 hover:to-primary-600
                      font-semibold shadow"
                  >
                    Aprovar
                  </button>
                )}
                {onReject && (
                  <button
                    onClick={handleReject}
                    className="w-full px-4 py-2 text-primary-500 rounded-lg
                      border-2 border-primary-500
                      hover:bg-primary-50
                      font-semibold shadow"
                  >
                    Rejeitar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 