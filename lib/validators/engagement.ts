import { z } from "zod";
import { Difficulty } from "@/lib/generated/prisma/client";

export const bookmarkSchema = z.object({
  destinationId: z.string().min(1, "Destination is required."),
});

export const reviewSchema = z.object({
  destinationId: z.string().min(1, "Destination is required."),
  rating: z.coerce.number().int().min(1).max(5),
  remark: z.string().trim().min(10, "Review must be at least 10 characters."),
  difficultyFeedback: z
    .enum([
      Difficulty.EASY,
      Difficulty.MODERATE,
      Difficulty.HARD,
      Difficulty.EXTREME,
    ])
    .optional(),
});
