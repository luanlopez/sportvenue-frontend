"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { Pagination } from "@/components/ui/Pagination";
import Image from "next/image";
import Link from "next/link";
import { courtService } from "@/services/courts";
import { CourtImagePlaceholder } from "@/components/ui/CourtImagePlaceholder";
import { useSearchParams } from "next/navigation";
import { CourtCardSkeleton } from "@/components/ui/CourtCardSkeleton";

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const { data, isLoading } = useQuery({
    queryKey: ['courts', currentPage, searchQuery, selectedCategory, user?.userType],
    queryFn: async () => {
      const params = {
        search: searchQuery,
        sport: selectedCategory || undefined,
      };

      await new Promise(resolve => setTimeout(resolve, 1500));

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

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="h-36"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4 mb-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[...Array(6)].map((_, index) => (
              <CourtCardSkeleton key={index} />
            ))}
          </div>
        ) : data?.courts && data?.courts?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {data.courts.map((court) => (
              <div
                key={court._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="relative h-40 sm:h-48">
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
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    {court.name}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
                    {`${court.address}, ${court.number} - ${court.neighborhood}, ${court.city}`}
                  </p>
                  <p className="text-primary-500 font-medium text-xs sm:text-sm mb-3 sm:mb-4">
                    R$ {court.pricePerHour.toFixed(2)}/hora
                  </p>

                  <div className="flex gap-2 flex-col sm:flex-row">
                    <Link
                      href={`/courts/${court._id}`}
                      className="flex-1 px-4 py-2 text-white rounded-md
                        bg-primary-500 hover:bg-primary-600
                        transition-colors duration-300
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                        flex items-center justify-center
                        text-sm sm:text-base"
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
                          flex items-center justify-center
                          text-sm sm:text-base"
                      >
                        Editar
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-8 text-secondary-500">
            <p>Nenhuma quadra encontrada.</p>
          </div>
        )}

        {data?.totalPages && data?.totalPages > 1 && !isLoading && (
          <Pagination
            currentPage={currentPage}
            totalPages={data?.totalPages || 0}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {user?.userType === 'HOUSE_OWNER' && (
        <Link
          href="/courts/new"
          className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 px-4 sm:px-6 py-2 sm:py-3 
            bg-primary-500 text-white rounded-full
            hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            flex items-center gap-2 z-10
            text-sm sm:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 sm:w-5 sm:h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Criar Quadra
        </Link>
      )}
    </div>
  );
}
