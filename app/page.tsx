"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { Pagination } from "@/components/ui/Pagination";
import Link from "next/link";
import { courtService } from "@/services/courts";
import { useSearchParams } from "next/navigation";
import { CourtCardSkeleton } from "@/components/ui/CourtCardSkeleton";
import { CourtCardNew } from "@/components/ui/CourtCardNew";

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
    <div className="min-h-screen bg-tertiary-500 overflow-x-hidden py-20 sm:py-20 sm:mt-10 mt-20">
      <div className="w-full max-w-8xl mx-auto px-2 sm:px-4 lg:px-20 py-20 sm:py-6">
        <div className="flex flex-col gap-4 mb-4 sm:mb-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(8)].map((_, index) => (
              <CourtCardSkeleton key={index} />
            ))}
          </div>
        ) : data?.courts && data?.courts?.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {data.courts.map((court) => (
              <CourtCardNew key={court._id} court={court} />
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-6 sm:py-8 text-primary-500">
            <p>Nenhuma quadra encontrada.</p>
          </div>
        )}

        {data?.totalPages && data?.totalPages > 1 && !isLoading && (
          <div className="mt-6 sm:mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={data?.totalPages || 0}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {user?.userType === 'HOUSE_OWNER' && (
        <Link
          href="/courts/new"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 
            px-4 sm:px-5 py-2 sm:py-3
            bg-primary-500 text-tertiary-500 rounded-full
            hover:bg-primary-600 transition-all duration-300 
            shadow-lg hover:shadow-xl
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            flex items-center gap-2 z-10
            text-sm sm:text-base font-bold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 sm:w-5 sm:h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden xs:inline">Criar Quadra</span>
          <span className="xs:hidden">Criar</span>
        </Link>
      )}
    </div>
  );
}
