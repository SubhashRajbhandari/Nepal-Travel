import OpenAI from "openai";
import { Destination } from "@/lib/generated/prisma/client";
import { Difficulty } from "@/lib/types";
import { formatDifficulty } from "@/lib/format";

export type ItineraryInput = {
  destination: Pick<
    Destination,
    | "name"
    | "description"
    | "location"
    | "estimatedBudget"
    | "bestTimeToVisit"
    | "duration"
    | "difficulty"
    | "localFood"
    | "nearbyAttractions"
    | "transportation"
    | "safetyTips"
  >;
  duration: string;
  budget: number;
  difficulty: Difficulty;
  travelStyle: string;
};

export type GeneratedItinerary = {
  title: string;
  summary: string;
  plan: {
    day: number;
    title: string;
    activities: string[];
    foodSuggestion: string;
    safetyNote: string;
  }[];
  budget: {
    food: number;
    transport: number;
    accommodation: number;
    activities: number;
    total: number;
  };
  provider: "openai" | "fallback";
};

export type GeneratedBudget = GeneratedItinerary["budget"] & {
  notes: string[];
  provider: "openai" | "fallback";
};

export async function generateItinerary(input: ItineraryInput): Promise<GeneratedItinerary> {
  if (!process.env.AI_API_KEY) {
    return generateFallbackItinerary(input);
  }

  try {
    const client = new OpenAI({ apiKey: process.env.AI_API_KEY });
    const response = await client.responses.create({
      model: process.env.AI_MODEL ?? "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You generate practical Nepal travel plans for a college project app. Return only valid JSON.",
        },
        {
          role: "user",
          content: JSON.stringify({
            task: "Generate a structured travel itinerary and budget estimate.",
            destination: input.destination,
            requestedDuration: input.duration,
            requestedBudgetNpr: input.budget,
            requestedDifficulty: input.difficulty,
            travelStyle: input.travelStyle,
            outputShape: {
              title: "string",
              summary: "string",
              plan: [
                {
                  day: "number",
                  title: "string",
                  activities: ["string"],
                  foodSuggestion: "string",
                  safetyNote: "string",
                },
              ],
              budget: {
                food: "number",
                transport: "number",
                accommodation: "number",
                activities: "number",
                total: "number",
              },
            },
          }),
        },
      ],
    });

    const parsed = JSON.parse(response.output_text) as Omit<
      GeneratedItinerary,
      "provider"
    >;

    return {
      title: parsed.title,
      summary: parsed.summary,
      plan: parsed.plan,
      budget: parsed.budget,
      provider: "openai",
    };
  } catch {
    return generateFallbackItinerary(input);
  }
}

function generateFallbackItinerary(input: ItineraryInput): GeneratedItinerary {
  const dayCount = getDayCount(input.duration);
  const budget = splitBudget(input.budget);
  const attractions = input.destination.nearbyAttractions.length
    ? input.destination.nearbyAttractions
    : [input.destination.name];
  const foods = input.destination.localFood.length
    ? input.destination.localFood
    : ["Dal bhat"];
  const safetyTips = input.destination.safetyTips.length
    ? input.destination.safetyTips
    : ["Follow local guidance and check conditions before traveling."];

  return {
    title: `${input.destination.name} ${input.duration} ${input.travelStyle} plan`,
    summary: `${input.destination.name} is suitable for a ${input.travelStyle.toLowerCase()} trip with ${formatDifficulty(
      input.difficulty,
    ).toLowerCase()} difficulty. Best time to visit: ${input.destination.bestTimeToVisit}.`,
    plan: Array.from({ length: dayCount }, (_, index) => ({
      day: index + 1,
      title:
        index === 0
          ? `Arrive in ${input.destination.name}`
          : `Explore ${attractions[index % attractions.length]}`,
      activities:
        index === 0
          ? [
              `Travel toward ${input.destination.location}`,
              input.destination.transportation,
              "Rest and prepare for the next day",
            ]
          : [
              `Visit ${attractions[index % attractions.length]}`,
              "Take photos and learn local culture",
              "Review weather, route, and safety conditions",
            ],
      foodSuggestion: foods[index % foods.length],
      safetyNote: safetyTips[index % safetyTips.length],
    })),
    budget,
    provider: "fallback",
  };
}

function getDayCount(duration: string) {
  const match = duration.match(/\d+/);
  const parsed = match ? Number(match[0]) : 3;

  return Math.min(Math.max(parsed, 1), 14);
}

export async function generateBudgetEstimate(input: ItineraryInput): Promise<GeneratedBudget> {
  if (!process.env.AI_API_KEY) {
    return {
      ...splitBudget(input.budget),
      notes: [
        `Estimated for ${input.destination.name} using local fallback rules.`,
        `Requested style: ${input.travelStyle}.`,
      ],
      provider: "fallback",
    };
  }

  try {
    const client = new OpenAI({ apiKey: process.env.AI_API_KEY });
    const response = await client.responses.create({
      model: process.env.AI_MODEL ?? "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "Estimate Nepal travel budgets. Return only valid JSON with food, transport, accommodation, activities, total, and notes.",
        },
        {
          role: "user",
          content: JSON.stringify({
            destination: input.destination,
            duration: input.duration,
            budgetNpr: input.budget,
            difficulty: input.difficulty,
            travelStyle: input.travelStyle,
          }),
        },
      ],
    });

    const parsed = JSON.parse(response.output_text) as Omit<GeneratedBudget, "provider">;

    return {
      ...parsed,
      provider: "openai",
    };
  } catch {
    return {
      ...splitBudget(input.budget),
      notes: ["AI budget estimation failed, so a fallback estimate was used."],
      provider: "fallback",
    };
  }
}

function splitBudget(total: number) {
  const food = Math.round(total * 0.22);
  const transport = Math.round(total * 0.28);
  const accommodation = Math.round(total * 0.32);
  const activities = total - food - transport - accommodation;

  return {
    food,
    transport,
    accommodation,
    activities,
    total,
  };
}
