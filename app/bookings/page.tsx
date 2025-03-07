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
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "Pendente",
  },
  approved: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "Aprovado",
  },
  rejected: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "Reprovado",
  },
  cancelled: {
    bg: "bg-gray-100",
    text: "text-gray-800",
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
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reservations', user?.userType, currentPage],
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
    }
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
    }
  });

  return (
    <div className="min-h-screen bg-tertiary-500 py-10">
      <div className="container mx-auto px-4 py-8 max-w-7xl mt-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary-500">Minhas Reservas</h1>
          <div className="text-sm text-primary-500">
            Total de reservas: {data?.data.length}
          </div>
        </div>

        { data?.data && data.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((reservation) => (
              <div
                key={reservation?._id}
                className="bg-primary-500 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 rounded-t-2xl overflow-hidden">
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
                      <IoImageOutline className="w-12 h-12 text-primary-500" />
                      <span className="text-sm text-primary-500 mt-2">
                        Sem imagem disponível
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`
                      px-3 py-1 rounded-full text-sm font-bold
                      ${statusStyles[reservation.status].bg}
                      ${statusStyles[reservation.status].text}
                    `}
                    >
                      {statusStyles[reservation.status].label}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-tertiary-500 mb-2">
                    {reservation.courtId.name}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-tertiary-500">
                      <FaMapMarkerAlt className="w-4 h-4 mr-2 text-secondary-500" />
                      <p className="text-sm">
                        {`${reservation.courtId.address}, ${reservation.courtId.number}`}
                      </p>
                    </div>

                    <div className="flex items-center text-tertiary-500">
                      <FaClock className="w-4 h-4 mr-2 text-secondary-500" />
                      <p className="text-sm">
                        {formatDate(reservation.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center text-tertiary-500">
                      <FaMoneyBillWave className="w-4 h-4 mr-2 text-secondary-500" />
                      <p className="text-sm">
                        R$ {reservation?.courtId?.pricePerHour.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setIsApprovalModalOpen(true);
                    }}
                    className="w-full px-4 py-2 rounded-full
                      bg-secondary-500 text-primary-500
                      transition-all duration-300 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2
                      shadow-md hover:shadow-lg hover:bg-secondary-600
                      flex items-center justify-center
                      font-bold"
                  >
                    {reservation.status === "requested"
                      ? "Ver Detalhes"
                      : "Visualizar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-8 text-primary-500">
           {isLoading ? <LoadingSpinner /> : <p>Nenhuma reserva encontrada.</p>}
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
