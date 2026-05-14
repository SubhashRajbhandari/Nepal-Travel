import Link from "next/link";
import { redirect } from "next/navigation";
import { DestinationCard } from "@/components/destination/DestinationCard";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SavedDestinationsPage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/saved-destinations");
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      destination: {
        include: {
          category: {
            select: { name: true },
          },
        },
      },
    },
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
      <Link href="/dashboard" className="text-sm font-semibold text-emerald-700">
        Back to dashboard
      </Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Saved destinations
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Your bookmarked places</h1>
        <p className="mt-3 text-slate-600">
          Keep track of destinations you may want to visit later.
        </p>
      </div>

      {bookmarks.length ? (
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <DestinationCard key={bookmark.id} destination={bookmark.destination} />
          ))}
        </section>
      ) : (
        <section className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-950">No saved destinations yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Browse destinations and save the places you like.
          </p>
          <Link
            href="/destinations"
            className="mt-5 inline-flex rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Explore destinations
          </Link>
        </section>
      )}
    </main>
  );
}
