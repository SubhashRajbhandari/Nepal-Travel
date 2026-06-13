import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DestinationForm } from "@/components/admin/DestinationForm";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type EditDestinationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditDestinationPage({ params }: EditDestinationPageProps) {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/destinations");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { id } = await params;

  const [categories, destination] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.destination.findUnique({
      where: { id },
    }),
  ]);

  if (!destination) {
    notFound();
  }

  // Parse JSON stringified arrays from SQLite back into string arrays
  const parsedLocalFood = JSON.parse(destination.localFood as string) as string[];
  const parsedNearbyAttractions = JSON.parse(destination.nearbyAttractions as string) as string[];
  const parsedSafetyTips = JSON.parse(destination.safetyTips as string) as string[];
  const parsedImageUrls = JSON.parse(destination.imageUrls as string) as string[];

  const initialData = {
    ...destination,
    localFood: parsedLocalFood,
    nearbyAttractions: parsedNearbyAttractions,
    safetyTips: parsedSafetyTips,
    imageUrls: parsedImageUrls,
  };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
      <Link href={`/destinations/${destination.slug}`} className="text-sm font-semibold text-emerald-700">
        Back to destination
      </Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Edit destination</h1>
        <p className="mt-3 text-slate-600">
          Update practical travel details for {destination.name}.
        </p>
      </div>

      <div className="mt-8">
        <DestinationForm categories={categories} initialData={initialData} />
      </div>
    </main>
  );
}
