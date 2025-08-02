/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Pagination } from "@/components/ui/Pagination";
import Link from "next/link";
import { courtService } from "@/services/courts";
import { useSearchParams, useRouter } from "next/navigation";
import { CourtCardSkeleton } from "@/components/ui/CourtCardSkeleton";
import { CourtCardNew } from "@/components/ui/CourtCardNew";
import { subscriptionService } from "@/services/subscription";
import { showToast } from "@/components/ui/Toast";
import { FaSearch } from "react-icons/fa";
import {
  MdSportsSoccer,
  MdSportsTennis,
  MdSportsBasketball,
  MdSportsVolleyball,
} from "react-icons/md";
import { GiTennisRacket } from "react-icons/gi";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const ITEMS_PER_PAGE = 10;

const sportOptions = [
  { value: "", label: "Todos os Esportes", icon: null },
  {
    value: "FOOTBALL",
    label: "Futebol",
    icon: <MdSportsSoccer className="w-5 h-5 mr-2" />,
  },
  {
    value: "TENNIS",
    label: "Tênis",
    icon: <MdSportsTennis className="w-5 h-5 mr-2" />,
  },
  {
    value: "BASKETBALL",
    label: "Basquete",
    icon: <MdSportsBasketball className="w-5 h-5 mr-2" />,
  },
  {
    value: "VOLLEYBALL",
    label: "Vôlei",
    icon: <MdSportsVolleyball className="w-5 h-5 mr-2" />,
  },
  {
    value: "PADEL",
    label: "Padel",
    icon: <GiTennisRacket className="w-5 h-5 mr-2" />,
  },
  {
    value: "FUTSAL",
    label: "Futsal",
    icon: <MdSportsSoccer className="w-5 h-5 mr-2" />,
  },
];

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const planId = searchParams.get("plan_id");
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSportPanel, setShowSportPanel] = useState(false);
  const sportPanelRef = useRef<HTMLDivElement>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSearchText, setActiveSearchText] = useState("");

  useEffect(() => {
    if (!sessionId || !planId || !user) return;

    subscriptionService
      .createSubscription({
        userId: user.id,
        planId: planId,
        sessionId: sessionId,
      })
      .then(() => {
        showToast.success("Sucesso", "Assinatura realizada com sucesso!");
        router.replace("/");
      })
      .catch(() => {
        showToast.error(
          "Erro",
          "Erro ao finalizar assinatura. Tente novamente."
        );
        router.replace("/");
      });
  }, [sessionId, planId, user, router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sportPanelRef.current &&
        !sportPanelRef.current.contains(event.target as Node)
      ) {
        setShowSportPanel(false);
      }
      if (
        searchPanelRef.current &&
        !searchPanelRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowSportPanel(false);
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      showToast.error("Erro", "Geolocalização não suportada pelo navegador");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        // searchNearbyPlaces(latitude, longitude);
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        showToast.error("Erro", "Não foi possível obter sua localização");
        setIsLoadingLocation(false);
      }
    );
  }, []);

  // const searchNearbyPlaces = useCallback(async (lat: number, lng: number) => {
  //   try {
  //     const response = await fetch(
  //       `/api/places/nearby?lat=${lat}&lng=${lng}&radius=5000&keyword=quadra`
  //     );

  //     if (!response.ok) {
  //       throw new Error("Erro na busca de lugares");
  //     }

  //     const data = await response.json();

  //     if (data.error) {
  //       throw new Error(data.error);
  //     }

  //     if (data.results && data.results.length > 0) {
  //       const places = data.results
  //         .slice(0, 5)
  //         .map(
  //           (place: {
  //             name: string;
  //             vicinity: string;
  //             geometry: { location: { lat: number; lng: number } };
  //           }) => ({
  //             value: place.name,
  //             icon: <MdSportsSoccer className="w-5 h-5 text-primary-50" />,
  //             subtitle: place.vicinity || "Localização próxima",
  //             location: place.geometry?.location,
  //           })
  //         );
  //       setNearbyPlaces(places);
  //     } else {
  //       setNearbyPlaces([
  //         {
  //           value: "Perto de você",
  //           icon: <MdSportsSoccer className="w-5 h-5 text-primary-50" />,
  //           subtitle: "Descubra o que há perto de você",
  //         },
  //         {
  //           value: "São Paulo, Estado de São Paulo",
  //           icon: <MdSportsTennis className="w-5 h-5 text-primary-50" />,
  //           subtitle:
  //             "Porque sua lista de favoritos tem acomodações em São Paulo",
  //         },
  //         {
  //           value: "Guarujá, Estado de São Paulo",
  //           icon: <MdSportsBasketball className="w-5 h-5 text-primary-50" />,
  //           subtitle: "Destino popular por suas praias",
  //         },
  //       ]);
  //     }
  //   } catch (error) {
  //     console.error("Erro ao buscar lugares próximos:", error);
  //     setNearbyPlaces([
  //       {
  //         value: "Perto de você",
  //         icon: <MdSportsSoccer className="w-5 h-5 text-primary-50" />,
  //         subtitle: "Descubra o que há perto de você",
  //       },
  //       {
  //         value: "São Paulo, Estado de São Paulo",
  //         icon: <MdSportsTennis className="w-5 h-5 text-primary-50" />,
  //         subtitle:
  //           "Porque sua lista de favoritos tem acomodações em São Paulo",
  //       },
  //       {
  //         value: "Guarujá, Estado de São Paulo",
  //         icon: <MdSportsBasketball className="w-5 h-5 text-primary-50" />,
  //         subtitle: "Destino popular por suas praias",
  //       },
  //     ]);
  //   }
  // }, []);

  // const searchPlaces = useCallback(async (query: string) => {
  //   if (!query.trim()) {
  //     setSearchResults([]);
  //     return;
  //   }

  //   setIsSearching(true);
  //   try {
  //     const response = await fetch(
  //       `/api/places/search?query=${encodeURIComponent(query)}`
  //     );

  //     if (!response.ok) {
  //       throw new Error("Erro na busca");
  //     }

  //     const data = await response.json();

  //     if (data.error) {
  //       throw new Error(data.error);
  //     }

  //     if (data.results && data.results.length > 0) {
  //       const places = data.results.slice(0, 5).map((place: any) => ({
  //         value: place.name,
  //         icon: <MdSportsSoccer className="w-5 h-5 text-primary-50" />,
  //         subtitle: place.formatted_address || place.vicinity || "Localização",
  //         location: place.geometry?.location,
  //       }));
  //       setSearchResults(places);
  //     } else {
  //       setSearchResults([]);
  //     }
  //   } catch (error) {
  //     console.error("Erro ao buscar lugares:", error);
  //     setSearchResults([]);
  //   } finally {
  //     setIsSearching(false);
  //   }
  // }, []);

  useEffect(() => {
    if (searchText.trim()) {
      const timeoutId = setTimeout(() => {
        // searchPlaces(searchText);
        setSearchResults([]);
        setNearbyPlaces([]);
        setIsSearching(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
    }, [searchText]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  const { data, isLoading } = useQuery({
    queryKey: [
      "courts",
      currentPage,
      activeSearchText,
      selectedSport,
      user?.userType,
    ],
    queryFn: async () => {
      const params = {
        search: searchText,
        sport: selectedSport || undefined,
      };

      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (user?.userType === "HOUSE_OWNER") {
        return courtService.getOwnerCourts(
          user.id,
          currentPage,
          ITEMS_PER_PAGE,
          params
        );
      }

      return courtService.getCourts({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        ...params,
      });
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setActiveSearchText(searchText);
    setShowSuggestions(false);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      setActiveSearchText(searchText);
      setShowSuggestions(false);
    }
  }

  const isOwner = user?.userType === "HOUSE_OWNER";

  return (
    <div className="min-h-screen bg-secondary-50 overflow-x-hidden py-10 sm:py-16">
      <div className="w-full max-w-3xl mx-auto mb-12">
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white rounded-full shadow-lg px-2 py-1 sm:py-0 sm:h-16 border border-slate-100 divide-x divide-slate-100"
          autoComplete="off"
        >
          <div className="flex flex-col flex-1 px-4 py-2 relative">
            <span className="text-xs font-semibold text-slate-400 mb-0.5">
              Onde
            </span>
            <input
              type="text"
              placeholder="Buscar destinos"
              className="bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-base font-medium w-full"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            {showSuggestions && (
              <div className="absolute left-0 top-14 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 z-30 py-2 px-0 max-h-80 overflow-y-auto animate-fadeIn">
                {searchText.trim() ? (
                  <>
                    <div className="px-5 py-2 text-xs font-semibold text-slate-400">
                      {isSearching ? "Buscando..." : "Resultados da busca"}
                    </div>
                    {isSearching ? (
                      <div className="px-5 py-3 text-sm text-slate-500">
                        Buscando lugares...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((place, idx) => (
                        <button
                          key={place.value + idx}
                          type="button"
                          className="flex items-start gap-3 w-full px-5 py-3 hover:bg-primary-50/10 transition rounded-xl text-left"
                          onClick={() => {
                            setSearchText(place.value);
                            setActiveSearchText(place.value);
                            setShowSuggestions(false);
                          }}
                        >
                          <span className="mt-1">{place.icon}</span>
                          <span>
                            <div className="font-semibold text-slate-900 text-sm">
                              {place.value}
                            </div>
                            <div className="text-xs text-slate-500">
                              {place.subtitle}
                            </div>
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-3 text-sm text-slate-500">
                            Nenhum lugar encontrado para &quot;{searchText}&quot;
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="px-5 py-2 text-xs font-semibold text-slate-400">
                      {isLoadingLocation
                        ? "Carregando lugares próximos..."
                        : "Lugares próximos"}
                    </div>
                    {isLoadingLocation ? (
                      <div className="px-5 py-3 text-sm text-slate-500">
                        Buscando sua localização...
                      </div>
                    ) : (
                      nearbyPlaces.map((place, idx) => (
                        <button
                          key={place.value + idx}
                          type="button"
                          className="flex items-start gap-3 w-full px-5 py-3 hover:bg-primary-50/10 transition rounded-xl text-left"
                          onClick={() => {
                            setSearchText(place.value);
                            setActiveSearchText(place.value);
                            setShowSuggestions(false);
                          }}
                        >
                          <span className="mt-1">{place.icon}</span>
                          <span>
                            <div className="font-semibold text-slate-900 text-sm">
                              {place.value}
                            </div>
                            <div className="text-xs text-slate-500">
                              {place.subtitle}
                            </div>
                          </span>
                        </button>
                      ))
                    )}
                    {!isLoadingLocation && nearbyPlaces.length === 0 && (
                      <div className="px-5 py-3 text-sm text-slate-500">
                        Nenhum lugar próximo encontrado
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 px-4 py-2 relative">
            <span className="text-xs font-semibold text-slate-400 mb-0.5">
              Esporte
            </span>
            <button
              type="button"
              className="flex items-center justify-between w-full bg-transparent rounded-xl px-0 py-0 text-base font-medium text-slate-700 focus:ring-2 focus:ring-blue-200 transition"
              onClick={() => setShowSportPanel(true)}
              aria-haspopup="dialog"
              aria-expanded={showSportPanel}
            >
              <span className="flex items-center">
                {sportOptions.find((opt) => opt.value === selectedSport)?.icon}
                {sportOptions.find((opt) => opt.value === selectedSport)?.label}
              </span>
            </button>
            {showSportPanel && (
              <div
                ref={sportPanelRef}
                className="absolute left-0 top-14 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 z-30 py-4 px-0 max-h-80 overflow-y-auto animate-fadeIn"
              >
                <div className="px-5 py-2 text-xs font-semibold text-slate-400">
                  Selecione o esporte
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {sportOptions
                    .filter((opt) => opt.value !== "")
                    .map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`flex items-center gap-3 w-full px-5 py-3 hover:bg-sky-50 transition rounded-xl text-base ${
                          selectedSport === opt.value
                            ? "bg-sky-100 font-semibold text-blue-700"
                            : "text-slate-700"
                        }`}
                        onClick={() => {
                          setSelectedSport(opt.value);
                          setShowSportPanel(false);
                        }}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="ml-2 flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors shadow text-secondary-50"
            aria-label="Buscar"
          >
            <FaSearch className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="w-full max-w-8xl mx-auto px-2 sm:px-4 lg:px-20 py-20 sm:py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(8)].map((_, index) => (
              <CourtCardSkeleton key={index} />
            ))}
          </div>
        ) : Array.isArray(data?.courts) && data?.courts.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {data.courts.map((court) => (
              <CourtCardNew key={court._id} court={court} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] py-10">
            <HiOutlineExclamationCircle className="w-14 h-14 text-blue-200 mb-4" />
            <h3 className="text-lg font-semibold text-slate-500 mb-1">
              Nenhuma quadra encontrada
            </h3>
            <p className="text-slate-400 text-sm text-center max-w-xs">
              Não encontramos quadras para os filtros selecionados. Tente
              alterar os filtros ou buscar por outro local ou esporte.
            </p>
          </div>
        )}

        {data && data?.totalPages > 1 && !isLoading && (
          <div className="mt-6 sm:mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={data?.totalPages || 0}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {isOwner && (
        <Link
          href="/courts/new"
          className="
            fixed bottom-6 right-6 z-50
            flex items-center gap-3
            px-6 py-3
            rounded-full
            bg-primary-50 text-primary-500 font-bold text-secondary-50
            shadow-xl
            hover:bg-primary-100 hover:scale-105 hover:shadow-2xl
            active:scale-95
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2
          "
          aria-label="Criar nova quadra"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span>Criar Quadra</span>
        </Link>
      )}
    </div>
  );
}
