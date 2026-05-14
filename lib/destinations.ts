import { Difficulty, Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type DestinationSearchParams = {
  query?: string;
  category?: string;
  difficulty?: string;
};

export async function getDestinationCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      name: true,
      slug: true,
    },
  });
}

export async function getDestinations(params: DestinationSearchParams) {
  const query = params.query?.trim();
  const where: Prisma.DestinationWhereInput = {};

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (
    params.difficulty &&
    Object.values(Difficulty).includes(params.difficulty as Difficulty)
  ) {
    where.difficulty = params.difficulty as Difficulty;
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { location: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { category: { name: { contains: query, mode: "insensitive" } } },
    ];
  }

  return prisma.destination.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function getDestinationBySlug(slug: string) {
  return prisma.destination.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}
