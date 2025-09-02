"use server";

import { PrismaClient } from "../generated/prisma";
import { getStorageService } from "@/lib/storage";
import { BikeStatus } from "@/types/bicycle";
import { getBikesWithDuplicates, searchBikes } from "@/lib/search";
import { z } from "zod";
import { lostBikeSchema, stolenBikeSchema, foundBikeSchema, FormState } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { moderateText } from "@/lib/moderation";
import { isRateLimited as isRateLimitedMemory } from "@/lib/rateLimit";
import { isRateLimited as isRateLimitedRedis, getClientId } from "@/lib/rateLimitRedis";

const prisma = new PrismaClient();

// Use Redis rate limiter in production, memory-based in development
// Only use Redis if the environment variables are properly configured
const isRateLimited = 
  process.env.NODE_ENV === "production" && 
  process.env.UPSTASH_REDIS_REST_URL && 
  process.env.UPSTASH_REDIS_REST_URL !== "your-redis-url" 
    ? isRateLimitedRedis 
    : isRateLimitedMemory;

// Create a new bike
export async function createBike(data: {
  brand?: string;
  model?: string;
  color?: string;
  serialNumber?: string;
  description?: string;
  status: BikeStatus;
  locationLat?: number;
  locationLng?: number;
  city?: string;
  source?: string;
  sourceUrl?: string;
}) {
  try {
    const bike = await prisma.bike.create({
      data,
    });
    
    return { success: true as const, bike };
  } catch (error) {
    console.error("Error creating bike:", error);
    return { success: false as const, error: "Failed to create bike" };
  }
}

// Get all bikes with optional filters and duplicate detection
export async function getBikes(filters?: {
  status?: BikeStatus;
  brand?: string;
  city?: string;
  color?: string;
  search?: string;
}) {
  try {
    const bikes = await prisma.bike.findMany({
      where: {
        AND: [
          filters?.status ? { status: filters.status } : {},
          filters?.brand ? { brand: { contains: filters.brand, mode: "insensitive" } } : {},
          filters?.city ? { city: { contains: filters.city, mode: "insensitive" } } : {},
          filters?.color ? { color: { contains: filters.color, mode: "insensitive" } } : {},
          filters?.search ? {
            OR: [
              { brand: { contains: filters.search, mode: "insensitive" } },
              { model: { contains: filters.search, mode: "insensitive" } },
              { color: { contains: filters.search, mode: "insensitive" } },
              { city: { contains: filters.search, mode: "insensitive" } },
              { serialNumber: { contains: filters.search, mode: "insensitive" } },
            ]
          } : {},
        ]
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: true,
      }
    });
    
    return { success: true, bikes };
  } catch (error) {
    console.error("Error fetching bikes:", error);
    return { success: false, error: "Failed to fetch bikes" };
  }
}

// Get a single bike by ID
export async function getBikeById(id: string) {
  try {
    const bike = await prisma.bike.findUnique({
      where: { id },
      include: {
        images: true,
        reports: true,
        finds: true,
      }
    });
    
    if (!bike) {
      return { success: false, error: "Bike not found" };
    }
    
    return { success: true, bike };
  } catch (error) {
    console.error("Error fetching bike:", error);
    return { success: false, error: "Failed to fetch bike" };
  }
}

// Create a report for a lost/stolen bike
export async function createReport(data: {
  userId: string;
  bikeId: string;
  lostDate?: Date;
  place?: string;
  contact?: string;
}) {
  try {
    const report = await prisma.report.create({
      data,
    });
    
    // Update bike status to STOLEN
    await prisma.bike.update({
      where: { id: data.bikeId },
      data: { status: BikeStatus.STOLEN },
    });
    
    return { success: true, report };
  } catch (error) {
    console.error("Error creating report:", error);
    return { success: false, error: "Failed to create report" };
  }
}

// Create a find for an ownerless bike
export async function createFind(data: {
  userId: string;
  bikeId: string;
  note?: string;
  foundDate?: Date;
}) {
  try {
    const find = await prisma.find.create({
      data,
    });
    
    return { success: true, find };
  } catch (error) {
    console.error("Error creating find:", error);
    return { success: false, error: "Failed to create find" };
  }
}

// Search bikes by multiple criteria
export async function searchBikesAction(query: string) {
  try {
    const bikes = await searchBikes({ query });
    
    return { success: true, bikes };
  } catch (error) {
    console.error("Error searching bikes:", error);
    return { success: false, error: "Failed to search bikes" };
  }
}

// Get bikes with duplicate detection
export async function getBikesWithDuplicatesAction(filters: {
  query?: string;
  serialNumber?: string;
  city?: string;
  status?: BikeStatus;
  limit?: number;
}) {
  try {
    const bikes = await getBikesWithDuplicates(filters);
    
    return { success: true, bikes };
  } catch (error) {
    console.error("Error getting bikes with duplicates:", error);
    return { success: false, error: "Failed to get bikes with duplicates" };
  }
}

// Check for duplicate bikes by serial number
export async function checkForDuplicateBySerialNumber(serialNumber: string) {
  try {
    const existingBike = await prisma.bike.findUnique({
      where: { serialNumber }
    });
    
    return { success: true, isDuplicate: !!existingBike, bike: existingBike };
  } catch (error) {
    console.error("Error checking for duplicate:", error);
    return { success: false, error: "Failed to check for duplicate" };
  }
}

// Archive a bike (soft delete)
export async function archiveBike(id: string) {
  try {
    const bike = await prisma.bike.update({
      where: { id },
      data: { 
        archived: true,
        archivedAt: new Date()
      },
    });
    
    return { success: true, bike };
  } catch (error) {
    console.error("Error archiving bike:", error);
    return { success: false, error: "Failed to archive bike" };
  }
}

// Delete a bike (hard delete)
export async function deleteBike(id: string) {
  try {
    // First delete related records
    await prisma.report.deleteMany({ where: { bikeId: id } });
    await prisma.find.deleteMany({ where: { bikeId: id } });
    await prisma.image.deleteMany({ where: { bikeId: id } });
    
    // Then delete the bike
    const bike = await prisma.bike.delete({
      where: { id },
    });
    
    return { success: true, bike };
  } catch (error) {
    console.error("Error deleting bike:", error);
    return { success: false, error: "Failed to delete bike" };
  }
}

// Verify ReCaptcha token
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
      console.warn("ReCaptcha secret key not configured");
      return true; // In development, allow requests without ReCaptcha
    }
    
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
      { method: "POST" }
    );
    
    const data = await response.json();
    return data.success && data.score > 0.5; // Require a minimum score
  } catch (error) {
    console.error("Error verifying ReCaptcha:", error);
    return false;
  }
}

// Create a lost bike report with validation
export async function createLostBikeReport(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    // Rate limiting check
    // Note: In a real implementation, you would get the request object to extract IP
    // For now, we'll use a placeholder clientId
    const clientId = "placeholder-client-id";
    const rateLimitCheck = await isRateLimited(clientId);
    
    if (rateLimitCheck.limited) {
      return { 
        success: false, 
        error: "Liian monta ilmoitusta lyhyen ajan sisällä. Yritä myöhemmin uudelleen." 
      };
    }
    
    // Verify ReCaptcha
    const recaptchaToken = formData.get("recaptchaToken") as string;
    if (process.env.NODE_ENV === "production") {
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return { 
          success: false, 
          error: "Turvallisuustarkistus epäonnistui. Yritä uudelleen." 
        };
      }
    }
    
    // Validate form data
    const rawData = {
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      color: formData.get("color") as string,
      serialNumber: formData.get("serialNumber") as string,
      description: formData.get("description") as string,
      lostDate: formData.get("lostDate") as string,
      place: formData.get("place") as string,
      contact: formData.get("contact") as string,
      locationLat: formData.get("locationLat") as string,
      locationLng: formData.get("locationLng") as string,
      city: formData.get("city") as string,
    };
    
    // Moderate text fields
    const textFields = [rawData.brand, rawData.model, rawData.color, rawData.description, rawData.place, rawData.contact, rawData.city];
    for (const field of textFields) {
      if (field) {
        const moderationResult = moderateText(field);
        if (!moderationResult.approved) {
          return { 
            success: false, 
            error: `Ilmoitus hylätty: ${moderationResult.reason}` 
          };
        }
      }
    }
    
    const validatedData = lostBikeSchema.parse(rawData);
    
    // Check for duplicate by serial number
    if (validatedData.serialNumber) {
      const duplicateCheck = await checkForDuplicateBySerialNumber(validatedData.serialNumber);
      if (duplicateCheck.success && duplicateCheck.isDuplicate) {
        return { 
          success: false, 
          error: "Pyörä tällä sarjanumerolla on jo ilmoitettu järjestelmään.",
          duplicateBikeId: duplicateCheck.bike?.id
        };
      }
    }
    
    // Create the bike
    const bikeResult = await createBike({
      brand: validatedData.brand,
      model: validatedData.model,
      color: validatedData.color,
      serialNumber: validatedData.serialNumber,
      description: validatedData.description,
      status: BikeStatus.LOST,
      locationLat: validatedData.locationLat ? parseFloat(validatedData.locationLat) : undefined,
      locationLng: validatedData.locationLng ? parseFloat(validatedData.locationLng) : undefined,
      city: validatedData.city,
    });
    
    if (!bikeResult.success) {
      return { success: false, error: bikeResult.error };
    }
    
    // Create the report
    // Note: In a real implementation, you would get the userId from the session
    const userId = "temp-user-id"; // This should be replaced with actual user ID
    
    const reportResult = await createReport({
      userId,
      bikeId: bikeResult.bike.id,
      lostDate: new Date(validatedData.lostDate),
      place: validatedData.place,
      contact: validatedData.contact,
    });
    
    if (!reportResult.success) {
      return { success: false, error: reportResult.error };
    }
    
    // Revalidate relevant paths
    revalidatePath("/lost-or-stolen");
    revalidatePath("/");
    
    // Redirect to the bike detail page
    redirect(`/bike/${bikeResult.bike.id}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return { success: false, fieldErrors };
    }
    
    console.error("Error creating lost bike report:", error);
    return { success: false, error: "Ilmoituksen tallentaminen epäonnistui." };
  }
}

// Create a stolen bike report with validation
export async function createStolenBikeReport(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    // Rate limiting check
    // Note: In a real implementation, you would get the request object to extract IP
    // For now, we'll use a placeholder clientId
    const clientId = "placeholder-client-id";
    const rateLimitCheck = await isRateLimited(clientId);
    
    if (rateLimitCheck.limited) {
      return { 
        success: false, 
        error: "Liian monta ilmoitusta lyhyen ajan sisällä. Yritä myöhemmin uudelleen." 
      };
    }
    
    // Verify ReCaptcha
    const recaptchaToken = formData.get("recaptchaToken") as string;
    if (process.env.NODE_ENV === "production") {
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return { 
          success: false, 
          error: "Turvallisuustarkistus epäonnistui. Yritä uudelleen." 
        };
      }
    }
    
    // Validate form data
    const rawData = {
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      color: formData.get("color") as string,
      serialNumber: formData.get("serialNumber") as string,
      description: formData.get("description") as string,
      lostDate: formData.get("lostDate") as string,
      place: formData.get("place") as string,
      contact: formData.get("contact") as string,
      locationLat: formData.get("locationLat") as string,
      locationLng: formData.get("locationLng") as string,
      city: formData.get("city") as string,
    };
    
    // Moderate text fields
    const textFields = [rawData.brand, rawData.model, rawData.color, rawData.description, rawData.place, rawData.contact, rawData.city];
    for (const field of textFields) {
      if (field) {
        const moderationResult = moderateText(field);
        if (!moderationResult.approved) {
          return { 
            success: false, 
            error: `Ilmoitus hylätty: ${moderationResult.reason}` 
          };
        }
      }
    }
    
    const validatedData = stolenBikeSchema.parse(rawData);
    
    // Check for duplicate by serial number
    if (validatedData.serialNumber) {
      const duplicateCheck = await checkForDuplicateBySerialNumber(validatedData.serialNumber);
      if (duplicateCheck.success && duplicateCheck.isDuplicate) {
        return { 
          success: false, 
          error: "Pyörä tällä sarjanumerolla on jo ilmoitettu järjestelmään.",
          duplicateBikeId: duplicateCheck.bike?.id
        };
      }
    }
    
    // Create the bike
    const bikeResult = await createBike({
      brand: validatedData.brand,
      model: validatedData.model,
      color: validatedData.color,
      serialNumber: validatedData.serialNumber,
      description: validatedData.description,
      status: BikeStatus.STOLEN,
      locationLat: validatedData.locationLat ? parseFloat(validatedData.locationLat) : undefined,
      locationLng: validatedData.locationLng ? parseFloat(validatedData.locationLng) : undefined,
      city: validatedData.city,
    });
    
    if (!bikeResult.success) {
      return { success: false, error: bikeResult.error };
    }
    
    // Create the report
    // Note: In a real implementation, you would get the userId from the session
    const userId = "temp-user-id"; // This should be replaced with actual user ID
    
    const reportResult = await createReport({
      userId,
      bikeId: bikeResult.bike.id,
      lostDate: new Date(validatedData.lostDate),
      place: validatedData.place,
      contact: validatedData.contact,
    });
    
    if (!reportResult.success) {
      return { success: false, error: reportResult.error };
    }
    
    // Revalidate relevant paths
    revalidatePath("/lost-or-stolen");
    revalidatePath("/");
    
    // Redirect to the bike detail page
    redirect(`/bike/${bikeResult.bike.id}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return { success: false, fieldErrors };
    }
    
    console.error("Error creating stolen bike report:", error);
    return { success: false, error: "Ilmoituksen tallentaminen epäonnistui." };
  }
}

// Create a found bike report with validation
export async function createFoundBikeReport(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    // Rate limiting check
    // Note: In a real implementation, you would get the request object to extract IP
    // For now, we'll use a placeholder clientId
    const clientId = "placeholder-client-id";
    const rateLimitCheck = await isRateLimited(clientId);
    
    if (rateLimitCheck.limited) {
      return { 
        success: false, 
        error: "Liian monta ilmoitusta lyhyen ajan sisällä. Yritä myöhemmin uudelleen." 
      };
    }
    
    // Verify ReCaptcha
    const recaptchaToken = formData.get("recaptchaToken") as string;
    if (process.env.NODE_ENV === "production") {
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return { 
          success: false, 
          error: "Turvallisuustarkistus epäonnistui. Yritä uudelleen." 
        };
      }
    }
    
    // Validate form data
    const rawData = {
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      color: formData.get("color") as string,
      serialNumber: formData.get("serialNumber") as string,
      description: formData.get("description") as string,
      foundDate: formData.get("foundDate") as string,
      note: formData.get("note") as string,
      locationLat: formData.get("locationLat") as string,
      locationLng: formData.get("locationLng") as string,
      city: formData.get("city") as string,
    };
    
    // Moderate text fields
    const textFields = [rawData.brand, rawData.model, rawData.color, rawData.description, rawData.note, rawData.city];
    for (const field of textFields) {
      if (field) {
        const moderationResult = moderateText(field);
        if (!moderationResult.approved) {
          return { 
            success: false, 
            error: `Ilmoitus hylätty: ${moderationResult.reason}` 
          };
        }
      }
    }
    
    const validatedData = foundBikeSchema.parse(rawData);
    
    // Check for duplicate by serial number
    if (validatedData.serialNumber) {
      const duplicateCheck = await checkForDuplicateBySerialNumber(validatedData.serialNumber);
      if (duplicateCheck.success && duplicateCheck.isDuplicate) {
        return { 
          success: false, 
          error: "Pyörä tällä sarjanumerolla on jo ilmoitettu järjestelmään.",
          duplicateBikeId: duplicateCheck.bike?.id
        };
      }
    }
    
    // Create the bike
    const bikeResult = await createBike({
      brand: validatedData.brand,
      model: validatedData.model,
      color: validatedData.color,
      serialNumber: validatedData.serialNumber,
      description: validatedData.description,
      status: BikeStatus.FOUND,
      locationLat: validatedData.locationLat ? parseFloat(validatedData.locationLat) : undefined,
      locationLng: validatedData.locationLng ? parseFloat(validatedData.locationLng) : undefined,
      city: validatedData.city,
    });
    
    if (!bikeResult.success) {
      return { success: false, error: bikeResult.error };
    }
    
    // Create the find
    // Note: In a real implementation, you would get the userId from the session
    const userId = "temp-user-id"; // This should be replaced with actual user ID
    
    const findResult = await createFind({
      userId,
      bikeId: bikeResult.bike.id,
      note: validatedData.note,
      foundDate: new Date(validatedData.foundDate),
    });
    
    if (!findResult.success) {
      return { success: false, error: findResult.error };
    }
    
    // Revalidate relevant paths
    revalidatePath("/found");
    revalidatePath("/");
    
    // Redirect to the bike detail page
    redirect(`/bike/${bikeResult.bike.id}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return { success: false, fieldErrors };
    }
    
    console.error("Error creating found bike report:", error);
    return { success: false, error: "Ilmoituksen tallentaminen epäonnistui." };
  }
}
