import { z } from "zod";
import { Difficulty } from "@/lib/types";

export const userStatusSchema = z.object({
  status: z.enum(["ACTIVE", "PENDING", "BLOCKED"]),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name is required."),
  description: z.string().trim().optional(),
});

export const destinationSchema = z.object({
  name: z.string().trim().min(2, "Destination name is required."),
  categoryId: z.string().min(1, "Category is required."),
  description: z.string().trim().min(20, "Description must be at least 20 characters."),
  location: z.string().trim().min(2, "Location is required."),
  mapLink: z.string().trim().optional(),
  estimatedBudget: z.coerce.number().int().min(0),
  bestTimeToVisit: z.string().trim().min(2, "Best time to visit is required."),
  duration: z.string().trim().min(1, "Duration is required."),
  difficulty: z.enum([
    Difficulty.EASY,
    Difficulty.MODERATE,
    Difficulty.HARD,
    Difficulty.EXTREME,
  ]),
  localFood: z.string().trim().min(2, "Local food is required."),
  nearbyAttractions: z.string().trim().min(2, "Nearby attractions are required."),
  transportation: z.string().trim().min(5, "Transportation details are required."),
  safetyTips: z.string().trim().min(5, "Safety tips are required."),
  imageUrls: z.string().trim().optional(),
  isFeatured: z.boolean().optional(),
});
