// List of banned words (in Finnish)
const BANNED_WORDS = [
  "vittu",
  "perkele",
  "helvetti",
  "saatana",
  "paska",
  "mulkku",
  "huora",
  "neekeri",
  "nussi",
  // Add more as needed
];

// List of allowed MIME types for images
const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp"
];

/**
 * Check if text contains banned words
 */
export function containsBannedWords(text: string): boolean {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  return BANNED_WORDS.some(word => lowerText.includes(word));
}

/**
 * Check if MIME type is allowed for images
 */
export function isAllowedImageMimeType(mimeType: string): boolean {
  return ALLOWED_IMAGE_MIME_TYPES.includes(mimeType);
}

/**
 * Moderate text content
 */
export function moderateText(text: string): { approved: boolean; reason?: string } {
  if (containsBannedWords(text)) {
    return { approved: false, reason: "Teksti sisältää kiellettyjä sanoja" };
  }
  
  return { approved: true };
}

/**
 * Moderate image content
 */
export function moderateImage(file: File): { approved: boolean; reason?: string } {
  if (!isAllowedImageMimeType(file.type)) {
    return { approved: false, reason: "Kuvatyyppi ei ole sallittu" };
  }
  
  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    return { approved: false, reason: "Kuva on liian suuri (max 5MB)" };
  }
  
  return { approved: true };
}