"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { isImageFile, isFileSizeValid } from "@/utils/validation";
import { getInitials } from "@/utils/string";

interface AvatarUploadProps {
  initialImage?: string | null;
  onImageChange?: (file: File | null) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}

export function AvatarUpload({
  initialImage,
  onImageChange,
  size = "lg",
  readOnly = false,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when initialImage changes
  useEffect(() => {
    if (initialImage) {
      // Test if the image URL is valid
      const img = new Image();
      img.onload = () => {
        // Image loaded successfully, set the preview
        setPreview(initialImage);
      };
      img.onerror = () => {
        // Image failed to load, log error and use fallback
        console.error("Failed to load avatar image from URL:", initialImage);
        setPreview(null);
      };

      // Start loading the image
      img.src = initialImage;
    } else {
      setPreview(null);
    }
  }, [initialImage]);

  // Size mapping
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
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

    // Validate file size (max 5MB)
    if (!isFileSizeValid(file, 5)) {
      setError("Image size should be less than 5MB");
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
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-2 border-border`}>
          {preview ? (
            <AvatarImage src={preview} alt="Avatar" />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials("User")}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Remove button - only show if not in read-only mode */}
        {preview && !readOnly && (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        {/* Upload button - only show if not in read-only mode */}
        {!readOnly && (
          <Button
            type="button"
            size="icon"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
            onClick={handleButtonClick}
          >
            <Camera className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Error message */}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}

      {!readOnly && (
        <p className="text-xs text-muted-foreground mt-1">
          Click the camera icon to upload your avatar
        </p>
      )}
    </div>
  );
}
