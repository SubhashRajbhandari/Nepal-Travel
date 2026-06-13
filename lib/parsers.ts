import { Destination } from "@/lib/generated/prisma/client";
import { AppDestination } from "@/lib/types";

export function parseDestination<T extends Destination>(
  destination: T
): Omit<T, "imageUrls" | "localFood" | "nearbyAttractions" | "safetyTips" | "difficulty"> & {
  imageUrls: string[];
  localFood: string[];
  nearbyAttractions: string[];
  safetyTips: string[];
  difficulty: import("@/lib/types").Difficulty;
} {
  return {
    ...destination,
    imageUrls: safeParseJSON(destination.imageUrls),
    localFood: safeParseJSON(destination.localFood),
    nearbyAttractions: safeParseJSON(destination.nearbyAttractions),
    safetyTips: safeParseJSON(destination.safetyTips),
    difficulty: destination.difficulty as import("@/lib/types").Difficulty,
  };
}

function safeParseJSON(value: string | undefined | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
