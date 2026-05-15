import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { destinationSuggestionSchema } from "@/lib/validators/suggestion";

export async function GET() {
  const session = await getCurrentUser();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const suggestions = await prisma.destinationSuggestion.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ suggestions });
}

export async function POST(request: Request) {
  const session = await getCurrentUser();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = destinationSuggestionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid suggestion data." },
      { status: 400 },
    );
  }

  const suggestion = await prisma.destinationSuggestion.create({
    data: {
      userId: session.user.id,
      name: parsed.data.name,
      categoryName: parsed.data.categoryName,
      location: parsed.data.location,
      description: parsed.data.description,
      estimatedBudget:
        typeof parsed.data.estimatedBudget === "number"
          ? parsed.data.estimatedBudget
          : null,
      bestTimeToVisit: parsed.data.bestTimeToVisit || null,
      difficulty: parsed.data.difficulty || null,
    },
  });

  return NextResponse.json({ suggestion }, { status: 201 });
}
