"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  reservationService,
  BillingStatus,
  BillingType,
} from "@/services/reservations";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { GoogleMap } from "@/components/ui/GoogleMap";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaCheck,
  FaCreditCard,
  FaMoneyBill,
  FaCalendarAlt,
  FaFilePdf,
  FaDownload,
} from "react-icons/fa";
import { MdOutlinePayments, MdHistory, MdLocationOn } from "react-icons/md";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { showToast } from "@/components/ui/Toast";
import { api } from "@/lib/axios";
import { ReactNode } from "react";
import jsPDF from "jspdf";
import { decryptId } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface Invoice {
  _id: string;
  billingId: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  ownerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: BillingStatus;
  paymentMethod: string;
  paidAt?: string;
  notes?: string;
  amount: number;
  reservationId: {
    _id: string;
    ownerId: string;
    userId: string;
    courtId: string;
    dayOfWeek: string;
    reservedStartTime: string;
    status: string;
    reservationType: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  courtId: {
    _id: string;
    name: string;
    address: string;
    number: string;
    neighborhood: string;
    city: string;
    pricePerHour: number;
  };
  invoiceNumber: string;
  metadata?: {
    automaticallyGenerated?: boolean;
    billingType?: string;
    dueDate?: string;
    lastUpdated?: string;
    updatedBy?: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const statusStyles = {
  [BillingStatus.PENDING]: {
    bg: "bg-warning-50",
    border: "border-warning-50",
    text: "text-white",
    label: "Pendente",
    icon: <FaClock className="w-4 h-4" />,
  },
  [BillingStatus.PAGO_PRESENCIALMENTE]: {
    bg: "bg-success-50",
    border: "border-success-50",
    text: "text-white",
    label: "Pago Presencialmente",
    icon: <FaCheck className="w-4 h-4" />,
  },
  [BillingStatus.PAGO_SPORTMAP]: {
    bg: "bg-success-50",
    border: "border-success-50",
    text: "text-white",
    label: "Pago via SportMap",
    icon: <FaCheck className="w-4 h-4" />,
  },
  default: {
    bg: "bg-secondary-200",
    border: "border-secondary-200",
    text: "text-secondary-400",
    label: "Status Desconhecido",
    icon: <FaClock className="w-4 h-4" />,
  },
};

const billingTypeLabels = {
  [BillingType.PRESENCIAL]: "Presencial",
  [BillingType.ONLINE]: "Online",
};

function formatDate(date: Date | string) {
  if (!date) return "N/A";
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

function formatCurrency(amount: number) {
  if (amount === undefined || amount === null) return "R$ 0,00";
  const value = amount;
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export default function BillingHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = decryptId(params.reservationId as string);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<
    "ONLINE" | "PAGO_PRESENCIALMENTE" | null
  >(null);
  const [activeInvoiceMenu, setActiveInvoiceMenu] = useState<string | null>(
    null
  );
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
    search: "",
  });
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    data: billingHistory,
    isLoading: isLoadingBilling,
    error: billingError,
    refetch,
  } = useQuery({
    queryKey: ["billingHistory", reservationId],
    queryFn: () =>
      reservationService.getReservationBillingHistory(reservationId),
    enabled: !!reservationId,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: invoices,
    isLoading: isLoadingInvoices,
    error: invoicesError,
  } = useQuery({
    queryKey: ["invoices", billingHistory?._id, filters],
    queryFn: () => {
      if (!billingHistory?._id) {
        return { data: [] };
      }
      return reservationService.getInvoicesByBillingId(
        billingHistory._id,
        1,
        10,
        {
          status: filters.status as BillingStatus,
          paymentMethod: filters.paymentMethod as BillingType,
          startDate: filters.startDate,
          endDate: filters.endDate,
        }
      );
    },
    enabled: !!billingHistory?._id,
    staleTime: 1000 * 60 * 5,
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: async (paymentType: "ONLINE" | "PAGO_PRESENCIALMENTE") => {
      return api.patch(`/billing/${billingHistory?._id}/payment-status`, {
        status: paymentType,
      });
    },
    onSuccess: () => {
      showToast.success(
        "Pagamento confirmado",
        `Pagamento ${
          selectedPaymentType === "PAGO_PRESENCIALMENTE"
            ? "presencial"
            : "online"
        } registrado com sucesso!`
      );
      setIsConfirmDialogOpen(false);
      setSelectedPaymentType(null);
      refetch();
    },
    onError: () => {
      showToast.error(
        "Erro",
        "Não foi possível atualizar o status do pagamento."
      );
    },
  });

  const handleGoBack = () => {
    router.back();
  };

  const getStatusStyle = (status: BillingStatus | string) => {
    return statusStyles[status as BillingStatus] || statusStyles.default;
  };

  const handlePaymentTypeSelect = (type: "ONLINE" | "PAGO_PRESENCIALMENTE") => {
    setSelectedPaymentType(type);

    if (type === "PAGO_PRESENCIALMENTE") {
      setIsConfirmDialogOpen(true);
    } else {
      handleConfirmPayment();
    }
  };

  const handleConfirmPayment = () => {
    if (selectedPaymentType) {
      updatePaymentStatusMutation.mutate(selectedPaymentType);
    }
  };

  const downloadInvoicePDF = async (invoiceId: string) => {
    try {
      setActiveInvoiceMenu(null);
      setDownloadingPdf(invoiceId);

      showToast.info("Gerando PDF", "Preparando o documento...");

      const invoice = invoices.data.find(
        (inv: Invoice) => inv._id === invoiceId
      );
      if (!invoice) {
        throw new Error("Fatura não encontrada");
      }

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.setTextColor(24, 40, 130);
      doc.text("SportMap", 105, 20, { align: "center" });

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`FATURA #${invoice.invoiceNumber}`, 105, 30, {
        align: "center",
      });

      doc.setDrawColor(200, 200, 200);
      doc.line(20, 35, 190, 35);

      doc.setFontSize(10);

      doc.setTextColor(100, 100, 100);
      doc.text("INFORMAÇÕES DA FATURA", 20, 45);
      doc.setTextColor(0, 0, 0);

      doc.text(`Número da Fatura: ${invoice.invoiceNumber}`, 20, 55);
      doc.text(`Data de Emissão: ${formatDate(invoice.createdAt)}`, 20, 60);
      doc.text(`Valor: ${formatCurrency(invoice.amount)}`, 20, 65);

      const statusText = getStatusStyle(invoice.status).label;
      doc.text(`Status: ${statusText}`, 20, 70);

      doc.setTextColor(100, 100, 100);
      doc.text("INFORMAÇÕES DE PAGAMENTO", 120, 45);
      doc.setTextColor(0, 0, 0);

      const paymentMethodLabels: Record<string, string> = {
        IN_PERSON: "Presencial",
        CREDIT_CARD: "Cartão de Crédito",
        PIX: "PIX",
        BANK_TRANSFER: "Transferência",
        OTHER: "Outro",
      };

      doc.text(
        `Método: ${
          paymentMethodLabels[invoice.paymentMethod] || invoice.paymentMethod
        }`,
        120,
        55
      );
      doc.text(
        `Data de Pagamento: ${
          invoice.paidAt ? formatDate(invoice.paidAt) : "Pendente"
        }`,
        120,
        60
      );

      if (invoice.notes) {
        doc.text(`Observações: ${invoice.notes}`, 120, 65);
      }

      doc.setTextColor(100, 100, 100);
      doc.text("INFORMAÇÕES DA QUADRA", 20, 85);
      doc.setTextColor(0, 0, 0);

      doc.text(`Nome da Quadra: ${invoice.courtId.name}`, 20, 95);

      if (invoice.courtId.address) {
        const address = `${invoice.courtId.address}, ${invoice.courtId.number} - ${invoice.courtId.neighborhood}, ${invoice.courtId.city}`;

        if (address.length > 70) {
          const part1 = address.substring(0, 70);
          const part2 = address.substring(70);
          doc.text(`Endereço: ${part1}`, 20, 100);
          doc.text(part2, 33, 105);
        } else {
          doc.text(`Endereço: ${address}`, 20, 100);
        }
      }

      doc.setTextColor(100, 100, 100);
      doc.text("CLIENTE", 20, 120);
      doc.setTextColor(0, 0, 0);

      doc.text(
        `Nome: ${invoice.userId.firstName} ${invoice.userId.lastName}`,
        20,
        130
      );
      doc.text(`Email: ${invoice.userId.email}`, 20, 135);

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "Esta fatura foi gerada automaticamente pelo sistema SportMap.",
        105,
        270,
        { align: "center" }
      );
      doc.text(
        "Em caso de dúvidas, entre em contato com o suporte.",
        105,
        275,
        { align: "center" }
      );

      doc.save(`fatura-${invoice.invoiceNumber}.pdf`);

      showToast.success("PDF Gerado", "Documento gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      showToast.error("Erro", "Não foi possível gerar o PDF da fatura.");
    } finally {
      setDownloadingPdf(null);
    }
  };

  const toggleInvoiceMenu = (invoiceId: string) => {
    if (activeInvoiceMenu === invoiceId) {
      setActiveInvoiceMenu(null);
    } else {
      setActiveInvoiceMenu(invoiceId);
    }
  };

  const openInvoiceDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setActiveInvoiceMenu(null);
  };

  const closeInvoiceDetails = () => {
    setSelectedInvoice(null);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveInvoiceMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoadingBilling) {
    return (
      <div className="min-h-screen bg-white py-20 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (billingError || !billingHistory) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4">
          <Button
            onClick={handleGoBack}
            className="flex items-center text-primary-50 hover:text-primary-100 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Voltar
          </Button>

          <div className="mt-6 bg-red-50 p-4 rounded-lg text-red-600 text-center">
            {billingError
              ? "Ocorreu um erro ao carregar o histórico de cobrança."
              : "Nenhum histórico de cobrança encontrado."}
          </div>
        </div>
      </div>
    );
  }

  const statusStyle = getStatusStyle(billingHistory.status);
  const isPending = billingHistory.status === BillingStatus.PENDING;

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center text-primary-50 hover:text-primary-100 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Voltar para reservas
          </button>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Histórico de Cobrança
        </h1>
        <p className="text-base text-slate-500 mb-8">
          Acompanhe o status e os detalhes dos pagamentos desta reserva.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-slate-200 rounded-2xl shadow overflow-hidden">
              <div className="border-b border-gray-100">
                <h2 className="text-base font-bold text-primary-50 px-5 py-3 flex items-center">
                  <MdLocationOn className="mr-2 text-lg text-primary-50" />
                  Localização da Quadra
                </h2>
              </div>

              <div className="p-5 min-h-[350px]">
                <GoogleMap
                  address={`${billingHistory.courtId.address}, ${billingHistory.courtId.number} - ${billingHistory.courtId.neighborhood}, ${billingHistory.courtId.city}`}
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow overflow-hidden">
              <div className="border-b border-gray-100">
                <h2 className="text-base font-bold text-primary-50 px-5 py-3 flex items-center">
                  <MdHistory className="mr-2 text-lg text-primary-50" />
                  Histórico de Cobranças
                </h2>
              </div>

              <div className="p-0">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex flex-col w-full gap-2 sm:flex-row sm:space-x-2">
                    <div className="relative w-full sm:w-auto">
                      <select
                        className="
                            border border-slate-200
                            text-sm
                            rounded-xl
                            px-4 py-2
                            bg-white
                            focus:outline-none
                                                      focus:ring-2 focus:ring-primary-50
                          text-primary-50
                            shadow-sm
                            transition
                            appearance-none
                            font-medium
                            w-full
                            pr-10
                          "
                        value={filters.status}
                        onChange={(e) =>
                          handleFilterChange("status", e.target.value)
                        }
                      >
                        <option value="">Todos os status</option>
                        <option value="PENDING">Pendente</option>
                        <option value="PAGO_PRESENCIALMENTE">
                          Pago Presencialmente
                        </option>
                        <option value="PAGO_SPORTMAP">Pago via SportMap</option>
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
                {isLoadingInvoices ? (
                  <div className="py-10 flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : invoicesError ||
                  !invoices ||
                  invoices.data?.length === 0 ? (
                  <div className="p-5 text-center text-gray-500 text-sm">
                    Não há histórico de cobranças disponível
                  </div>
                ) : (
                  <>
                    <div className="max-h-[500px] overflow-y-auto w-full">
                      <div className="overflow-x-auto">
                        <table className="min-w-[700px] w-full text-sm border-collapse">
                          <thead className="bg-slate-50 text-slate-700 border-b border-slate-100 sticky top-0 z-10">
                            <tr>
                              <th className="px-5 py-3 text-left font-medium">
                                Nº FATURA
                              </th>
                              <th className="px-5 py-3 text-left font-medium">
                                DATA
                              </th>
                              <th className="px-5 py-3 text-left font-medium">
                                VALOR
                              </th>
                              <th className="px-5 py-3 text-left font-medium">
                                MÉTODO
                              </th>
                              <th className="px-5 py-3 text-left font-medium">
                                STATUS
                              </th>
                              <th className="px-5 py-3 text-left font-medium hidden md:table-cell">
                                PAGO EM
                              </th>
                              <th className="px-5 py-3 text-left font-medium hidden lg:table-cell">
                                USUÁRIO
                              </th>
                              <th className="px-5 py-3 text-center font-medium hidden xl:table-cell">
                                AÇÕES
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoices.data.map(
                              (invoice: Invoice, index: number) => {
                                const invoiceStatusStyle = getStatusStyle(
                                  invoice.status
                                );

                                const paymentMethodLabels: Record<
                                  string,
                                  string
                                > = {
                                  IN_PERSON: "Presencial",
                                  CREDIT_CARD: "Cartão de Crédito",
                                  PIX: "PIX",
                                  BANK_TRANSFER: "Transferência",
                                  OTHER: "Outro",
                                };

                                const paymentMethodIcons: Record<
                                  string,
                                  ReactNode
                                > = {
                                  IN_PERSON: (
                                    <FaMoneyBill className="mr-1 text-blue-500" />
                                  ),
                                  CREDIT_CARD: (
                                    <FaCreditCard className="mr-1 text-purple-500" />
                                  ),
                                  PIX: (
                                    <span className="mr-1 font-bold text-green-500">
                                      PIX
                                    </span>
                                  ),
                                  BANK_TRANSFER: (
                                    <FaMoneyBillWave className="mr-1 text-teal-500" />
                                  ),
                                  OTHER: (
                                    <FaMoneyBillWave className="mr-1 text-gray-500" />
                                  ),
                                };

                                return (
                                  <tr
                                    key={invoice._id || index}
                                    className="hover:bg-slate-50 transition-colors"
                                  >
                                    <td className="px-5 py-4 border-b border-gray-100 font-medium">
                                      <span className="bg-primary-50 text-white py-1 px-2 rounded-md">
                                        {invoice.invoiceNumber}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100 text-gray-800">
                                      {formatDate(invoice.createdAt)}
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100 font-medium text-gray-900">
                                      {formatCurrency(invoice.amount)}
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100 text-gray-800">
                                      <div className="flex items-center">
                                        {paymentMethodIcons[
                                          invoice.paymentMethod
                                        ] || (
                                          <FaMoneyBillWave className="mr-1" />
                                        )}
                                        <span>
                                          {paymentMethodLabels[
                                            invoice.paymentMethod
                                          ] || invoice.paymentMethod}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100">
                                      <span
                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                                        ${invoiceStatusStyle.bg} ${invoiceStatusStyle.text} border ${invoiceStatusStyle.border}`}
                                      >
                                        {invoiceStatusStyle.icon}
                                        {invoiceStatusStyle.label}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100 hidden md:table-cell text-gray-800">
                                      {invoice.paidAt
                                        ? formatDate(invoice.paidAt)
                                        : "-"}
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100 hidden lg:table-cell">
                                      <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">
                                          {invoice.userId.firstName}{" "}
                                          {invoice.userId.lastName}
                                        </span>
                                        <span className="text-xs text-gray-600">
                                          {invoice.userId.email}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100 text-center hidden xl:table-cell">
                                      <div className="relative" ref={menuRef}>
                                        <Button
                                          onClick={() =>
                                            toggleInvoiceMenu(invoice._id)
                                          }
                                          className="inline-flex items-center justify-center p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                                          title="Opções"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                            />
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                            />
                                          </svg>
                                        </Button>

                                        {activeInvoiceMenu === invoice._id && (
                                          <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-200 w-44 overflow-hidden">
                                            <button
                                              onClick={() =>
                                                downloadInvoicePDF(invoice._id)
                                              }
                                              className="w-full text-left py-2 px-3 hover:bg-gray-50 flex items-center text-gray-700 text-sm"
                                              disabled={
                                                downloadingPdf === invoice._id
                                              }
                                            >
                                              {downloadingPdf ===
                                              invoice._id ? (
                                                <>
                                                  <div className="h-4 w-4 mr-2 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
                                                  Gerando PDF...
                                                </>
                                              ) : (
                                                <>
                                                  <FaFilePdf className="text-red-500 mr-2" />
                                                  Baixar PDF
                                                </>
                                              )}
                                            </button>
                                            <button
                                              onClick={() =>
                                                openInvoiceDetails(invoice)
                                              }
                                              className="w-full text-left py-2 px-3 hover:bg-gray-50 flex items-center text-gray-700 text-sm"
                                            >
                                              <FaDownload className="text-primary-500 mr-2" />
                                              Visualizar Detalhes
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between">
                      <div className="text-sm text-gray-700 font-medium">
                        Exibindo 1-{invoices.data.length} de{" "}
                        {invoices.data.length} registros
                      </div>

                      <div className="flex space-x-1">
                        <button
                          className="px-3 py-1.5 border border-gray-200 rounded-md bg-white text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled
                        >
                          Anterior
                        </button>
                        <button className="px-3 py-1.5 border border-primary-50 rounded-md bg-primary-50 text-white font-medium text-sm">
                          1
                        </button>
                        <button
                          className="px-3 py-1.5 border border-gray-200 rounded-md bg-white text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled
                        >
                          Próxima
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-slate-200 rounded-2xl shadow">
              <div className="border-b border-gray-100">
                <h2 className="text-base font-bold text-primary-50 px-5 py-3 flex items-center">
                  <MdOutlinePayments className="mr-2 text-lg text-primary-50" />
                  Informações da Cobrança
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                <div className="px-5 py-3 flex justify-between items-center">
                  <span className="text-gray-700">Valor:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(billingHistory.amount)}
                  </span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center">
                  <span className="text-gray-700">Tipo:</span>
                  <span className="font-normal text-gray-900">
                    {billingTypeLabels[billingHistory.billingType]}
                  </span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center">
                  <span className="text-gray-700">Status:</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs
                      ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}
                  >
                    {statusStyle.icon}
                    {statusStyle.label}
                  </span>
                </div>

                {isPending && (
                  <div className="px-5 py-4">
                    <Button
                      onClick={() =>
                        handlePaymentTypeSelect("PAGO_PRESENCIALMENTE")
                      }
                      className="w-full py-3 bg-primary-50 hover:bg-primary-100 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaCheck className="w-4 h-4" />
                      Confirmar Pagamento Presencial
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow overflow-hidden">
              <div className="border-b border-gray-100">
                <h2 className="text-base font-bold text-primary-50 px-5 py-3 flex items-center">
                  <FaCalendarAlt className="mr-2 text-lg text-primary-50" />
                  Datas
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                <div className="px-5 py-3 flex justify-between items-center">
                  <span className="text-gray-700">Criado em:</span>
                  <span className="text-gray-900">
                    {formatDate(billingHistory.createdAt)}
                  </span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center">
                  <span className="text-gray-700">Último pagamento:</span>
                  <span className="text-gray-900">
                    {billingHistory.lastPaidAt
                      ? formatDate(billingHistory.lastPaidAt)
                      : "N/A"}
                  </span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center">
                  <span className="text-gray-700">Próximo pagamento:</span>
                  <span className="text-gray-900">
                    {billingHistory.nextPaidAt
                      ? formatDate(billingHistory.nextPaidAt)
                      : "N/A"}
                  </span>
                </div>
                <div className="px-5 py-3 flex justify-between items-center">
                  <span className="text-gray-700">Vencimento:</span>
                  <span className="text-gray-900">
                    {billingHistory.dueDate
                      ? formatDate(billingHistory.dueDate)
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow overflow-hidden">
              <div className="border-b border-gray-100">
                <h2 className="text-base font-bold text-primary-50 px-5 py-3 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-lg text-primary-50" />
                  Detalhes da Quadra
                </h2>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-gray-900 text-base">
                  {billingHistory.courtId.name}
                </h3>
                <div className="flex items-start mt-2 text-sm text-gray-800">
                  <FaMapMarkerAlt className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
                  <p>
                    {billingHistory.courtId.address},{" "}
                    {billingHistory.courtId.number} -{" "}
                    {billingHistory.courtId.neighborhood},{" "}
                    {billingHistory.courtId.city}
                  </p>
                </div>
                <div className="mt-3 text-sm">
                  <span className="text-gray-700">Valor por hora:</span>
                  <span className="ml-1 font-semibold text-gray-900">
                    {formatCurrency(billingHistory.courtId.pricePerHour)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 mb-10">
        <div className="bg-primary-50/10 border border-primary-50/20 rounded-lg p-5">
          <h3 className="text-primary-50 font-semibold text-base mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2 text-primary-50"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
            Informações sobre pagamentos
          </h3>
          <p className="text-sm text-primary-50/80 mb-2">
            O pagamento pode ser realizado de duas formas:
          </p>
          <ul className="list-disc list-inside text-sm text-primary-50/80 space-y-1 ml-2">
            <li>
              <span className="font-medium">Presencial</span>: O pagamento é
              feito diretamente para o proprietário da quadra, sem envolvimento
              do SportMap.
            </li>
            <li>
              <span className="font-medium">Online via SportMap</span>: O
              pagamento é processado através da nossa plataforma, garantindo
              segurança e facilidade.
            </li>
          </ul>
          <p className="text-sm text-primary-50/80 mt-2">
            Para mais informações sobre pagamentos e políticas de cancelamento,
            consulte nossos{" "}
            <a href="#" className="text-primary-50 underline font-medium">
              Termos e Condições
            </a>
            .
          </p>
        </div>
      </div>

      {isConfirmDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001] p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg max-w-md w-full overflow-hidden animate-fade-in">
            <div className="bg-primary-50 px-5 py-4">
              <h3 className="text-lg font-bold text-white">
                Confirmar Pagamento Presencial
              </h3>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">
                O pagamento presencial não tem relação nenhuma com o SportMap e
                aconteceu diretamente entre você e o cliente. Deseja confirmar
                esse pagamento como &apos;Presencial&apos;?
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={handleConfirmPayment}
                  className="flex-1 py-3 bg-primary-50 hover:bg-primary-100 text-white rounded-lg font-medium transition-colors"
                >
                  Confirmar
                </Button>

                <Button
                  onClick={() => {
                    setIsConfirmDialogOpen(false);
                    setSelectedPaymentType(null);
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001] p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg max-w-2xl w-full overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-5 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center">
                <FaFilePdf className="mr-2" /> Detalhes da Fatura #
                {selectedInvoice.invoiceNumber}
              </h3>
              <button
                onClick={closeInvoiceDetails}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-3">
                    INFORMAÇÕES DA FATURA
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">
                        Número da Fatura
                      </div>
                      <div className="font-medium text-gray-900">
                        {selectedInvoice.invoiceNumber}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">
                        Data de Emissão
                      </div>
                      <div className="font-medium text-gray-900">
                        {formatDate(selectedInvoice.createdAt)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Valor</div>
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(selectedInvoice.amount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Status</div>
                      <div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs
                            ${getStatusStyle(selectedInvoice.status).bg} ${
                            getStatusStyle(selectedInvoice.status).text
                          } 
                            border ${
                              getStatusStyle(selectedInvoice.status).border
                            }`}
                        >
                          {getStatusStyle(selectedInvoice.status).icon}
                          {getStatusStyle(selectedInvoice.status).label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-3">
                    INFORMAÇÕES DE PAGAMENTO
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">
                        Método de Pagamento
                      </div>
                      <div className="font-medium text-gray-900">
                        {{
                          IN_PERSON: "Presencial",
                          CREDIT_CARD: "Cartão de Crédito",
                          PIX: "PIX",
                          BANK_TRANSFER: "Transferência",
                          OTHER: "Outro",
                        }[selectedInvoice.paymentMethod] ||
                          selectedInvoice.paymentMethod}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">
                        Data de Pagamento
                      </div>
                      <div className="font-medium text-gray-900">
                        {selectedInvoice.paidAt
                          ? formatDate(selectedInvoice.paidAt)
                          : "Pendente"}
                      </div>
                    </div>
                    {selectedInvoice.notes && (
                      <div>
                        <div className="text-sm text-gray-600">Observações</div>
                        <div className="font-medium text-gray-900">
                          {selectedInvoice.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <h4 className="text-sm font-semibold text-gray-500 mb-3">
                  INFORMAÇÕES DA QUADRA
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-600">Nome da Quadra</div>
                    <div className="font-medium text-gray-900">
                      {selectedInvoice.courtId.name}
                    </div>
                    {selectedInvoice.courtId.address && (
                      <div className="text-sm text-gray-600 mt-2 flex items-start">
                        <FaMapMarkerAlt className="text-gray-400 mt-1 mr-1 flex-shrink-0" />
                        <span>
                          {selectedInvoice.courtId.address},{" "}
                          {selectedInvoice.courtId.number} -{" "}
                          {selectedInvoice.courtId.neighborhood},{" "}
                          {selectedInvoice.courtId.city}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-2 flex justify-between">
                <button
                  onClick={closeInvoiceDetails}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Fechar
                </button>

                <button
                  onClick={() => downloadInvoicePDF(selectedInvoice._id)}
                  className="px-5 py-2.5 bg-error-50 hover:bg-error-50/80 text-white rounded-lg font-medium transition-colors flex items-center"
                  disabled={downloadingPdf === selectedInvoice._id}
                >
                  {downloadingPdf === selectedInvoice._id ? (
                    <>
                      <div className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <FaFilePdf className="mr-2" /> Baixar PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
