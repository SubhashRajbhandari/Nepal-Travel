import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type BookmarkRouteProps = {
  params: Promise<{
    destinationId: string;
  }>;
};

export async function DELETE(_request: Request, { params }: BookmarkRouteProps) {
  const session = await getCurrentUser();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { destinationId } = await params;

  await prisma.bookmark.deleteMany({
    where: {
      destinationId,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ message: "Bookmark removed." });
}
