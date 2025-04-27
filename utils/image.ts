/**
 * Image utility functions for handling image uploads and processing
 */
import imageCompression from "browser-image-compression";

// Type declaration for browser-image-compression
declare module "browser-image-compression" {
  export default function imageCompression(
    file: Blob | File,
    options: {
      maxSizeMB?: number;
      maxWidthOrHeight?: number;
      useWebWorker?: boolean;
      initialQuality?: number;
      alwaysKeepResolution?: boolean;
    }
  ): Promise<Blob>;
}

/**
 * Convert a File object to a data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Resize an image file to a maximum width/height while maintaining aspect ratio
 */
export async function resizeImage(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(img.src);

      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      // Create canvas and draw resized image
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not create blob"));
            return;
          }

          // Create new file
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });

          resolve(resizedFile);
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Error loading image"));
    };
  });
}

/**
 * Get image dimensions from a File
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Error loading image"));
    };
  });
}

/**
 * Generate a placeholder image URL with specified dimensions and text
 */
export function generatePlaceholderImage(
  width: number = 300,
  height: number = 300,
  text: string = "No Image",
  bgColor: string = "e2e8f0",
  textColor: string = "64748b"
): string {
  // Use our local API route which is guaranteed to work with Next.js Image component
  return `/api/placeholder?width=${width}&height=${height}&text=${encodeURIComponent(
    text
  )}&bgColor=${bgColor}&textColor=${textColor}`;
}

/**
 * Check if a URL is a valid image URL
 */
export function isValidImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Compress an image blob with optimized settings
 */
export async function compressImage(
  imageBlob: Blob,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1920
): Promise<Blob> {
  // Log original size
  console.log(
    `Original image size: ${(imageBlob.size / (1024 * 1024)).toFixed(2)}MB`
  );

  // Set more aggressive compression options
  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    initialQuality: 0.7, // Start with lower quality
    alwaysKeepResolution: false, // Allow resolution reduction if needed
  };

  try {
    // First compression attempt
    let compressedBlob = await imageCompression(imageBlob, options);

    // Log compressed size
    console.log(
      `Compressed image size: ${(compressedBlob.size / (1024 * 1024)).toFixed(
        2
      )}MB`
    );

    // If still too large, compress more aggressively
    if (compressedBlob.size > maxSizeMB * 1024 * 1024) {
      console.log("Image still too large, compressing more aggressively");

      // More aggressive options
      const aggressiveOptions = {
        ...options,
        initialQuality: 0.5,
        maxWidthOrHeight: Math.min(maxWidthOrHeight, 1200), // Further reduce dimensions
      };

      compressedBlob = await imageCompression(
        compressedBlob,
        aggressiveOptions
      );
      console.log(
        `Final compressed size: ${(compressedBlob.size / (1024 * 1024)).toFixed(
          2
        )}MB`
      );
    }

    // Final size check
    if (compressedBlob.size > maxSizeMB * 1024 * 1024) {
      console.warn(
        `Warning: Image still exceeds ${maxSizeMB}MB after compression`
      );
    }

    return compressedBlob;
  } catch (error) {
    console.error("Image compression failed:", error);
    // Don't return the original if it's too large
    if (imageBlob.size > maxSizeMB * 1024 * 1024) {
      throw new Error(
        `Image too large (${(imageBlob.size / (1024 * 1024)).toFixed(
          2
        )}MB) and compression failed`
      );
    }
    return imageBlob;
  }
}

/**
 * Convert a blob to a File object
 */
export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now(),
  });
}

/**
 * Delete an image from Supabase storage with multiple fallback methods
 * @param supabase Supabase client
 * @param bucket Bucket name ('avatars' or 'listings')
 * @param imageUrl Full URL of the image to delete
 * @returns Promise<boolean> True if deletion was successful with any method
 */
export async function deleteImageFromStorage(
  supabase: any,
  bucket: "avatars" | "listings",
  imageUrl: string
): Promise<boolean> {
  if (!imageUrl) {
    console.warn("No image URL provided for deletion");
    return false;
  }

  try {
    console.log(`Attempting to delete image from ${bucket}:`, imageUrl);

    // Extract the path directly from the URL using a simpler approach
    // This matches the pattern in Supabase storage URLs
    let filePath: string | null = null;

    // First try: Extract path from storage/v1/object/public pattern (standard Supabase URL)
    const storagePathRegex = new RegExp(
      `/storage/v1/object/public/${bucket}/([^?#]+)`
    );
    let match = imageUrl.match(storagePathRegex);

    if (match && match[1]) {
      filePath = match[1];
      console.log(`Extracted file path (storage pattern): ${filePath}`);
    } else {
      // Second try: Extract path from direct bucket reference
      const bucketPathRegex = new RegExp(`/${bucket}/([^?#]+)`);
      match = imageUrl.match(bucketPathRegex);

      if (match && match[1]) {
        filePath = match[1];
        console.log(`Extracted file path (bucket pattern): ${filePath}`);
      } else {
        // Last resort: Try to extract just the filename
        const parts = imageUrl.split("/");
        const potentialFilename = parts[parts.length - 1].split("?")[0];

        if (potentialFilename && potentialFilename.length > 0) {
          filePath = potentialFilename;
          console.log(`Extracted file path (filename only): ${filePath}`);
        }
      }
    }

    if (!filePath) {
      console.error("Could not extract path from URL:", imageUrl);
      return false;
    }

    // Try to decode the URL if it contains encoded characters
    try {
      const decodedPath = decodeURIComponent(filePath);
      if (decodedPath !== filePath) {
        console.log(`Decoded file path: ${decodedPath}`);
        filePath = decodedPath;
      }
    } catch (error) {
      // If decoding fails, continue with the original path
      console.warn("Error decoding file path:", error);
    }

    // Attempt to delete the file
    console.log(`Attempting to delete file with path: ${filePath}`);

    // First attempt: Direct path
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (!error) {
      console.log(`Successfully deleted file: ${filePath}`);
      return true;
    }

    console.warn(`Error deleting file: ${error.message}`);

    // If direct deletion failed, try with the full path including bucket
    if (error) {
      console.log("Trying alternative deletion method...");

      // Try with just the filename (last part of the path)
      const filename = filePath.split("/").pop() || "";
      if (filename && filename !== filePath) {
        console.log(`Attempting to delete with just filename: ${filename}`);

        const { error: filenameError } = await supabase.storage
          .from(bucket)
          .remove([filename]);

        if (!filenameError) {
          console.log(`Successfully deleted file using filename: ${filename}`);
          return true;
        }

        console.warn(
          `Error deleting file using filename: ${filenameError.message}`
        );
      }
    }

    // If we got here, all deletion attempts failed
    console.error(`All deletion methods failed for image: ${imageUrl}`);
    return false;
  } catch (error) {
    console.error(`Error deleting image from ${bucket}:`, error);
    return false;
  }
}
