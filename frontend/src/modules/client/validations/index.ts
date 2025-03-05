import * as z from 'zod';

// Guest Checkout Schema
export const guestSchema = z.object({
  email: z
    .string()
    .email('Invalid email address'),
});

export type GuestFormData = z.infer<
  typeof guestSchema
>;
