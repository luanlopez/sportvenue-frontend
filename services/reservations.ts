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
}; 