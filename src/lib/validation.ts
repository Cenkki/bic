import { z } from "zod";

// Validation schema for lost bike report
export const lostBikeSchema = z.object({
  brand: z.string().min(1, "Merkki on pakollinen"),
  model: z.string().min(1, "Malli on pakollinen"),
  color: z.string().min(1, "Väri on pakollinen"),
  serialNumber: z.string().optional(),
  description: z.string().optional(),
  lostDate: z.string().min(1, "Kadonnut/varastettu päivämäärä on pakollinen"),
  place: z.string().min(1, "Paikka on pakollinen"),
  contact: z.string().min(1, "Yhteystiedot ovat pakollisia"),
  locationLat: z.string().optional().refine(
    (val) => !val || !isNaN(parseFloat(val)), 
    "Leveyspiiri ei ole kelvollinen numero"
  ),
  locationLng: z.string().optional().refine(
    (val) => !val || !isNaN(parseFloat(val)), 
    "Pituuspiiri ei ole kelvollinen numero"
  ),
  city: z.string().min(1, "Kaupunki on pakollinen"),
});

// Validation schema for stolen bike report
export const stolenBikeSchema = z.object({
  brand: z.string().min(1, "Merkki on pakollinen"),
  model: z.string().min(1, "Malli on pakollinen"),
  color: z.string().min(1, "Väri on pakollinen"),
  serialNumber: z.string().optional(),
  description: z.string().optional(),
  lostDate: z.string().min(1, "Kadonnut/varastettu päivämäärä on pakollinen"),
  place: z.string().min(1, "Paikka on pakollinen"),
  contact: z.string().min(1, "Yhteystiedot ovat pakollisia"),
  locationLat: z.string().optional().refine(
    (val) => !val || !isNaN(parseFloat(val)), 
    "Leveyspiiri ei ole kelvollinen numero"
  ),
  locationLng: z.string().optional().refine(
    (val) => !val || !isNaN(parseFloat(val)), 
    "Pituuspiiri ei ole kelvollinen numero"
  ),
  city: z.string().min(1, "Kaupunki on pakollinen"),
});

// Validation schema for found bike report
export const foundBikeSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
  serialNumber: z.string().optional(),
  description: z.string().min(1, "Kuvaus on pakollinen"),
  foundDate: z.string().min(1, "Löydetty päivämäärä on pakollinen"),
  note: z.string().optional(),
  locationLat: z.string().optional().refine(
    (val) => !val || !isNaN(parseFloat(val)), 
    "Leveyspiiri ei ole kelvollinen numero"
  ),
  locationLng: z.string().optional().refine(
    (val) => !val || !isNaN(parseFloat(val)), 
    "Pituuspiiri ei ole kelvollinen numero"
  ),
  city: z.string().min(1, "Kaupunki on pakollinen"),
});

// Type inference from schemas
export type LostBikeFormData = z.infer<typeof lostBikeSchema>;
export type StolenBikeFormData = z.infer<typeof stolenBikeSchema>;
export type FoundBikeFormData = z.infer<typeof foundBikeSchema>;

// Type for form state
export interface FormState {
  success: boolean;
  error?: string;
  duplicateBikeId?: string;
  fieldErrors?: Record<string, string[]>;
}