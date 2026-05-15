import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateBudgetEstimate } from "@/lib/ai/itinerary";
import { prisma } from "@/lib/prisma";
import { itineraryRequestSchema } from "@/lib/validators/ai";

export async function POST(request: Request) {
  const session = await getCurrentUser();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = itineraryRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid budget request." },
      { status: 400 },
    );
  }

  const destination = await prisma.destination.findUnique({
    where: { id: parsed.data.destinationId },
  });

  if (!destination) {
    return NextResponse.json({ message: "Destination not found." }, { status: 404 });
  }

  const budget = await generateBudgetEstimate({
    destination,
    duration: parsed.data.duration,
    budget: parsed.data.budget,
    difficulty: parsed.data.difficulty,
    travelStyle: parsed.data.travelStyle,
  });

  return NextResponse.json({
    budget,
    usedFallback: budget.provider === "fallback",
  });
}
