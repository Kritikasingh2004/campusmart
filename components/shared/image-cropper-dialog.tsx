"use client";

import { useState, useRef } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { compressImage } from "@/utils/image";
import { enforceFileSizeLimit } from "@/utils/validation";

interface ImageCropperDialogProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  aspectRatio?: number;
  maxSizeMB?: number;
  onCropComplete: (croppedBlob: Blob) => void;
  onError?: (error: Error) => void;
}

export function ImageCropperDialog({
  open,
  onClose,
  imageUrl,
  aspectRatio = 1, // Default to square
  maxSizeMB = 1, // Default to 1MB max
  onCropComplete,
  onError,
}: ImageCropperDialogProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;

    // Create a centered crop with the specified aspect ratio
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );

    setCrop(initialCrop);
  }

  async function handleCropComplete() {
    if (!completedCrop || !imgRef.current) return;

    try {
      // Create a canvas to draw the cropped image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );

      // Convert canvas to blob
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            throw new Error("Could not create blob from canvas");
          }

          try {
            // Log original cropped size
            console.log(
              `Cropped image size before compression: ${(
                blob.size /
                (1024 * 1024)
              ).toFixed(2)}MB`
            );

            // Compress the image with specified max size
            const compressedBlob = await compressImage(blob, maxSizeMB);

            // Strictly enforce the size limit
            enforceFileSizeLimit(compressedBlob, maxSizeMB);

            onCropComplete(compressedBlob);
            onClose();
          } catch (error) {
            console.error("Error during image compression:", error);
            if (onError) {
              onError(
                error instanceof Error ? error : new Error(String(error))
              );
            }
          }
        },
        "image/jpeg",
        0.9 // Reduced initial quality to 90%
      );
    } catch (error) {
      console.error("Error during image cropping:", error);
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="mt-4 overflow-hidden">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            className="max-h-[60vh] mx-auto"
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Crop preview"
              className="max-w-full max-h-[60vh]"
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCropComplete}>Apply Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
