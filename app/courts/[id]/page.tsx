"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  courtService,
  AMENITY_LABELS,
  CATEGORY_LABELS,
} from "@/services/courts";
import { ReservationModal } from "@/components/ui/ReservationModal";
import { ContactModal } from "@/components/ui/ContactModal";
import { FaMapMarkerAlt, FaRegImage, FaImages } from "react-icons/fa";
import {
  MdSportsSoccer,
  MdSportsBasketball,
  MdSportsVolleyball,
} from "react-icons/md";
import { GiTennisRacket } from "react-icons/gi";
import { useAuth } from "@/hooks/useAuth";
import { AuthRequiredModal } from "@/components/ui/AuthRequiredModal";
import { decryptId } from "@/lib/utils";
import { EventFormModal } from "@/components/ui/EventFormModal";
import { Button } from "@/components/ui/Button";
import { getAllEvents, Event } from "@/services/events";
import { BiDumbbell } from "react-icons/bi";
import { GoogleMap } from "@/components/ui/GoogleMap";

const categoryIcons: Record<string, React.ReactNode> = {
  FOOTBALL: <MdSportsSoccer className="w-4 h-4" />,
  FUTSAL: <MdSportsSoccer className="w-4 h-4" />,
  BASKETBALL: <MdSportsBasketball className="w-4 h-4" />,
  VOLLEYBALL: <MdSportsVolleyball className="w-4 h-4" />,
  TENNIS: <GiTennisRacket className="w-4 h-4" />,
};

export default function CourtDetails() {
  const { id } = useParams();
  const realId = decryptId(id as string);
  const { user } = useAuth();
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const { data: court, isLoading } = useQuery({
    queryKey: ["court", realId],
    queryFn: () => courtService.getCourtById(realId),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const { data: events } = useQuery({
    queryKey: ["events", realId],
    queryFn: () => getAllEvents({ courtId: realId }),
    enabled: !!realId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-50" />
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
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          {court.images && court.images.length > 0 ? (
            <div className="space-y-4">
              {/* Main Photo Gallery */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px] sm:h-[500px] lg:h-[600px]">
                {/* Large Photo - Left */}
                <div className="lg:col-span-2 relative rounded-2xl overflow-hidden cursor-pointer group transition-transform hover:scale-[1.02]">
                  <Image
                    src={court.images[0]}
                    alt={`${court.name} - Foto principal`}
                    fill
                    className="object-cover w-full h-full"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                
                {/* Two Smaller Photos - Right */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                  {court.images.slice(1, 3).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative flex-1 rounded-2xl overflow-hidden cursor-pointer group transition-transform hover:scale-[1.02]"
                    >
                      <Image
                        src={img}
                        alt={`${court.name} - Foto ${idx + 2}`}
                        fill
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                  ))}
                  
                  {/* Fill empty space if less than 3 photos */}
                  {court.images.length < 3 && (
                    <div className="flex-1 bg-slate-100 rounded-2xl" />
                  )}
                </div>
              </div>

              {/* Show All Photos Button */}
              {court.images.length > 3 && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-slate-700 font-semibold hover:bg-slate-50"
                    type="button"
                  >
                    <FaImages className="w-5 h-5 text-[#1345BA]" />
                    <span>Mostrar todas as fotos ({court.images.length})</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 md:h-[420px] bg-slate-100 rounded-2xl flex-col gap-2">
              <FaRegImage className="text-6xl text-slate-300" />
              <span className="text-slate-400 font-semibold">
                Sem fotos disponíveis
              </span>
            </div>
          )}
        </div>

        {/* Full Photo Gallery Modal */}
        {showAllPhotos && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 overflow-auto"
            onClick={() => setShowAllPhotos(false)}
          >
            <button
              className="absolute top-4 right-4 sm:top-6 sm:right-8 text-white text-2xl sm:text-3xl font-bold bg-black/40 rounded-full p-2 hover:bg-black/60 transition-colors"
              onClick={e => { e.stopPropagation(); setShowAllPhotos(false); }}
              aria-label="Fechar"
            >
              &times;
            </button>
            
            <div className="w-full max-w-6xl">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-6 text-center">
                Galeria de Fotos - {court.name}
              </h3>
              
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                onClick={e => e.stopPropagation()}
              >
                {court.images?.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedImage(img)}
                  >
                    <Image
                      src={img}
                      alt={`${court.name} - Foto ${idx + 1}`}
                      fill
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Single Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[300] p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
              <Image
                src={selectedImage}
                alt="Foto da quadra"
                className="w-auto h-auto max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl"
                width={1200}
                height={800}
              />
              <button
                onClick={e => { e.stopPropagation(); setSelectedImage(null); }}
                className="absolute top-4 right-4 text-white text-2xl sm:text-3xl font-bold bg-black/40 rounded-full p-2 hover:bg-black/60 transition-colors"
                aria-label="Fechar"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-2 text-slate-900">
              {court.name}
            </h1>
            <div className="flex items-center gap-2 text-slate-500 mb-4">
              <FaMapMarkerAlt className="text-primary-50" />
              <span>{`${court.address}, ${court.number} - ${court.neighborhood}, ${court.city}`}</span>
            </div>
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <span className="text-base text-slate-700 font-medium">
                Quadra para esportes
              </span>
              {court.user && (
                <span className="flex items-center gap-2 text-base text-slate-700 font-medium">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-50 text-white font-bold">
                    {court.user.name?.[0] || ""}
                  </span>
                  {court.user.name}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {court.categories?.map((cat) => (
                <span
                  key={cat}
                  className="flex items-center gap-1 bg-primary-50 text-white px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {categoryIcons[cat] || <MdSportsSoccer className="w-4 h-4" />}{" "}
                  {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] || cat}
                </span>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-10">
              O que esse lugar oferece
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 mb-6">
              {court.amenities?.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-3 text-base text-slate-700"
                >
                  <BiDumbbell className="w-5 h-5 text-primary-50" />
                  <span>
                    {AMENITY_LABELS[amenity as keyof typeof AMENITY_LABELS]}
                  </span>
                </div>
              ))}
            </div>
            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold mb-4">Localização</h2>
            <div className="mb-6">
              <GoogleMap 
                address={`${court.address}, ${court.number} - ${court.neighborhood}, ${court.city}`}
                className="w-full h-96 rounded-2xl"
              />
            </div>
            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold mb-4">Esportes disponíveis</h2>
            <div className="flex flex-wrap gap-4 mb-6">
              {court.categories?.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center gap-2 text-base text-slate-700"
                >
                  {categoryIcons[cat] || <MdSportsSoccer className="w-5 h-5" />}
                  <span>
                    {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ||
                      cat}
                  </span>
                </div>
              ))}
            </div>
            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold mb-4">Eventos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {events?.data && events.data.length > 0 ? (
                events.data.map((event: Event) => (
                  <div key={event.id} className="flex flex-col gap-1 p-0">
                    <span className="text-base font-semibold text-slate-900">
                      {event.name}
                    </span>
                    {event.description && (
                      <span className="text-slate-600 text-sm line-clamp-2">
                        {event.description}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">
                      {new Date(event.startDate).toLocaleDateString("pt-BR")} -{" "}
                      {new Date(event.endDate).toLocaleDateString("pt-BR")}
                    </span>
                    {event.price && (
                      <span className="text-primary-50 font-bold text-sm">
                        R$ {event.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-slate-400 text-base">
                  Nenhum evento disponível
                </span>
              )}
            </div>
            <hr className="my-8 border-slate-200" />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="mb-4">
                <span className="text-2xl font-bold text-primary-50">
                  {court.pricePerHour?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
                <span className="text-slate-500 text-base ml-1">/hora</span>
              </div>
              {user?.userType !== "HOUSE_OWNER" && (
                <Button
                  onClick={handleReserveClick}
                  className="w-full px-6 py-4 bg-primary-50 text-white rounded-full hover:bg-primary-100 transition-all duration-200 font-bold text-lg shadow-md hover:shadow-lg mb-2"
                >
                  Reservar Horário
                </Button>
              )}
              <Button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full px-6 py-4 bg-white border border-primary-50 text-primary-50 rounded-full hover:bg-primary-50/10 transition-all duration-200 font-bold text-lg shadow-md hover:shadow-lg mb-2"
              >
                Contatar Proprietário
              </Button>

              {/* TODO: Voltar nessa parte depois de adicionar o evento */}
              {/* {user?.userType === "HOUSE_OWNER" && (
                <Button
                  className="w-full px-6 py-4 bg-primary-50 text-white rounded-full hover:bg-primary-100 transition-all duration-200 font-bold text-lg shadow-md hover:shadow-lg mb-2"
                  onClick={() => setShowEventModal(true)}
                >
                  Adicionar evento
                </Button>
              )} */}
              <div className="text-xs text-slate-400 text-center mt-2">
                Você ainda não será cobrado
              </div>
            </div>
          </div>
        </div>

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

        <EventFormModal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          courtId={realId}
        />
      </div>
    </div>
  );
}
