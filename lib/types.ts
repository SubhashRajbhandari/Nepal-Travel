import { Destination as PrismaDestination } from "@/lib/generated/prisma/client";

export type AppDestination = Omit<
  PrismaDestination,
  "imageUrls" | "localFood" | "nearbyAttractions" | "safetyTips"
> & {
  imageUrls: string[];
  localFood: string[];
  nearbyAttractions: string[];
  safetyTips: string[];
};

export enum Difficulty {
  EASY = "EASY",
  MODERATE = "MODERATE",
  HARD = "HARD",
  EXTREME = "EXTREME",
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  BLOCKED = "BLOCKED",
}

export enum ReviewStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum SuggestionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
