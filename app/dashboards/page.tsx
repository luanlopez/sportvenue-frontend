"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  getMostRentedCourts,
  getActiveReservationsByOwner,
  getActiveReservationsByCourt,
} from "@/services/dashboard";
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface MostRentedCourt {
  totalRentals: number;
  totalAmount: number;
  court: {
    _id: string;
    name: string;
  };
}

function mergeCourts(
  presencial: MostRentedCourt[],
  sportmap: MostRentedCourt[]
) {
  const courtsMap: Record<
    string,
    {
      name: string;
      presencial: MostRentedCourt | null;
      sportmap: MostRentedCourt | null;
    }
  > = {};
  presencial.forEach((item) => {
    courtsMap[item.court._id] = {
      name: item.court.name,
      presencial: item,
      sportmap: null,
    };
  });
  sportmap.forEach((item) => {
    if (courtsMap[item.court._id]) {
      courtsMap[item.court._id].sportmap = item;
    } else {
      courtsMap[item.court._id] = {
        name: item.court.name,
        presencial: null,
        sportmap: item,
      };
    }
  });
  return Object.entries(courtsMap).map(([id, value]) => ({
    id,
    name: value.name,
    presencial: value.presencial,
    sportmap: value.sportmap,
  }));
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const { data: presencialData = [], isLoading: isLoadingPresencial } =
    useQuery<MostRentedCourt[]>({
      queryKey: ["most-rented-courts", "PAGO_PRESENCIALMENTE"],
      queryFn: () => getMostRentedCourts("PAGO_PRESENCIALMENTE"),
      enabled: !!user && user.userType === "HOUSE_OWNER",
    });

  const { data: sportmapData = [], isLoading: isLoadingSportmap } = useQuery<
    MostRentedCourt[]
  >({
    queryKey: ["most-rented-courts", "PAGO_SPORTMAP"],
    queryFn: () => getMostRentedCourts("PAGO_SPORTMAP"),
    enabled: !!user && user.userType === "HOUSE_OWNER",
  });

  const { data: activeOwnerReservations = [] } = useQuery({
    queryKey: ["active-reservations-owner"],
    queryFn: getActiveReservationsByOwner,
    enabled: !!user && user.userType === "HOUSE_OWNER",
  });

  const { data: activeByCourt = [], isLoading: isLoadingActiveByCourt } =
    useQuery({
      queryKey: ["active-reservations-by-court"],
      queryFn: getActiveReservationsByCourt,
      enabled: !!user && user.userType === "HOUSE_OWNER",
    });

  if (!user || user.userType !== "HOUSE_OWNER") {
    if (typeof window !== "undefined") router.replace("/");
    return null;
  }

  const mergedCourts = mergeCourts(
    Array.isArray(presencialData) ? presencialData : [],
    Array.isArray(sportmapData) ? sportmapData : []
  );

  const chartOptions = {
    chart: { id: "comparativo-bar" },
    xaxis: { categories: mergedCourts.map((c) => c.name) },
    colors: ["#7c3aed", "#06b6d4"],
    title: {
      text: "Comparativo de Aluguéis por Quadra",
      align: "left" as const,
    },
    legend: { position: "top" as const },
    plotOptions: { bar: { horizontal: false, columnWidth: "40%" } },
    dataLabels: { enabled: true },
    grid: { borderColor: "#e5e7eb" },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} aluguéis`,
      },
    },
  };
  const chartSeries = [
    {
      name: "Presencial",
      data: mergedCourts.map((c) => c.presencial?.totalRentals || 0),
    },
    {
      name: "SportMap",
      data: mergedCourts.map((c) => c.sportmap?.totalRentals || 0),
    },
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Quadras mais alugadas</h1>
          <p className="text-base text-slate-500">Acompanhe o desempenho das suas quadras e o volume de reservas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white border border-slate-200 rounded-2xl shadow flex flex-col items-start p-8">
            <span className="text-xs text-slate-500 mb-1">Reservas ativas do proprietário</span>
            <span className="text-4xl font-extrabold text-primary-600">{activeOwnerReservations?.activeReservations || 0}</span>
            <span className="text-slate-500 mt-1">reservas ativas</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow flex flex-col items-start p-8">
            <span className="text-xs text-slate-500 mb-1">Total presencial</span>
            <span className="text-4xl font-extrabold text-primary-600">{presencialData.reduce((acc, c) => acc + (c.totalRentals || 0), 0)}</span>
            <span className="text-slate-500 mt-1">alugueis presenciais</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow flex flex-col items-start p-8">
            <span className="text-xs text-slate-500 mb-1">Total SportMap</span>
            <span className="text-4xl font-extrabold text-primary-600">{sportmapData.reduce((acc, c) => acc + (c.totalRentals || 0), 0)}</span>
            <span className="text-slate-500 mt-1">alugueis SportMap</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {!isLoadingPresencial && !isLoadingSportmap && mergedCourts.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 flex-1">
              <h2 className="text-xl font-bold mb-4 text-slate-900">Comparativo de Aluguéis por Quadra</h2>
              <ApexChart
                type="bar"
                options={chartOptions}
                series={chartSeries}
                height={350}
              />
            </div>
          )}

          {!isLoadingActiveByCourt && Array.isArray(activeByCourt) && activeByCourt.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 flex-1">
              <h2 className="text-xl font-bold mb-4 text-slate-900">Reservas ativas por quadra</h2>
              <ApexChart
                type="bar"
                options={{
                  chart: { id: "ativas-por-quadra" },
                  xaxis: {
                    categories: activeByCourt.map((r: { court: { name?: string; _id?: string }; activeReservations?: number }) => r.court?.name || r.court?._id || "-")
                  },
                  title: { text: "Reservas ativas por quadra", align: "left" as const },
                  colors: ["#6366f1"],
                }}
                series={[
                  {
                    name: "Reservas Ativas",
                    data: activeByCourt.map((r: { court: { name?: string; _id?: string }; activeReservations?: number }) => r.activeReservations || 0),
                  },
                ]}
                height={350}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mergedCourts.length === 0 ? (
            <div className="text-slate-500 col-span-2">Nenhum dado encontrado.</div>
          ) : (
            mergedCourts.map((court) => (
              <div key={court.id} className="bg-white border border-slate-200 rounded-2xl shadow p-8 flex flex-col items-start">
                <span className="text-primary-700 font-bold text-lg mb-2">{court.name}</span>
                <div className="flex gap-8 w-full">
                  <div className="flex-1">
                    <span className="block text-xs text-slate-500 mb-1">Presencial</span>
                    <span className="block text-2xl font-bold text-primary-600">{court.presencial?.totalRentals || 0} aluguéis</span>
                    <span className="block text-slate-700 font-semibold text-md">R$ {(court.presencial?.totalAmount || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex-1">
                    <span className="block text-xs text-slate-500 mb-1">SportMap</span>
                    <span className="block text-2xl font-bold text-primary-600">{court.sportmap?.totalRentals || 0} aluguéis</span>
                    <span className="block text-slate-700 font-semibold text-md">R$ {(court.sportmap?.totalAmount || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
