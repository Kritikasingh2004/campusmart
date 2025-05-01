"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagePlus, Camera, X } from "lucide-react";
import { isImageFile, isFileSizeValid } from "@/utils/validation";
import { ImageCropperDialog } from "@/components/shared/image-cropper-dialog";
import { blobToFile } from "@/utils/image";
import { getInitials } from "@/utils/string";
import { cn } from "@/lib/utils";

type ImageUploadType = "avatar" | "listing";
type AvatarSize = "sm" | "md" | "lg";
type AspectRatio = "square" | "wide";

interface UnifiedImageUploadProps {
  initialImage?: string | null;
  onImageChange?: (file: File | null) => void;
  type: ImageUploadType;
  size?: AvatarSize;
  aspectRatio?: AspectRatio;
  maxSizeMB?: number;
  readOnly?: boolean;
  fallbackText?: string;
  className?: string;
}

export function UnifiedImageUpload({
  initialImage,
  onImageChange,
  type = "listing",
  size = "lg",
  aspectRatio = "square",
  maxSizeMB = type === "avatar" ? 0.5 : 1,
  readOnly = false,
  fallbackText = "User",
  className,
}: UnifiedImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  // Update preview when initialImage changes
  useEffect(() => {
    if (initialImage) {
      // Test if the image URL is valid
      const img = document.createElement("img");
      img.onload = () => {
        // Image loaded successfully, set the preview
        setPreview(initialImage);
      };
      img.onerror = () => {
        // Image failed to load, log error and use fallback
        console.error(`Failed to load ${type} image from URL:`, initialImage);
        setPreview(null);
      };

      // Start loading the image
      img.src = initialImage;
    } else {
      setPreview(null);
    }
  }, [initialImage, type]);

  // Size mapping for avatars
  const avatarSizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  // Aspect ratio values for the cropper
  const aspectRatioValues = {
    square: 1,
    wide: 16 / 9,
  };

  // Aspect ratio classes for listings
  const listingAspectRatioClasses = {
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

    // Store the original file
    setOriginalFile(file);

    // Create preview and open cropper
    const objectUrl = URL.createObjectURL(file);
    setSelectedImage(objectUrl);
    setCropperOpen(true);
  };

  // Handle cropped image
  const handleCropComplete = (croppedBlob: Blob) => {
    if (!originalFile) return;

    // Create a preview URL for the cropped image
    const croppedPreviewUrl = URL.createObjectURL(croppedBlob);
    setPreview(croppedPreviewUrl);

    // Convert blob to File and call the callback
    const croppedFile = blobToFile(croppedBlob, originalFile.name);
    if (onImageChange) {
      onImageChange(croppedFile);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    if (readOnly) return;
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

  // Render avatar upload
  if (type === "avatar") {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <div className="relative">
          <Avatar
            className={`${avatarSizeClasses[size]} border-2 border-border`}
          >
            {preview ? (
              <AvatarImage src={preview} alt="Avatar" />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(fallbackText)}
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

        {/* Image Cropper Dialog */}
        {selectedImage && (
          <ImageCropperDialog
            open={cropperOpen}
            onClose={() => {
              setCropperOpen(false);
              URL.revokeObjectURL(selectedImage);
              setSelectedImage(null);
            }}
            imageUrl={selectedImage}
            aspectRatio={aspectRatioValues[aspectRatio]}
            maxSizeMB={maxSizeMB}
            onCropComplete={handleCropComplete}
            onError={(error) => {
              setError(error.message);
              setCropperOpen(false);
              URL.revokeObjectURL(selectedImage);
              setSelectedImage(null);
            }}
          />
        )}
      </div>
    );
  }

  // Render listing image upload
  return (
    <div className={cn("space-y-2", className)}>
      <Card
        className={cn(
          "relative overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-colors w-full",
          listingAspectRatioClasses[aspectRatio],
          readOnly ? "cursor-default" : "cursor-pointer"
        )}
        onClick={readOnly ? undefined : handleButtonClick}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              onError={(e) => {
                console.error("Failed to load image in component:", preview);
                // Hide the image element on error
                e.currentTarget.style.display = "none";
                // Reset preview state
                setPreview(null);
              }}
            />
            {!readOnly && (
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
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-2 rounded-full bg-primary/10 p-2">
              <ImagePlus className="h-6 w-6 text-primary" />
            </div>
            {!readOnly ? (
              <>
                <p className="text-sm font-medium">Click to upload an image</p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, GIF up to {maxSizeMB}MB
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No image available
              </p>
            )}
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
        disabled={readOnly}
      />

      {/* Error message */}
      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Image Cropper Dialog */}
      {selectedImage && (
        <ImageCropperDialog
          open={cropperOpen}
          onClose={() => {
            setCropperOpen(false);
            URL.revokeObjectURL(selectedImage);
            setSelectedImage(null);
          }}
          imageUrl={selectedImage}
          aspectRatio={aspectRatioValues[aspectRatio]}
          maxSizeMB={maxSizeMB}
          onCropComplete={handleCropComplete}
          onError={(error) => {
            setError(error.message);
            setCropperOpen(false);
            URL.revokeObjectURL(selectedImage);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
}
