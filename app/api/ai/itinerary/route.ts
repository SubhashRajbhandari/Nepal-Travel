import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateItinerary } from "@/lib/ai/itinerary";
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
      { message: parsed.error.issues[0]?.message ?? "Invalid itinerary request." },
      { status: 400 },
    );
  }

  const destination = await prisma.destination.findUnique({
    where: { id: parsed.data.destinationId },
  });

  if (!destination) {
    return NextResponse.json({ message: "Destination not found." }, { status: 404 });
  }

  const generated = await generateItinerary({
    destination,
    duration: parsed.data.duration,
    budget: parsed.data.budget,
    difficulty: parsed.data.difficulty,
    travelStyle: parsed.data.travelStyle,
  });

  const itinerary = await prisma.itinerary.create({
    data: {
      userId: session.user.id,
      destinationId: destination.id,
      title: generated.title,
      duration: parsed.data.duration,
      budget: parsed.data.budget,
      difficulty: parsed.data.difficulty,
      travelStyle: parsed.data.travelStyle,
      planJson: generated.plan,
      budgetJson: generated.budget,
      summary: generated.summary,
      aiProvider: generated.provider,
    },
  });

  return NextResponse.json(
    {
      itinerary,
      generated,
      usedFallback: generated.provider === "fallback",
    },
    { status: 201 },
  );
}
