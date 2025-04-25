"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePlus, X } from "lucide-react";
import { isImageFile, isFileSizeValid } from "@/utils/validation";

interface ImageUploadProps {
  initialImage?: string | null;
  onImageChange?: (file: File | null) => void;
  aspectRatio?: "square" | "wide";
  maxSizeMB?: number;
}

export function ImageUpload({
  initialImage,
  onImageChange,
  aspectRatio = "square",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: "aspect-square",
    wide: "aspect-video",
  };

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError(null);

    if (!file) {
      return;
    }

    // Validate file type
    if (!isImageFile(file)) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    // Validate file size
    if (!isFileSizeValid(file, maxSizeMB)) {
      setError(`Image size should be less than ${maxSizeMB}MB`);
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Call the callback
    if (onImageChange) {
      onImageChange(file);
    }

    // Clean up previous preview URL
    return () => URL.revokeObjectURL(objectUrl);
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Remove current image
  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageChange) {
      onImageChange(null);
    }
  };

  return (
    <div className="space-y-2">
      <Card
        className={`relative overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-colors ${aspectRatioClasses[aspectRatio]} w-full cursor-pointer`}
        onClick={handleButtonClick}
      >
        {preview ? (
          <>
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-8 w-8 rounded-full z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-2 rounded-full bg-primary/10 p-2">
              <ImagePlus className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Click to upload an image</p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG, GIF up to {maxSizeMB}MB
            </p>
          </div>
        )}
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Error message */}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
