import { z } from "zod";
import { Difficulty } from "@/lib/generated/prisma/client";

export const destinationSuggestionSchema = z.object({
  name: z.string().trim().min(2, "Destination name is required."),
  categoryName: z.string().trim().min(2, "Category is required."),
  location: z.string().trim().min(2, "Location is required."),
  description: z.string().trim().min(20, "Description must be at least 20 characters."),
  estimatedBudget: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.coerce.number().int().min(0, "Estimated budget cannot be negative.").optional(),
  ),
  bestTimeToVisit: z.string().trim().optional(),
  difficulty: z
    .enum([
      Difficulty.EASY,
      Difficulty.MODERATE,
      Difficulty.HARD,
      Difficulty.EXTREME,
    ])
    .optional()
    .or(z.literal("")),
});

export const moderationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  adminNote: z.string().trim().optional(),
});

export const reviewModerationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "PENDING"]),
});
