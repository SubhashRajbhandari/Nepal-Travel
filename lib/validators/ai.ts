import { z } from "zod";
import { Difficulty } from "@/lib/generated/prisma/client";

export const itineraryRequestSchema = z.object({
  destinationId: z.string().min(1, "Destination is required."),
  duration: z.string().trim().min(1, "Duration is required."),
  budget: z.coerce.number().int().min(1000, "Budget must be at least NPR 1,000."),
  difficulty: z.enum([
    Difficulty.EASY,
    Difficulty.MODERATE,
    Difficulty.HARD,
    Difficulty.EXTREME,
  ]),
  travelStyle: z.string().trim().min(2, "Travel style is required."),
});
