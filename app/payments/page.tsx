"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { FilterBar } from "@/components/ui/FilterBar";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { paymentService } from "@/services/payment";
import { useQuery } from "@tanstack/react-query";

export default function PaymentsPage() {
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState("week");

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments', filter, dateRange],
    queryFn: async () => {
      const params = {
        status: filter,
        dateRange
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
        return "bg-primary-50 text-primary-700 border border-primary-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "failed":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Pago";
      case "pending":
        return "Aguardando";
      case "failed":
        return "Falhou";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-white px-20 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Faturas
          </h1>
          <p className="text-gray-600">
            Gerencie suas faturas e pagamentos da plataforma SportVenue
          </p>
        </div>

        <FilterBar
          statusFilter={filter}
          dateFilter={dateRange}
          onStatusChange={setFilter}
          onDateChange={setDateRange}
        />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Vencimento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments?.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {format(payment.createdAt, "dd 'de' MMMM", { locale: ptBR })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(payment.createdAt, "HH:mm")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(payment.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {payment.boletoExpirationDate && 
                          format(payment.boletoExpirationDate, "dd/MM/yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full
                        ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {payment.paymentMethod === "boleto" && payment.status === "pending" && (
                        <button
                          onClick={() => window.open(`/api/payment/boleto/${payment.stripePaymentIntentId}`, '_blank')}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg
                            text-primary-600 bg-primary-50 hover:bg-primary-100
                            transition-all duration-200"
                        >
                          <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                          Ver Boleto
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 