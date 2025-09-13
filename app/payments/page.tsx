"use client";

import { useState } from "react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, formatISO } from "date-fns";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { subscriptionService } from "@/services/subscription";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Dialog } from "@headlessui/react";
import { InvoiceDetailsDto } from "@/services/subscription";
import { FaStripe, FaDownload, FaEye, FaArrowLeft } from "react-icons/fa";
import { ptBR } from "date-fns/locale";

export default function PaymentsPage() {
  const [filter, setFilter] = useState("paid");
  const [dateRange, setDateRange] = useState("week");
  const [page, setPage] = useState(1);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetailsDto | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function getPeriodRange(period: string): { startDate: string, endDate: string } {
    const now = new Date();
    switch (period) {
      case "week":
        return {
          startDate: formatISO(startOfWeek(now, { weekStartsOn: 1 })),
          endDate: formatISO(endOfWeek(now, { weekStartsOn: 1 })),
        };
      case "month":
        return {
          startDate: formatISO(startOfMonth(now)),
          endDate: formatISO(endOfMonth(now)),
        };
      case "lastMonth":
        const lastMonth = subMonths(now, 1);
        return {
          startDate: formatISO(startOfMonth(lastMonth)),
          endDate: formatISO(endOfMonth(lastMonth)),
        };
      case "year":
        return {
          startDate: formatISO(new Date(now.getFullYear(), 0, 1)),
          endDate: formatISO(new Date(now.getFullYear(), 11, 31)),
        };
      default:
        return { startDate: "", endDate: "" };
    }
  }

  const { startDate, endDate } = getPeriodRange(dateRange);

  const { data: billingHistory, isLoading: loadingBilling } = useQuery({
    queryKey: ["billingHistory", filter, startDate, endDate, page],
    queryFn: async () => {
      return subscriptionService.getBillingHistory({
        status: filter,
        startDate,
        endDate,
        page,
        limit: 10,
      });
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleOpenInvoiceDetails = async (invoiceId: string) => {
    setShowModal(true);
    setLoadingDetails(true);
    try {
      const details = await subscriptionService.getInvoiceDetails(invoiceId);
      setInvoiceDetails(details);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setInvoiceDetails(null);
  };

  if (loadingBilling) {
    return <LoadingScreen />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-700 border-green-200";
      case "open":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "unpaid":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago";
      case "open":
        return "Aguardando";
      case "unpaid":
        return "Expirado";
      case "canceled":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => window.location.href = '/profile'}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Voltar ao Perfil</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico de Pagamentos</h1>
          <p className="text-gray-600">Gerencie e visualize todas as suas faturas</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
              <div className="flex flex-wrap gap-2">
                {[
                  {label: 'Todos', value: ''}, 
                  {label: 'Pagos', value: 'paid'}, 
                  {label: 'Aguardando', value: 'open'}, 
                  {label: 'Falhos', value: 'unpaid'}
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFilter(opt.value)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${filter === opt.value 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Período</label>
              <div className="flex flex-wrap gap-2">
                {[
                  {label: 'Hoje', value: 'today'}, 
                  {label: 'Última semana', value: 'week'}, 
                  {label: 'Último mês', value: 'month'}, 
                  {label: 'Último ano', value: 'year'}
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setDateRange(opt.value)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${dateRange === opt.value 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {billingHistory?.data.invoices && billingHistory.data.invoices.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificador</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {billingHistory?.data.invoices?.map((payment, idx) => (
                      <tr key={payment.id || idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm text-gray-900 font-medium">
                          <span className="hidden sm:inline">{payment.id}</span>
                          <span className="sm:hidden">{payment.id.substring(0, 8)}...</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {format(payment.created, "dd 'de' MMMM", { locale: ptBR })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(payment.created, "HH:mm")}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm font-bold text-gray-900">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(payment.amount / 100)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {payment.dueDate ? format(payment.dueDate, "dd/MM/yyyy") : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                            {getStatusText(payment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleOpenInvoiceDetails(payment.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                          >
                            <FaEye className="w-4 h-4 mr-1" />
                            Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {billingHistory?.totalPages && billingHistory.totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <span className="text-sm text-gray-700">
                      Página {page} de {billingHistory?.totalPages || 1}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(billingHistory?.totalPages || 1, p + 1))}
                      disabled={page === (billingHistory?.totalPages || 1)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              {loadingBilling ? (
                <LoadingSpinner />
              ) : (
                <div className="text-gray-500">
                  <p className="text-lg font-medium mb-2">Nenhuma fatura encontrada</p>
                  <p className="text-sm">Tente ajustar os filtros para ver mais resultados</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showModal} onClose={handleCloseModal} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FaStripe className="w-5 h-5 text-blue-600 mr-2" />
              Detalhes da Fatura
            </Dialog.Title>
            
            {loadingDetails ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner />
              </div>
            ) : invoiceDetails ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">ID</span>
                    <span className="text-sm font-medium text-gray-900">{invoiceDetails.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Número</span>
                    <span className="text-sm font-medium text-gray-900">{invoiceDetails.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoiceDetails.status)}`}>
                      {getStatusText(invoiceDetails.status)}
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <span className="text-sm text-green-600 font-medium block mb-1">Valor</span>
                  <span className="text-2xl font-bold text-green-600">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(invoiceDetails.amount / 100)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <span className="block text-xs text-gray-500 font-medium mb-1">Criada em</span>
                    <span className="block text-sm text-gray-900">{format(new Date(invoiceDetails.created * 1000), "dd/MM/yyyy HH:mm")}</span>
                  </div>
                  {invoiceDetails.dueDate && (
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <span className="block text-xs text-gray-500 font-medium mb-1">Vencimento</span>
                      <span className="block text-sm text-gray-900">{format(new Date(invoiceDetails.dueDate * 1000), "dd/MM/yyyy")}</span>
                    </div>
                  )}
                </div>

                {invoiceDetails.description && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="block text-xs text-gray-500 font-medium mb-2">Descrição</span>
                    <span className="block text-sm text-gray-900">{invoiceDetails.description}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  {invoiceDetails.hostedInvoiceUrl && (
                    <a
                      href={invoiceDetails.hostedInvoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <FaEye className="w-4 h-4" />
                      Ver Online
                    </a>
                  )}
                  {invoiceDetails.invoicePdf && (
                    <a
                      href={invoiceDetails.invoicePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      <FaDownload className="w-4 h-4" />
                      Baixar PDF
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-700 text-sm">Não foi possível carregar os detalhes da fatura.</div>
            )}

            <button
              onClick={handleCloseModal}
              className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
