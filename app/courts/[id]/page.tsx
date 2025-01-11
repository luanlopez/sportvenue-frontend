"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { courtService, AMENITY_LABELS, CATEGORY_LABELS } from "@/services/courts";
import { ReservationModal } from "@/components/ui/ReservationModal";
import { ContactModal } from "@/components/ui/ContactModal";
import { FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import { BiDumbbell } from "react-icons/bi";
import { MdSportsSoccer } from "react-icons/md";
import { useAuth } from "@/hooks/useAuth";
import { WeeklyScheduleDisplay } from "@/components/ui/WeeklyScheduleDisplay";
import { AuthRequiredModal } from "@/components/ui/AuthRequiredModal";

export default function CourtDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { data: court, isLoading } = useQuery({
    queryKey: ['court', id],
    queryFn: () => courtService.getCourtById(id as string),
    staleTime: 1000 * 60 * 5,
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!court) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Quadra não encontrada</p>
      </div>
    );
  }

  const handleReserveClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setIsReservationModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[500px] group">
        <Image
          src={court.images[0] || "/placeholder-court.jpg"}
          alt={court.name}
          fill
          className="object-cover"  
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">{court.name}</h1>
            <div className="flex items-center gap-2 text-lg">
              <FaMapMarkerAlt className="text-primary-400" />
              <p>{`${court.address}, ${court.number} - ${court.neighborhood}, ${court.city}`}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6 text-black">Fotos da Quadra</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {court.images.length > 0 ? (
                  court.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image
                        src={image}
                        alt={`${court.name} - Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                        width={1000}
                        height={1000}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    Nenhuma foto disponível
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6 text-black">Sobre a Quadra</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-50 text-primary-500 rounded-lg">
                    <FaMoneyBillWave className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-black">Valor por Hora</h3>
                    <p className="text-2xl font-bold text-primary-500">
                      R$ {court.pricePerHour?.toFixed(2) || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <BiDumbbell className="text-2xl text-primary-500" />
                <h2 className="text-2xl font-bold text-black">Comodidades</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {court.amenities?.map((amenity) => (
                  <div
                    key={amenity}
                    className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {AMENITY_LABELS[amenity as keyof typeof AMENITY_LABELS]}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <MdSportsSoccer className="text-2xl text-primary-500" />
                <h2 className="text-2xl font-bold text-black">Modalidades</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {court.categories?.map((category) => (
                  <div
                    key={category}
                    className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Horários de Funcionamento</h2>
              <WeeklyScheduleDisplay schedule={court.weeklySchedule} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="space-y-4">
                {user?.userType !== 'HOUSE_OWNER' && (
                  <button
                    onClick={handleReserveClick}
                    className="w-full px-6 py-4 bg-primary-500 text-white rounded-xl
                      hover:bg-primary-600 transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      font-semibold text-lg shadow-lg hover:shadow-xl"
                  >
                    Reservar Horário
                  </button>
                )}
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full px-6 py-4 border-2 border-primary-500 text-primary-500 rounded-xl
                    hover:bg-primary-50 transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    font-semibold text-lg"
                >
                  Contatar Proprietário
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[300] p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <Image
              src={selectedImage}
              alt="Foto da quadra"
              className="w-full h-full object-contain"
              width={1000}
              height={1000}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        weeklySchedule={court.weeklySchedule}
        court={court}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        phoneNumber={court?.user?.phone}
      />

      <AuthRequiredModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}   