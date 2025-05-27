import { api } from "@/lib/axios";
import { CreateReservationDTO } from "@/dtos/CreateReservationDTO";
import { WeeklySchedule } from "@/types/courts";

export interface Court {
  _id: string;
  name: string;
  description: string;
  address: string;
  neighborhood: string;
  city: string;
  number: string;
  ownerId: string;
  weeklySchedule: WeeklySchedule;
  reason: string;
  pricePerHour: number;
  amenities: string[];
  categories: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export enum BillingStatus {
  PENDING = 'PENDING',
  PAGO_PRESENCIALMENTE = 'PAGO_PRESENCIALMENTE',
  PAGO_SPORTMAP = 'PAGO_SPORTMAP',
}

export enum BillingType {
  PRESENCIAL = 'PRESENCIAL',
  ONLINE = 'ONLINE',
}

export interface BillingHistory {
  _id: string;
  reservationId: string;
  amount: number;
  billingType: BillingType;
  status: BillingStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ownerId: any;
  userId: User;
  courtId: Court;
  nextPaidAt: Date,
  lastPaidAt: Date,
  dueDate: Date,
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  _id: string;
  ownerId: string;
  userId: User;
  courtId: Court;
  reservedStartTime: string;
  reservationType: "SINGLE" | "MONTHLY";
  status: 'requested' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetUserReservationsResponse {
  data: Reservation[];
  total: number;
}

export const reservationService = {
  async createReservation(data: CreateReservationDTO) {
    const response = await api.post('/reservations', data);
    return response.data;
  },

  async getUserReservations(page = 1, limit = 10): Promise<GetUserReservationsResponse> {
    const response = await api.get('/reservations/user', {
      params: { page, limit }
    });
    return response.data;
  },

  async getOwnerReservations(page = 1, limit = 10) {
    const response = await api.get<GetUserReservationsResponse>('/reservations/owner', {
      params: { page, limit }
    });

    return response.data;
  },

  async approveReservation(id: string) {
    const response = await api.patch(`/reservations/${id}/approve`);
    return response.data;
  },

  async rejectReservation(id: string) {
    const response = await api.patch(`/reservations/${id}/reject`);
    return response.data;
  },

  async getReservationBillingHistory(id: string, page = 1, limit = 10): Promise<BillingHistory> {
    const response = await api.get(`/billing/reservation/${id}`, {
      params: { page, limit }
    });
    return response.data.data[0];
  },

  async getInvoicesByBillingId(
    billingId: string,
    page = 1,
    limit = 10,
    filters?: {
      status?: BillingStatus;
      paymentMethod?: BillingType;
      startDate?: string;
      endDate?: string;
    }
  ) {
    const response = await api.get(`/billing/${billingId}/invoices`, {
      params: {
        page,
        limit,
        status: filters?.status,
        paymentMethod: filters?.paymentMethod,
        startDate: filters?.startDate,
        endDate: filters?.endDate,
      }
    });
    return response.data;
  },
}; 