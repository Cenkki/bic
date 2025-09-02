import { imageHash } from "image-hash";
import { PrismaClient } from "../generated/prisma";
import { randomUUID } from "crypto";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

const prisma = new PrismaClient();

// Calculate Hamming distance between two hashes
export function hammingDistance(hash1: string, hash2: string): number {
  if (hash1.length !== hash2.length) return -1;
  
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }
  return distance;
}

// Find similar bikes based on pHash
export async function findSimilarBikes(targetPhash: string, maxDistance: number = 10) {
  try {
    // Get all bikes with phash
    const bikes = await prisma.bike.findMany({
      where: {
        phash: {
          not: null
        }
      },
      select: {
        id: true,
        brand: true,
        model: true,
        color: true,
        city: true,
        status: true,
        phash: true,
        images: {
          take: 1,
          select: {
            url: true
          }
        }
      }
    });

    // Calculate similarities
    const similarBikes = bikes
      .map(bike => {
        if (!bike.phash) return null;
        
        const distance = hammingDistance(targetPhash, bike.phash);
        return {
          ...bike,
          similarity: distance !== -1 ? Math.max(0, 100 - (distance * 10)) : 0,
          distance
        };
      })
      .filter(bike => bike !== null && bike.distance !== null && bike.distance <= maxDistance)
      .sort((a, b) => (a!.distance || 0) - (b!.distance || 0));

    return similarBikes;
  } catch (error) {
    console.error("Error finding similar bikes:", error);
    throw new Error("Failed to find similar bikes");
  }
}

// Save image to disk and calculate pHash
export async function saveImageWithPhash(file: File, bikeId: string): Promise<{ imageUrl: string; phash: string }> {
  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${randomUUID()}.${fileExtension}`;
    const filepath = join(uploadDir, filename);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save file to disk
    await writeFile(filepath, buffer);

    // Calculate pHash
    const imageUrl = `/uploads/${filename}`;
    const fullPath = join(process.cwd(), "public", imageUrl);
    
    const phash = await new Promise<string>((resolve, reject) => {
      imageHash(fullPath, 16, false, (error: any, data: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data as string);
        }
      });
    });

    return { imageUrl, phash };
  } catch (error) {
    console.error("Error saving image with pHash:", error);
    throw new Error("Failed to save image and calculate pHash");
  }
}

// Upload images and update bike with pHash
export async function uploadImagesAndUpdateBike(files: File[], bikeId: string) {
  try {
    if (files.length === 0) {
      throw new Error("No files provided");
    }

    // Process the first image as primary
    const primaryImage = files[0];
    const { imageUrl, phash } = await saveImageWithPhash(primaryImage, bikeId);

    // Save primary image to database
    const image = await prisma.image.create({
      data: {
        url: imageUrl,
        bikeId: bikeId,
      }
    });

    // Update bike with pHash
    const updatedBike = await prisma.bike.update({
      where: { id: bikeId },
      data: {
        phash: phash,
      }
    });

    // Process additional images (without updating pHash)
    const additionalImages = [];
    for (let i = 1; i < Math.min(files.length, 5); i++) {
      const { imageUrl: additionalImageUrl } = await saveImageWithPhash(files[i], bikeId);
      const additionalImage = await prisma.image.create({
        data: {
          url: additionalImageUrl,
          bikeId: bikeId,
        }
      });
      additionalImages.push(additionalImage);
    }

    return {
      primaryImage: image,
      additionalImages,
      bike: updatedBike
    };
  } catch (error) {
    console.error("Error uploading images and updating bike:", error);
    throw new Error("Failed to upload images and update bike");
  }
}