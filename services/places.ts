import { api } from "@/lib/axios";

export interface PlaceSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  vicinity?: string;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

export interface NearbyPlacesParams {
  lat: number;
  lng: number;
  radius?: number;
  type?: string;
  keyword?: string;
}

export interface SearchPlacesParams {
  query: string;
  type?: string;
  location?: {
    lat: number;
    lng: number;
  };
  radius?: number;
}

export const placesService = {
  async getNearbyPlaces(
    params: NearbyPlacesParams
  ): Promise<PlaceSearchResult[]> {
    const response = await api.get("/places/nearby", {
      params: {
        lat: params.lat,
        lng: params.lng,
        radius: params.radius || 5000,
        type: params.type || "gym",
        keyword: params.keyword || "quadra",
      },
    });
    return response.data;
  },

  async searchPlaces(params: SearchPlacesParams): Promise<PlaceSearchResult[]> {
    const response = await api.get("/places/search", {
      params: {
        query: params.query,
        type: params.type || "gym",
        ...(params.location && {
          lat: params.location.lat,
          lng: params.location.lng,
          radius: params.radius || 5000,
        }),
      },
    });
    return response.data;
  },
};
