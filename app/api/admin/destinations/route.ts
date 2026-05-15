import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { destinationSchema } from "@/lib/validators/admin";

export async function POST(request: Request) {
  const { response } = await requireAdmin();

  if (response) {
    return response;
  }

  const body = await request.json().catch(() => null);
  const parsed = destinationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid destination data." },
      { status: 400 },
    );
  }

  const destination = await prisma.destination.create({
    data: {
      name: parsed.data.name,
      slug: createSlug(parsed.data.name),
      categoryId: parsed.data.categoryId,
      description: parsed.data.description,
      location: parsed.data.location,
      mapLink: parsed.data.mapLink || null,
      estimatedBudget: parsed.data.estimatedBudget,
      bestTimeToVisit: parsed.data.bestTimeToVisit,
      duration: parsed.data.duration,
      difficulty: parsed.data.difficulty,
      localFood: splitLines(parsed.data.localFood),
      nearbyAttractions: splitLines(parsed.data.nearbyAttractions),
      transportation: parsed.data.transportation,
      safetyTips: splitLines(parsed.data.safetyTips),
      imageUrls: splitLines(parsed.data.imageUrls ?? ""),
      isFeatured: parsed.data.isFeatured ?? false,
    },
  });

  return NextResponse.json({ destination }, { status: 201 });
}

function splitLines(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}
