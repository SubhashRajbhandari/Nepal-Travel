import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validators/engagement";

export async function GET() {
  const session = await getCurrentUser();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      destination: {
        select: {
          name: true,
          slug: true,
          location: true,
        },
      },
    },
  });

  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const session = await getCurrentUser();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid review data." },
      { status: 400 },
    );
  }

  const destination = await prisma.destination.findUnique({
    where: { id: parsed.data.destinationId },
    select: { id: true },
  });

  if (!destination) {
    return NextResponse.json({ message: "Destination not found." }, { status: 404 });
  }

  const review = await prisma.review.upsert({
    where: {
      userId_destinationId: {
        userId: session.user.id,
        destinationId: parsed.data.destinationId,
      },
    },
    update: {
      rating: parsed.data.rating,
      remark: parsed.data.remark,
      difficultyFeedback: parsed.data.difficultyFeedback,
      status: "PENDING",
    },
    create: {
      userId: session.user.id,
      destinationId: parsed.data.destinationId,
      rating: parsed.data.rating,
      remark: parsed.data.remark,
      difficultyFeedback: parsed.data.difficultyFeedback,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
