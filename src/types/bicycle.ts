export enum BikeStatus {
  LOST = "LOST",
  STOLEN = "STOLEN",
  FOUND = "FOUND",
  FOR_SALE_EXTERNAL = "FOR_SALE_EXTERNAL",
}

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Bike {
  id: string;
  brand?: string | null;
  model?: string | null;
  color?: string | null;
  serialNumber?: string | null;
  description?: string | null;
  status: BikeStatus;
  locationLat?: number | null;
  locationLng?: number | null;
  city?: string | null;
  createdAt: Date;
  updatedAt: Date;
  source?: string | null;
  sourceUrl?: string | null;
  phash?: string | null;
}

export interface Image {
  id: string;
  url: string;
  bikeId: string;
  createdAt: Date;
}

export interface BikeWithDuplicates extends Bike {
  isDuplicate: boolean;
  duplicates: Bike[];
  images: Image[];
}

export interface Report {
  id: string;
  userId: string;
  bikeId: string;
  lostDate?: Date;
  place?: string;
  contact?: string;
  createdAt: Date;
}

export interface Find {
  id: string;
  userId: string;
  bikeId: string;
  note?: string;
  foundDate?: Date;
  createdAt: Date;
}