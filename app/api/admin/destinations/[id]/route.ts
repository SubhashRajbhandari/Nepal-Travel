import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

type DestinationRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, { params }: DestinationRouteProps) {
  const { response } = await requireAdmin();

  if (response) {
    return response;
  }

  const { id } = await params;

  await prisma.destination.delete({ where: { id } });

  return NextResponse.json({ message: "Destination deleted." });
}
