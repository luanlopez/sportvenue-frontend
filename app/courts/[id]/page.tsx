"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Court, courtService, AMENITY_LABELS, CATEGORY_LABELS } from "@/services/courts";
import { ReservationModal } from "@/components/ui/ReservationModal";
import { ContactModal } from "@/components/ui/ContactModal";
import { showToast } from "@/components/ui/Toast";
import { FaMapMarkerAlt, FaClock, FaMoneyBillWave } from "react-icons/fa";
import { BiDumbbell } from "react-icons/bi";
import { MdSportsSoccer } from "react-icons/md";
import { useAuth } from "@/hooks/useAuth";

export default function CourtDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [court, setCourt] = useState<Court | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourt() {
      try {
        setIsLoading(true);
        const data = await courtService.getCourtById(id as string);
        setCourt(data);
      } catch (error) {
        console.error("Error loading court:", error);
        showToast.error("Erro", "Não foi possível carregar os dados da quadra");
      } finally {
        setIsLoading(false);
      }
    }

    loadCourt();
  }, [id]);

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
                      <img
                        src={image}
                        alt={`${court.name} - Foto ${index + 1}`}
                        className="w-full h-full object-cover"
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
                    <FaClock className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-black">Horários Disponíveis</h3>
                    <div className="flex flex-wrap gap-2">
                      {court.availableHours.map((hour) => (
                        <span key={hour} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-black">
                          {hour}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-50 text-primary-500 rounded-lg">
                    <FaMoneyBillWave className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-black">Valor por Hora</h3>
                    <p className="text-2xl font-bold text-primary-500">
                      R$ {court.price_per_hour?.toFixed(2) || 0}
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
                    {AMENITY_LABELS[amenity]}
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
                    {CATEGORY_LABELS[category]}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="space-y-4">
                {user?.userType !== 'HOUSE_OWNER' && (
                  <button
                    onClick={() => setIsReservationModalOpen(true)}
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
            <img
              src={selectedImage}
              alt="Foto da quadra"
              className="w-full h-full object-contain"
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
        courtId={court?._id}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        phoneNumber={court?.user?.phone}
      />
    </div>
  );
}   