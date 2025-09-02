import { getStorageService } from "@/lib/storage";
import { randomUUID } from "crypto";

// This would typically be used in an API route
export async function uploadImage(file: File): Promise<string> {
  const storageService = getStorageService();
  
  // Convert File to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Generate a unique filename
  const extension = file.name.split(".").pop();
  const filename = `${randomUUID()}.${extension}`;
  
  // Upload the file
  const url = await storageService.uploadFile(buffer, filename, file.type);
  
  return url;
}

// Handle multiple image uploads
export async function uploadImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  
  for (const file of files) {
    try {
      const url = await uploadImage(file);
      urls.push(url);
    } catch (error) {
      console.error("Error uploading image:", error);
      // Depending on requirements, you might want to continue with other uploads
      // or fail the entire operation
    }
  }
  
  return urls;
}