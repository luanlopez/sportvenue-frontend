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
import { FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt, FaRegImage } from "react-icons/fa";
import { BiDumbbell } from "react-icons/bi";
import { MdSportsSoccer } from "react-icons/md";
import { useAuth } from "@/hooks/useAuth";
import { WeeklyScheduleDisplay } from "@/components/ui/WeeklyScheduleDisplay";
import { AuthRequiredModal } from "@/components/ui/AuthRequiredModal";
import { CourtMap } from "@/components/ui/CourtMap";
import { decryptId } from "@/lib/utils";
import { EventFormModal } from "@/components/ui/EventFormModal";
import { Button } from "@/components/ui/Button";
import { getAllEvents, Event } from "@/services/events";

export default function CourtDetails() {
  const { id } = useParams();
  const realId = decryptId(id as string);
  const { user } = useAuth();
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetailModal, setShowEventDetailModal] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);

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
    <div className="min-h-screen bg-tertiary-500">
      <div className="relative h-[500px] group">
        <Image
          src={court.images[0] || "/placeholder-court.jpg"}
          alt={court.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-500/90 via-primary-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-tertiary-500">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">{court.name}</h1>
            <div className="flex items-center gap-2 text-lg">
              <FaMapMarkerAlt className="text-secondary-500" />
              <p>{`${court.address}, ${court.number} - ${court.neighborhood}, ${court.city}`}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-tertiary-500 border border-primary-500 rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary-500">
                Fotos da Quadra
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {court.images && court.images.length > 0 ? (
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
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-tertiary-500/80">
                    <FaRegImage className="text-5xl mb-2 text-primary-500" />
                    <span className="text-lg font-semibold text-primary-500">Nenhuma foto disponível</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-tertiary-500 border border-primary-500 rounded-2xl shadow-md p-8">
              <div className="flex items-center gap-3 mb-6">
                <FaCalendarAlt className="text-2xl text-secondary-500" />
                <h2 className="text-2xl font-bold text-primary-500">
                  Eventos
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events?.data && events.data.length > 0 ? (
                  events.data.map((event: Event) => (
                    <div
                      key={event.id}
                      className="bg-tertiary-500 border border-primary-500 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col h-full">
                        {event.image && (
                          <div className="relative h-48 mb-4 rounded-lg overflow-hidden shadow-lg">
                            <Image
                              src={event.image}
                              alt={event.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <h3 className="text-xl font-bold text-primary-500 mb-2">
                          {event.name}
                        </h3>
                        {event.description && (
                          <p className="text-primary-500/80 mb-2 line-clamp-3">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-primary-500/80 mb-1 mt-auto">
                          <FaCalendarAlt />
                          <span>
                            {new Date(event.startDate).toLocaleDateString('pt-BR')} - {new Date(event.endDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        {event.price && (
                          <p className="text-secondary-500 font-bold mb-2">
                            R$ {event.price.toFixed(2)}
                          </p>
                        )}
                        <div className="flex gap-2 justify-end mt-2">
                          <Button
                            className="px-4 py-2 bg-secondary-500 text-tertiary-500 rounded-full hover:bg-secondary-600 transition-all duration-300 font-bold text-sm shadow-md hover:shadow-lg"
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowEventDetailModal(true);
                            }}
                          >
                            Ver detalhes
                          </Button>
                          {event.isLive && event.streamingUrl && (
                            <Button
                              className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 font-bold text-sm shadow-md hover:shadow-lg"
                              onClick={() => {
                                setSelectedEvent(event);
                                setShowLiveModal(true);
                              }}
                            >
                              Ver live
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12">
                    <FaCalendarAlt className="text-5xl mb-2 text-primary-500" />
                    <span className="text-lg font-semibold text-primary-500">Nenhum evento disponível</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-tertiary-500 border border-primary-500 rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary-500">
                Sobre a Quadra
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-500 text-tertiary-500 rounded-lg">
                    <FaMoneyBillWave className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-primary-500">
                      Valor por Hora
                    </h3>
                    <p className="text-2xl font-bold text-secondary-500">
                      R$ {court.pricePerHour?.toFixed(2) || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-tertiary-500 border border-primary-500 rounded-2xl shadow-md p-8">
              <div className="flex items-center gap-3 mb-6">
                <BiDumbbell className="text-2xl text-secondary-500" />
                <h2 className="text-2xl font-bold text-primary-500">
                  Comodidades
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {court.amenities?.map((amenity) => (
                  <div
                    key={amenity}
                    className="px-4 py-3 bg-tertiary-500 border border-primary-500 rounded-lg text-primary-500 font-bold transition-colors"
                  >
                    {AMENITY_LABELS[amenity as keyof typeof AMENITY_LABELS]}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-tertiary-500 border border-primary-500 rounded-2xl shadow-md p-8">
              <div className="flex items-center gap-3 mb-6">
                <MdSportsSoccer className="text-2xl text-secondary-500" />
                <h2 className="text-2xl font-bold text-primary-500">
                  Modalidades
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {court.categories?.map((category) => (
                  <div
                    key={category}
                    className="px-4 py-3 bg-tertiary-500 border border-primary-500 rounded-lg text-primary-500 font-bold transition-colors"
                  >
                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-tertiary-500 border border-primary-500 rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-primary-500 mb-4">
                Horários de Funcionamento
              </h2>
              <WeeklyScheduleDisplay schedule={court.weeklySchedule} />
            </div>

            <div className="bg-tertiary-500 border border-primary-500 rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-primary-500 mb-4">
                Localização
              </h2>
              <CourtMap
                address={court.address}
                number={court.number}
                neighborhood={court.neighborhood}
                city={court.city}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-tertiary-500 border border-primary-500 rounded-2xl shadow-md p-6 sticky top-8">
              <div className="space-y-4">
                {user?.userType !== "HOUSE_OWNER" && (
                  <Button
                    onClick={handleReserveClick}
                    className="w-full px-6 py-4 bg-secondary-500 text-primary-500 rounded-full
                      hover:bg-secondary-600 transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2
                      font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    Reservar Horário
                  </Button>
                )}
                <Button
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full px-6 py-4 bg-primary-500 text-tertiary-500 rounded-full
                    hover:bg-primary-600 transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    font-bold text-lg shadow-md hover:shadow-lg"
                >
                  Contatar Proprietário
                </Button>
                {user?.userType === "HOUSE_OWNER" && (
                  <Button
                    className="w-full px-6 py-4 bg-primary-500 text-tertiary-500 rounded-full
                    hover:bg-primary-600 transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                    font-bold text-lg shadow-md hover:shadow-lg"
                    onClick={() => setShowEventModal(true)}
                  >
                    Adicionar evento
                  </Button>
                )}
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
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
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
      {/* Modal do formulário de evento */}
      <EventFormModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        courtId={realId}
      />

      {/* Modal de detalhes do evento */}
      {showEventDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[400] p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-enter relative">
            <button
              onClick={() => setShowEventDetailModal(false)}
              className="absolute top-3 right-3 z-50 text-primary-500 p-3 rounded-full bg-white shadow hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Fechar"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6">
              {selectedEvent.image && (
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden shadow-lg">
                  <Image src={selectedEvent.image} alt={selectedEvent.name} fill className="object-cover" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-primary-500 mb-2">{selectedEvent.name}</h2>
              <p className="text-primary-500/80 mb-2">{selectedEvent.description}</p>
              <div className="flex items-center gap-2 text-sm text-primary-500/80 mb-2">
                <FaCalendarAlt />
                <span>
                  {new Date(selectedEvent.startDate).toLocaleDateString('pt-BR')} - {new Date(selectedEvent.endDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {selectedEvent.price && (
                <p className="text-secondary-500 font-bold mb-2">R$ {selectedEvent.price.toFixed(2)}</p>
              )}
              {selectedEvent.rules && (
                <div className="mb-2">
                  <span className="font-bold text-primary-500">Regras:</span>
                  <p className="text-primary-500/80">{selectedEvent.rules}</p>
                </div>
              )}
              {selectedEvent.isLive && selectedEvent.streamingUrl && (
                <div className="flex justify-end mt-6">
                  <Button
                    className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 font-bold text-base shadow-md hover:shadow-lg"
                    onClick={() => {
                      setShowEventDetailModal(false);
                      setShowLiveModal(true);
                    }}
                  >
                    Ver live
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de live */}
      {showLiveModal && selectedEvent && selectedEvent.streamingUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[500] p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden animate-enter relative">
            <button
              onClick={() => setShowLiveModal(false)}
              className="absolute top-4 right-4 text-gray-500 p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6 flex flex-col items-center">
              <h2 className="text-xl font-bold text-primary-500 mb-4">Live do Evento</h2>
              {(selectedEvent.streamingUrl.includes("youtube.com") || selectedEvent.streamingUrl.includes("youtu.be")) ? (
                <div className="w-full aspect-video max-w-xl mb-4">
                  <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(selectedEvent.streamingUrl || "")}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <a
                  href={selectedEvent.streamingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline mb-4"
                >
                  Acessar transmissão
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Função utilitária para extrair o ID do YouTube
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}
