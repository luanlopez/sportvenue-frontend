import { api } from "@/lib/axios";

interface User {
  name: string;
  email: string;
  phone: string;
}

export enum Amenity {
  WIFI = 'WIFI',
  LOCKER_ROOM = 'LOCKER_ROOM',
  PARKING = 'PARKING',
  BBQ_AREA = 'BBQ_AREA',
  BATHROOM = 'BATHROOM',
  LIGHTING = 'LIGHTING',
  COVERED = 'COVERED',
  BAR = 'BAR',
  RESTAURANT = 'RESTAURANT',
  WATER_FOUNTAIN = 'WATER_FOUNTAIN',
  BLEACHERS = 'BLEACHERS',
}

export enum Category {
  FOOTBALL = "FOOTBALL",
  BASKETBALL = "BASKETBALL",
  VOLLEYBALL = "VOLLEYBALL",
  FUTSAL = "FUTSAL",
  TENNIS = "TENNIS",
  HANDBALL = "HANDBALL",
  BEACH_VOLLEYBALL = "BEACH_VOLLEYBALL",
  BEACH_TENNIS = "BEACH_TENNIS"
}

export interface Court {
  _id: string;
  address: string;
  neighborhood: string;
  city: string;
  number: string;
  owner_id: string;
  name: string;
  availableHours: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
  amenities?: Amenity[];
  categories?: Category[];
  price_per_hour?: number;
  __v: number;
  user: User;
}

interface ApiResponse {
  data: Court[];
  total: number;
}

export interface GetCourtsParams {
  page?: number;
  limit?: number;
  search?: string;
  sport?: string;
}

export const AMENITY_LABELS = {
  WIFI: "Wi-Fi",
  LOCKER_ROOM: "Vestiário",
  PARKING: "Estacionamento",
  BATHROOM: "Banheiro",
  LIGHTING: "Iluminação",
  COVERED: "Quadra Coberta",
  WATER_FOUNTAIN: "Bebedouro",
  BBQ_AREA: "Churrasqueira",
  BAR: "Bar",
  RESTAURANT: "Restaurante",
  BLEACHERS: "Bancos"
} as const;

export const CATEGORY_LABELS = {
  FOOTBALL: "Futebol",
  BASKETBALL: "Basquete",
  VOLLEYBALL: "Vôlei",
  FUTSAL: "Futsal",
  TENNIS: "Tênis",
  HANDBALL: "Handebol",
  BEACH_VOLLEYBALL: "Vôlei de Praia",
  BEACH_TENNIS: "Tênis de Praia"
} as const;

export interface UpdateCourtDTO {
  address: string;
  neighborhood: string;
  city: string;
  number: string;
  name: string;
  availableHours: string[];
  reason?: string;
  description: string;
  price_per_hour: number;
  amenities: Amenity[];
  categories: Category[];
  images: string[];
}

export const courtService = {
  async getCourts(params: GetCourtsParams = {}) {
    const response = await api.get<ApiResponse>("/courts", {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.search && { search: params.search }),
        ...(params.sport && { sport: params.sport }),
      },
    });

    return {
      courts: response.data.data,
      total: response.data.total,
      page: params.page || 1,
      totalPages: Math.ceil(response.data.total / (params.limit || 10))
    };
  },

  async getCourtById(id: string) {
    const response = await api.get<Court>(`/courts/${id}`);
    return response.data;
  },

  async getOwnerCourts(ownerId: string, page = 1, limit = 6, params: GetCourtsParams = {}) {
    const response = await api.get<ApiResponse>(`/courts/owner/${ownerId}`, {
      params: { page, limit, ...params }
    });

    return {
      courts: response.data.data,
      total: response.data.total,
      page,
      totalPages: Math.ceil(response.data.total / limit)
    };
  },

  async updateCourt(id: string, data: UpdateCourtDTO) {
    const response = await api.put<Court>(`/courts/${id}`, data);
    return response.data;
  },

  async uploadImages(courtId: string, files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await api.post(`/courts/${courtId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async removeImages(courtId: string, imageUrls: string[]) {
    const response = await api.delete(`/courts/${courtId}/images`, {
      data: {
        images: imageUrls
      }
    });
    return response.data;
  },

  async createCourt(data: Omit<UpdateCourtDTO, 'reason'>) {
    const response = await api.post<Court>('/courts', data);
    return response.data;
  }
};
