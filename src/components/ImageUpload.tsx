"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export default function ImageUpload({ 
  onImagesSelected, 
  maxFiles = 5, 
  maxSizeMB = 5 
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file type
      if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
        errors.push(`Tiedosto ${file.name} ei ole JPG tai PNG muodossa`);
        continue;
      }

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        errors.push(`Tiedosto ${file.name} on liian suuri (max ${maxSizeMB}MB)`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length + images.length > maxFiles) {
      errors.push(`Voit valita enintään ${maxFiles} kuvaa`);
    }

    if (errors.length > 0) {
      setError(errors.join(", "));
      return [];
    }

    setError(null);
    return validFiles;
  };

  const handleFiles = (files: FileList) => {
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      const newImages = [...images, ...validFiles];
      setImages(newImages);
      onImagesSelected(newImages);
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesSelected(newImages);
  };

  return (
    <div>
      <div
        className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
              <span>Lataa tiedosto</span>
              <input
                type="file"
                ref={fileInputRef}
                className="sr-only"
                multiple
                accept="image/jpeg,image/png"
                onChange={handleChange}
              />
            </label>
            <p className="pl-1">tai raahaa ja pudota</p>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG enintään {maxSizeMB}MB (max {maxFiles} kuvaa)
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Valitut kuvat:</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <div className="aspect-square bg-gray-200 border-2 border-dashed rounded-md flex items-center justify-center">
                  <span className="text-xs text-gray-500 truncate px-1">{image.name}</span>
                </div>
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}