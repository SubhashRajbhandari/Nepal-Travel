import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookmarkSchema } from "@/lib/validators/engagement";

export async function GET() {
  const session = await getCurrentUser();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      destination: {
        include: {
          category: {
            select: { name: true },
          },
        },
      },
    },
  });

  return NextResponse.json({ bookmarks });
}

export async function POST(request: Request) {
  const session = await getCurrentUser();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = bookmarkSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid bookmark data." },
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

  const bookmark = await prisma.bookmark.upsert({
    where: {
      userId_destinationId: {
        userId: session.user.id,
        destinationId: parsed.data.destinationId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      destinationId: parsed.data.destinationId,
    },
  });

  return NextResponse.json({ bookmark }, { status: 201 });
}
