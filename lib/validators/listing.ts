import { z } from 'zod';

export const listingSchema = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters.',
  }).max(100, {
    message: 'Title must be less than 100 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }).max(1000, {
    message: 'Description must be less than 1000 characters.',
  }),
  price: z.number().min(1, {
    message: 'Price must be at least ₹1.',
  }).max(1000000, {
    message: 'Price must be less than ₹1,000,000.',
  }),
  image_url: z.string().url().optional(),
  location: z.string().min(2, {
    message: 'Location is required.',
  }),
  category: z.string().min(2, {
    message: 'Category is required.',
  }),
});
