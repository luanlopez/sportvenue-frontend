"use client";

import { SearchBar } from "@/components/ui/SearchBar";
import { Pagination } from "@/components/ui/Pagination";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaFutbol,
  FaBasketballBall,
  FaVolleyballBall,
  FaTableTennis,
  FaBaseballBall,
} from "react-icons/fa";
import {
  GiTennisBall,
  GiVolleyballBall,
  GiFeather,
  GiTennisCourt,
} from "react-icons/gi";
import Link from "next/link";
import { Court, courtService, GetCourtsParams } from "@/services/courts";
import { showToast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";

const ITEMS_PER_PAGE = 6;

interface Category {
  id: string;
  name: string;
  value: string;
  icon: React.ElementType;
}

const categories: Category[] = [
  {
    id: "futebol",
    name: "Futebol",
    value: "FOOTBALL",
    icon: FaFutbol,
  },
  {
    id: "basquete",
    name: "Basquete",
    value: "BASKETBALL",
    icon: FaBasketballBall,
  },
  {
    id: "volei",
    name: "Vôlei",
    value: "VOLLEYBALL",
    icon: FaVolleyballBall,
  },
  {
    id: "tenis",
    name: "Tênis",
    value: "TENNIS",
    icon: GiTennisBall,
  },
  {
    id: "pingpong",
    name: "Ping Pong",
    value: "PING_PONG",
    icon: FaTableTennis,
  },
  {
    id: "baseball",
    name: "Baseball",
    value: "BASEBALL",
    icon: FaBaseballBall,
  },
  {
    id: "futsal",
    name: "Futsal",
    value: "FUTSAL",
    icon: FaFutbol,
  },
  {
    id: "handball",
    name: "Handebol",
    value: "HANDBALL",
    icon: GiVolleyballBall,
  },
  {
    id: "badminton",
    name: "Badminton",
    value: "BADMINTON",
    icon: GiFeather,
  },
  {
    id: "beach-tennis",
    name: "Beach Tennis",
    value: "BEACH_TENNIS",
    icon: GiTennisCourt,
  },
];

function CourtImagePlaceholder() {
  return (
    <div className="h-48 bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-500">Sem imagem disponível</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchCourts = async (params: GetCourtsParams = {}) => {
    if (!user) return;

    try {
      setIsLoading(true);
      let response;

      if (user.userType === 'HOUSE_OWNER') {
        response = await courtService.getOwnerCourts(user.id, currentPage, ITEMS_PER_PAGE, {
          search: searchQuery,
          sport: selectedCategory || undefined,
        });
      } else {
        response = await courtService.getCourts({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: searchQuery,
          sport: selectedCategory || undefined,
          ...params,
        });
      }

      setCourts(response.courts);
      setTotalPages(response.totalPages);
    } catch {
      showToast.error("Erro", "Não foi possível carregar as quadras");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, [currentPage, searchQuery, selectedCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div className="container mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} />

        <div className="relative my-8">
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10" />

            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-6 px-8">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.value;

                  return (
                    <button
                      key={category.id}
                      onClick={() =>
                        handleCategorySelect(isSelected ? null : category.value)
                      }
                      className={`
                        flex items-center gap-2 py-3
                        whitespace-nowrap
                        transition-all duration-200
                        ${
                          isSelected
                            ? "text-primary-500 border-b-2 border-primary-500"
                            : "text-gray-600 hover:text-primary-500"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
            </div>
          ) : courts?.length > 0 ? (
            courts.map((court) => (
              <div
                key={court._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="relative h-48">
                  {court.images && court.images.length > 0 ? (
                    <Image
                      src={court.images[0]}
                      alt={court.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <CourtImagePlaceholder />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {court.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {`${court.address}, ${court.number} - ${court.neighborhood}, ${court.city}`}
                  </p>

                  <div className="flex gap-2">
                    <Link
                      href={`/courts/${court._id}`}
                      className="flex-1 px-4 py-2 text-white rounded-md
                        bg-primary-500 hover:bg-primary-600
                        transition-colors duration-300
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                        flex items-center justify-center"
                    >
                      Ver Detalhes
                    </Link>

                    {user?.userType === 'HOUSE_OWNER' && (
                      <Link
                        href={`/courts/${court._id}/edit`}
                        className="px-4 py-2 text-primary-500 rounded-md
                          border-2 border-primary-500
                          hover:bg-primary-50
                          transition-colors duration-300
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                          flex items-center justify-center"
                      >
                        Editar
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-secondary-500">
              <p>Nenhuma quadra encontrada.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && !isLoading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {user?.userType === 'HOUSE_OWNER' && (
        <Link
          href="/courts/new"
          className="fixed bottom-8 right-8 px-6 py-3 bg-primary-500 text-white rounded-full
            hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            flex items-center gap-2 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Criar Quadra
        </Link>
      )}
    </div>
  );
}
