"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UseFormSubmitOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  redirectTo?: string;
}

export function useFormSubmit<T>({
  onSuccess,
  onError,
  successMessage = "Operation completed successfully",
  errorMessage = "An error occurred",
  redirectTo,
}: UseFormSubmitOptions<T> = {}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async (
    submitFn: () => Promise<T>,
    options?: {
      successMessage?: string;
      errorMessage?: string;
      redirectTo?: string;
    }
  ) => {
    const finalSuccessMessage = options?.successMessage || successMessage;
    const finalErrorMessage = options?.errorMessage || errorMessage;
    const finalRedirectTo = options?.redirectTo || redirectTo;

    setIsSubmitting(true);
    setError(null);

    try {
      const data = await submitFn();
      
      if (finalSuccessMessage) {
        toast.success(finalSuccessMessage);
      }
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      if (finalRedirectTo) {
        router.push(finalRedirectTo);
      }
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      if (finalErrorMessage) {
        toast.error(`${finalErrorMessage}: ${error.message}`);
      }
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    error,
  };
}
