import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/slug";
import { categorySchema } from "@/lib/validators/admin";

export async function POST(request: Request) {
  const { response } = await requireAdmin();

  if (response) {
    return response;
  }

  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid category data." },
      { status: 400 },
    );
  }

  const category = await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug: createSlug(parsed.data.name),
      description: parsed.data.description || null,
    },
  });

  return NextResponse.json({ category }, { status: 201 });
}
