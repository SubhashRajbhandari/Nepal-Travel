import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { userStatusSchema } from "@/lib/validators/admin";

type UserRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: UserRouteProps) {
  const { session, response } = await requireAdmin();

  if (response) {
    return response;
  }

  const body = await request.json().catch(() => null);
  const parsed = userStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid user status." },
      { status: 400 },
    );
  }

  const { id } = await params;

  if (id === session?.user.id && parsed.data.status === "BLOCKED") {
    return NextResponse.json(
      { message: "Admin cannot block their own account." },
      { status: 400 },
    );
  }

  const user = await prisma.user.update({
    where: { id },
    data: { status: parsed.data.status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return NextResponse.json({ user });
}
