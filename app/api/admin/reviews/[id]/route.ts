import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { refreshDestinationRating } from "@/lib/reviews";
import { reviewModerationSchema } from "@/lib/validators/suggestion";

type ReviewModerationRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: ReviewModerationRouteProps) {
  const { response } = await requireAdmin();

  if (response) {
    return response;
  }

  const body = await request.json().catch(() => null);
  const parsed = reviewModerationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid review status." },
      { status: 400 },
    );
  }

  const { id } = await params;
  const review = await prisma.review.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  await refreshDestinationRating(review.destinationId);

  return NextResponse.json({ review });
}
