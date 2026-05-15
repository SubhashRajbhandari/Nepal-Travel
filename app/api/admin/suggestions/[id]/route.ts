import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { moderationSchema } from "@/lib/validators/suggestion";

type SuggestionModerationRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: SuggestionModerationRouteProps) {
  const { response } = await requireAdmin();

  if (response) {
    return response;
  }

  const body = await request.json().catch(() => null);
  const parsed = moderationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid moderation data." },
      { status: 400 },
    );
  }

  const { id } = await params;
  const suggestion = await prisma.destinationSuggestion.update({
    where: { id },
    data: {
      status: parsed.data.status,
      adminNote: parsed.data.adminNote || null,
    },
  });

  return NextResponse.json({ suggestion });
}
