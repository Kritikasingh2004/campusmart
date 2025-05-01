"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePlus, X } from "lucide-react";
import { isImageFile, isFileSizeValid } from "@/utils/validation";
import { ImageCropperDialog } from "@/components/shared/image-cropper-dialog";
import { blobToFile } from "@/utils/image";

interface ImageUploadProps {
  initialImages?: string[] | null;
  onImagesChange?: (files: File[] | null) => void;
  aspectRatio?: "square" | "wide";
  maxSizeMB?: number;
  maxFiles?: number;
}

export function ImageUpload({
  initialImages,
  onImagesChange,
  aspectRatio = "square",
  maxSizeMB = 5,
  maxFiles = 4,
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(initialImages || []);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  // Aspect ratio values for the cropper
  const aspectRatioValues = {
    square: 1,
    wide: 16 / 9,
  };

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: "aspect-square",
    wide: "aspect-video",
  };

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError(null);

    if (files.length === 0) {
      return;
    }

    // Check if adding these files would exceed max limit
    if (previews.length + files.length > maxFiles) {
      setError(`You can upload a maximum of ${maxFiles} images`);
      return;
    }

    // Validate each file
    for (const file of files) {
      if (!isImageFile(file)) {
        setError("Please select only image files (JPEG, PNG, etc.)");
        return;
      }

      if (!isFileSizeValid(file, maxSizeMB)) {
        setError(`Each image should be less than ${maxSizeMB}MB`);
        return;
      }
    }

    // If single file, open cropper
    if (files.length === 1) {
      const file = files[0];
      setOriginalFile(file);
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(objectUrl);
      setCropperOpen(true);
    } else {
      // For multiple files, add them directly
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
      if (onImagesChange) {
        onImagesChange([...files]);
      }
    }
  };

  // Handle cropped image
  const handleCropComplete = (croppedBlob: Blob) => {
    if (!originalFile) return;

    // Create a preview URL for the cropped image
    const croppedPreviewUrl = URL.createObjectURL(croppedBlob);
    setPreviews(prev => [...prev, croppedPreviewUrl]);

    // Convert blob to File and call the callback
    const croppedFile = blobToFile(croppedBlob, originalFile.name);
    if (onImagesChange) {
      onImagesChange([croppedFile]);
    }

    setCropperOpen(false);
    URL.revokeObjectURL(selectedImage || '');
    setSelectedImage(null);
  };

  // Trigger file input click
  const handleButtonClick = () => {
    if (previews.length >= maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return;
    }
    fileInputRef.current?.click();
  };

  // Remove image at index
  const handleRemoveImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    if (onImagesChange) {
      // This is a simplified approach - in a real app you might want to maintain File references
      onImagesChange(newPreviews.length > 0 ? newPreviews.map(() => new File([], 'temp')) : null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {previews.map((preview, index) => (
          <Card
            key={index}
            className={`relative overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-colors ${aspectRatioClasses[aspectRatio]} w-full cursor-pointer`}
          >
            <Image src={preview} alt={`Preview ${index}`} fill className="object-cover" />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-6 w-6 rounded-full z-10 cursor-pointer"
              onClick={(e) => handleRemoveImage(index, e)}
            >
              <X className="h-2 w-2" />
            </Button>
          </Card>
        ))}

        {previews.length < maxFiles && (
          <Card
            className={`relative overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-colors ${aspectRatioClasses[aspectRatio]} w-full cursor-pointer`}
            onClick={handleButtonClick}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <div className="mb-2 rounded-full bg-primary/10 p-3">
                <ImagePlus className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">Click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG, GIF up to {maxSizeMB}MB
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {maxFiles - previews.length} remaining
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        multiple
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
          maxSizeMB={1} // 1MB limit for listing images
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