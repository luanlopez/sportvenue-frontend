"use client";

import { IoClose } from "react-icons/io5";
import { FaWhatsapp, FaHistory } from "react-icons/fa";
import Image from "next/image";
import { showToast } from "@/components/ui/Toast";
import { User as UserBase } from "@/services/reservations";
import { useRouter } from "next/navigation";
import { encryptId } from "@/lib/utils";

interface User extends UserBase {
  picture?: string;
}

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: string;
  courtName: string;
  courtAddress: string;
  price: number;
  reservedStartTime: string;
  status: "requested" | "approved" | "rejected";
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
  onReject,
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
    window.open(whatsappLink, "_blank");
  };

  const handleViewBillingHistory = () => {
    router.push(`/bookings/billing-history/${encryptId(reservationId)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200] p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
              Detalhes da Reserva
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="mb-4 sm:mb-6">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Informações da Quadra
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2 shadow-sm">
              <div className="text-base sm:text-lg font-bold text-black break-words">
                {courtName}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 break-words">
                {courtAddress}
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 mt-2">
                <span className="text-xs sm:text-sm text-gray-700">
                  Valor:{" "}
                  <span className="font-semibold text-black">
                    R$ {price.toFixed(2)}
                  </span>
                </span>
                <span className="text-xs sm:text-sm text-gray-700">
                  Tipo:{" "}
                  <span className="font-semibold text-black">
                    {reservationType === "MONTHLY" ? "Mensal" : "Avulso"}
                  </span>
                </span>
                <span className="text-xs sm:text-sm text-gray-700">
                  Data/Hora:{" "}
                  <span className="font-semibold text-black">
                    {reservedStartTime}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs sm:text-sm text-gray-700">Status:</span>
                <span
                  className={`
                  px-2 sm:px-3 py-1 text-xs font-bold rounded-full
                  ${
                    status === "requested"
                      ? "bg-warning-50 text-white"
                      : status === "approved"
                      ? "bg-success-50 text-white"
                      : "bg-error-50 text-white"
                  }
                `}
                >
                  {statusTranslations[status]}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Informações do Usuário
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  {user?.picture ? (
                    <Image
                      src={user.picture}
                      alt={user.firstName || "Usuário"}
                      width={48}
                      height={48}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 flex items-center justify-center text-sm sm:text-base font-bold text-white shadow-sm">
                      {user?.firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                  <div className="text-black">
                    <span className="font-semibold text-xs sm:text-sm">Nome:</span>
                    <div className="text-xs sm:text-sm break-words">
                      {user?.firstName} {user?.lastName}
                    </div>
                  </div>
                  <div className="text-black">
                    <span className="font-semibold text-xs sm:text-sm">Email:</span>
                    <div className="text-xs sm:text-sm break-words">
                      {user?.email}
                    </div>
                  </div>
                  <div className="text-black">
                    <span className="font-semibold text-xs sm:text-sm">Telefone:</span>
                    <div className="text-xs sm:text-sm break-words">
                      {user?.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
                  
          <div className="flex flex-col gap-2 sm:gap-3">
            {onApprove && (
              <button
                onClick={handleWhatsAppClick}
                className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 text-primary-50 border border-primary-50 bg-white rounded-lg font-semibold hover:bg-primary-50 hover:text-white transition text-sm sm:text-base"
              >
                <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
                Conversar no WhatsApp
              </button>
            )}
            
            {status === "approved" && (
              <button
                onClick={handleViewBillingHistory}
                className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 text-white rounded-lg bg-primary-50 hover:bg-primary-100 font-semibold transition text-sm sm:text-base"
              >
                <FaHistory className="w-4 h-4 sm:w-5 sm:h-5" />
                Ver Histórico de Cobrança
              </button>
            )}
            
            {(onApprove || onReject) && (
              <div className="flex gap-2 mt-2">
                {onApprove && (
                  <button
                    onClick={handleApprove}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 text-white rounded-lg bg-primary-50 hover:bg-primary-100 font-semibold transition text-sm sm:text-base"
                  >
                    Aprovar
                  </button>
                )}
                {onReject && (
                  <button
                    onClick={handleReject}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 text-white rounded-lg bg-error-50 hover:bg-error-50/80 font-semibold transition text-sm sm:text-base"
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
