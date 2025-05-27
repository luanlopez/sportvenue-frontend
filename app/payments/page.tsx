"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { FilterBar } from "@/components/ui/FilterBar";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { paymentService } from "@/services/payment";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function PaymentsPage() {
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState("week");

  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments", filter, dateRange],
    queryFn: async () => {
      const params = {
        status: filter,
        dateRange,
      };

      return paymentService.listPayments(params);
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-secondary-500 text-primary-500 border border-secondary-600";
      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "failed":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      default:
        return "bg-tertiary-500 text-primary-500 border border-primary-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "Pago";
      case "PENDING":
        return "Aguardando";
      case "EXPIRED":
        return "Expirado";
      case "CANCELED":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-tertiary-500 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary-500 mb-2">
            Minhas Faturas
          </h1>
          <p className="text-primary-500/80">
            Visualize e gerencie seus pagamentos na plataforma
          </p>
        </div>

        <FilterBar
          statusFilter={filter}
          dateFilter={dateRange}
          onStatusChange={setFilter}
          onDateChange={setDateRange}
        />

        {payments && payments.length > 0 ? (
          <div className="mt-8 bg-tertiary-500 border border-primary-500 rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-primary-500/20">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-5 bg-tertiary-500 text-left text-xs font-bold text-primary-500 uppercase tracking-wider"
                    >
                      Data
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 bg-tertiary-500 text-left text-xs font-bold text-primary-500 uppercase tracking-wider"
                    >
                      Valor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 bg-tertiary-500 text-left text-xs font-bold text-primary-500 uppercase tracking-wider"
                    >
                      Vencimento
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 bg-tertiary-500 text-left text-xs font-bold text-primary-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 bg-tertiary-500 text-left text-xs font-bold text-primary-500 uppercase tracking-wider"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-tertiary-500 divide-y divide-primary-500/20">
                  {payments?.map((payment, idx) => (
                    <tr
                      key={payment._id || idx}
                      className="hover:bg-primary-500/5 transition-colors"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-primary-500">
                            {format(payment.createdAt, "dd 'de' MMMM", {
                              locale: ptBR,
                            })}
                          </span>
                          <span className="text-sm text-primary-500/80">
                            {format(payment.createdAt, "HH:mm")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-bold text-primary-500">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(payment.amount / 100)}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm text-primary-500">
                          {payment.boletoExpirationDate &&
                            format(payment.boletoExpirationDate, "dd/MM/yyyy")}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
                        ${getStatusColor(payment.status)}`}
                        >
                          {getStatusText(payment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {payment.paymentMethod === "boleto" &&
                          payment.status === "PENDING" && (
                            <button
                              onClick={() =>
                                window.open(payment.boletoUrl, "_blank")
                              }
                              className="inline-flex items-center px-4 py-2 rounded-full
                            bg-secondary-500 text-primary-500 hover:bg-secondary-600
                            transition-colors duration-200 text-sm font-bold shadow-md
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
                            >
                              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                              Ver Boleto
                            </button>
                          )}
                        {payment.status === "EXPIRED" && (
                          <a
                            href="https://sportmap.atlassian.net/servicedesk/customer/portal/1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-200 text-sm font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mt-2"
                          >
                            Negociar
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(!payments || payments.length === 0) && (
              <div className="text-center py-12">
                <p className="text-primary-500/80 text-sm">
                  Nenhuma fatura encontrada
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="col-span-full text-center py-8 text-primary-500">
            {isLoading ? <LoadingSpinner /> : <p>Nenhuma fatura encontrada.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
