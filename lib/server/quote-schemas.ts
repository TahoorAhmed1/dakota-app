import { z } from "zod";

export const hunterInputSchema = z.object({
  name: z.string().trim().max(120).optional(),
  discountCode: z.string().trim().min(1).max(64).optional(),
  extraDays: z.coerce.number().int().min(0).max(7).optional(),
  extraNights: z.coerce.number().int().min(0).max(7).optional(),
});

export const quoteCalculationSchema = z.object({
  campId: z.string().trim().min(1),
  weekId: z.string().trim().min(1),
  packageId: z.string().trim().min(1),
  hunterCount: z.coerce.number().int().min(1).max(50),
  earlyBird: z.boolean(),
  hunters: z.array(hunterInputSchema),
});

export const quoteSubmitSchema = quoteCalculationSchema.extend({
  quoteEmail: z.string().email().optional().or(z.literal("")),
  bookingName: z.string().trim().min(1).max(120),
  bookingEmail: z.string().email(),
  seasonLabel: z.string().trim().min(1).max(120),
});

export const quickQuoteSchema = z.object({
  campId: z.string().trim().min(1),
  weekId: z.string().trim().min(1),
  earlyBird: z.boolean().default(true),
});
