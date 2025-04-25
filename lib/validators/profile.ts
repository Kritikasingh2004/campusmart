import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  avatar_url: z.string().url().optional(),
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }).optional(),
  phone: z.string().regex(/^[0-9]{10}$/, {
    message: 'Phone number must be 10 digits.',
  }).optional(),
});
