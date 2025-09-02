// StorageService interface for abstracting file storage
// Can be implemented for local storage (development) or S3 (production)

import fs from "fs";
import path from "path";

export interface StorageService {
  uploadFile(file: Buffer, filename: string, mimeType: string): Promise<string>;
  deleteFile(url: string): Promise<void>;
  getFileUrl(filename: string): string;
}

// Local storage implementation for development
export class LocalStorageService implements StorageService {
  private uploadDir: string;

  constructor(uploadDir: string = "/tmp/bicyai-uploads") {
    this.uploadDir = uploadDir;
    // Ensure the directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Buffer, filename: string, mimeType: string): Promise<string> {
    const filePath = path.join(this.uploadDir, filename);
    await fs.promises.writeFile(filePath, file);
    
    // Return a URL that can be used to access the file
    return `/uploads/${filename}`;
  }

  async deleteFile(url: string): Promise<void> {
    const filename = path.basename(url);
    const filePath = path.join(this.uploadDir, filename);
    
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}

// S3 storage implementation placeholder (for future implementation)
export class S3StorageService implements StorageService {
  async uploadFile(file: Buffer, filename: string, mimeType: string): Promise<string> {
    // Implementation for S3 storage
    // This would require AWS SDK and S3 configuration
    throw new Error("S3 storage not implemented yet");
  }

  async deleteFile(url: string): Promise<void> {
    // Implementation for S3 storage
    throw new Error("S3 storage not implemented yet");
  }

  getFileUrl(filename: string): string {
    // Return S3 URL
    throw new Error("S3 storage not implemented yet");
  }
}

// Factory function to get the appropriate storage service
export function getStorageService(): StorageService {
  // For now, always use local storage
  // In production, you might want to use S3
  return new LocalStorageService();
}