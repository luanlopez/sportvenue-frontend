export enum CourtAmenities {
  WIFI = "WIFI",
  LOCKER_ROOM = "LOCKER_ROOM",
  PARKING = "PARKING",
  BATHROOM = "BATHROOM",
  LIGHTING = "LIGHTING",
  COVERED = "COVERED",
  WATER_FOUNTAIN = "WATER_FOUNTAIN"
}

export enum CourtCategories {
  FOOTBALL = "FOOTBALL",
  BASKETBALL = "BASKETBALL",
  VOLLEYBALL = "VOLLEYBALL",
  FUTSAL = "FUTSAL"
}

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
  amenities: CourtAmenities[];
  categories: CourtCategories[];
  images: string[];
} 