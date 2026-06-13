import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { Difficulty } from "@/lib/types";
import { parseDestination } from "@/lib/parsers";

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
      { name: { contains: query } },
      { location: { contains: query } },
      { description: { contains: query } },
      { category: { name: { contains: query } } },
    ];
  }

  const destinations = await prisma.destination.findMany({
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

  return destinations.map(parseDestination);
}

export async function getDestinationBySlug(slug: string) {
  const destination = await prisma.destination.findUnique({
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

  if (!destination) return null;
  return parseDestination(destination);
}
