import { api } from "@/lib/axios";

export interface Event {
  id: string;
  name: string;
  description?: string;
  image?: string;
  startDate: string;
  endDate: string;
  courtId: string;
  price?: number;
  type?: string;
  rules?: string;
  isLive?: boolean;
  streamingPlatform?: string;
  streamingUrl?: string;
}

export interface CreateEventDTO {
  name: string;
  description?: string;
  image?: string;
  startDate: string;
  endDate: string;
  courtId: string;
  price?: number;
  type?: string;
  rules?: string;
  isLive?: boolean;
  streamingPlatform?: string;
  streamingUrl?: string;
}

export async function createEvent(data: CreateEventDTO) {
  const response = await api.post("/events", data);
  return response.data;
}

export async function getAllEvents(params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  courtId?: string;
}) {
  const response = await api.get("/events", { params });
  return response.data;
}

export async function getUpcomingEvents(limit = 5) {
  const response = await api.get("/events/upcoming", { params: { limit } });
  return response.data;
}

export async function getEventById(id: string) {
  const response = await api.get(`/events/${id}`);
  return response.data;
}

export async function updateEvent(id: string, data: Partial<CreateEventDTO>) {
  const response = await api.put(`/events/${id}`, data);
  return response.data;
}

export async function deleteEvent(id: string) {
  const response = await api.delete(`/events/${id}`);
  return response.data;
}
