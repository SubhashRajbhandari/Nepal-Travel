import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

type CategoryRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, { params }: CategoryRouteProps) {
  const { response } = await requireAdmin();

  if (response) {
    return response;
  }

  const { id } = await params;
  const destinationCount = await prisma.destination.count({
    where: { categoryId: id },
  });

  if (destinationCount > 0) {
    return NextResponse.json(
      { message: "Cannot delete a category that has destinations." },
      { status: 400 },
    );
  }

  await prisma.category.delete({ where: { id } });

  return NextResponse.json({ message: "Category deleted." });
}
