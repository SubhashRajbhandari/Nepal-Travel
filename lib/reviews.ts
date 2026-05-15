import { prisma } from "@/lib/prisma";

export async function refreshDestinationRating(destinationId: string) {
  const aggregate = await prisma.review.aggregate({
    where: {
      destinationId,
      status: "APPROVED",
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  await prisma.destination.update({
    where: { id: destinationId },
    data: {
      averageRating: aggregate._avg.rating ?? 0,
      reviewCount: aggregate._count.rating,
    },
  });
}
