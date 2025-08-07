"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { reservationService } from "@/services/reservations";
import { ApprovalModal } from "@/components/ui/ApprovalModal";
import { Pagination } from "@/components/ui/Pagination";
import { showToast } from "@/components/ui/Toast";
import { Reservation } from "@/services/reservations";
import { FaMapMarkerAlt, FaClock, FaMoneyBillWave } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Image from "next/image";

const ITEMS_PER_PAGE = 6;

const statusStyles = {
  requested: {
    bg: "bg-warning-50",
    text: "text-secondary-50",
    label: "Pendente",
  },
  approved: {
    bg: "bg-success-50",
    text: "text-secondary-50",
    label: "Aprovado",
  },
  rejected: {
    bg: "bg-error-50",
    text: "text-secondary-50",
    label: "Reprovado",
  },
  cancelled: {
    bg: "bg-error-50",
    text: "text-secondary-50",
    label: "Cancelado",
  },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Bookings() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["reservations", user?.userType, currentPage],
    queryFn: async () => {
      if (!user) return null;

      return user.userType === "HOUSE_OWNER"
        ? reservationService.getOwnerReservations(currentPage, ITEMS_PER_PAGE)
        : reservationService.getUserReservations(currentPage, ITEMS_PER_PAGE);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => reservationService.approveReservation(id),
    onSuccess: () => {
      showToast.success("Sucesso", "Reserva aprovada com sucesso!");
      setIsApprovalModalOpen(false);
      refetch();
    },
    onError: () => {
      showToast.error("Erro", "Não foi possível aprovar a reserva");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => reservationService.rejectReservation(id),
    onSuccess: () => {
      showToast.success("Sucesso", "Reserva reprovada com sucesso!");
      setIsApprovalModalOpen(false);
      refetch();
    },
    onError: () => {
      showToast.error("Erro", "Não foi possível rejeitar a reserva");
    },
  });

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex flex-col items-start">
          <h1 className="text-3xl font-bold text-slate-900">Minhas Reservas</h1>
          <p className="mt-2 text-base text-slate-500">Veja o histórico e o status das suas reservas de quadra.</p>
        </div>

        {data?.data && data.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.data.map((reservation) => (
              <div
                key={reservation?._id}
                className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 rounded-lg overflow-hidden">
                  {reservation.courtId.images?.[0] ? (
                    <Image
                      src={reservation.courtId.images[0]}
                      alt={reservation.courtId.name}
                      className="w-full h-full object-cover"
                      width={1000}
                      height={1000}
                    />
                  ) : (
                    <div className="w-full h-full bg-tertiary-500/50 flex flex-col items-center justify-center">
                      <IoImageOutline className="w-12 h-12 text-gray-400" />
                      <span className="text-sm text-gray-400 mt-2">
                        Sem imagem disponível
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-black">
                    {reservation.courtId.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[reservation.status].bg} ${statusStyles[reservation.status].text}`}>
                      {statusStyles[reservation.status].label}
                    </span>
                  </div>
                  <div className="flex items-center text-black text-sm gap-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-black" />
                    {reservation.courtId.address}, {reservation.courtId.number}
                  </div>
                  <div className="flex items-center text-black text-sm gap-2">
                    <FaClock className="w-4 h-4 text-black" />
                    {formatDate(reservation.createdAt)}
                  </div>
                  <div className="flex items-center text-black text-sm gap-2">
                    <FaMoneyBillWave className="w-4 h-4 text-black" />
                    R$ {reservation?.courtId?.pricePerHour.toFixed(2)}
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setIsApprovalModalOpen(true);
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-black bg-white text-black font-bold hover:bg-gray-100 transition"
                    >
                      {reservation.status === "requested"
                        ? "Ver Detalhes"
                        : "Visualizar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-8 text-primary-500">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <p>Nenhuma reserva encontrada.</p>
            )}
          </div>
        )}

        {data && data.total > ITEMS_PER_PAGE && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(data.total / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {selectedReservation && (
        <ApprovalModal
          isOpen={isApprovalModalOpen}
          onClose={() => setIsApprovalModalOpen(false)}
          reservationId={selectedReservation._id}
          courtName={selectedReservation.courtId.name}
          courtAddress={`${selectedReservation.courtId.address}, ${selectedReservation.courtId.number} - ${selectedReservation.courtId.neighborhood}, ${selectedReservation.courtId.city}`}
          price={selectedReservation.courtId.pricePerHour}
          reservedStartTime={selectedReservation.reservedStartTime}
          reservationType={selectedReservation.reservationType}
          status={
            selectedReservation.status as "requested" | "approved" | "rejected"
          }
          user={selectedReservation.userId}
          onApprove={
            user?.userType === "HOUSE_OWNER" &&
            selectedReservation.status === "requested"
              ? approveMutation.mutate
              : undefined
          }
          onReject={
            user?.userType === "HOUSE_OWNER" &&
            selectedReservation.status === "requested"
              ? rejectMutation.mutate
              : undefined
          }
        />
      )}
    </div>
  );
}
