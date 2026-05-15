import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminReportsPage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/reports");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [
    users,
    destinations,
    reviews,
    bookmarks,
    itineraries,
    suggestions,
    popularDestinations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.destination.count(),
    prisma.review.count(),
    prisma.bookmark.count(),
    prisma.itinerary.count(),
    prisma.destinationSuggestion.count(),
    prisma.destination.findMany({
      orderBy: [{ reviewCount: "desc" }, { averageRating: "desc" }],
      take: 5,
      select: {
        name: true,
        slug: true,
        reviewCount: true,
        averageRating: true,
        _count: {
          select: { bookmarks: true, itineraries: true },
        },
      },
    }),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
      <Link href="/admin" className="text-sm font-semibold text-emerald-700">
        Back to admin
      </Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Reports</h1>
        <p className="mt-3 text-slate-600">
          Simple activity reports for the Nepal Travel Recommendation project.
        </p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Users" value={users} />
        <Stat label="Destinations" value={destinations} />
        <Stat label="Reviews" value={reviews} />
        <Stat label="Bookmarks" value={bookmarks} />
        <Stat label="Saved plans" value={itineraries} />
        <Stat label="Suggestions" value={suggestions} />
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-bold text-slate-950">Popular destinations</h2>
        <div className="mt-5 space-y-4">
          {popularDestinations.map((destination) => (
            <article
              key={destination.slug}
              className="flex flex-col gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Link
                  href={`/destinations/${destination.slug}`}
                  className="font-semibold text-slate-950 hover:text-emerald-800"
                >
                  {destination.name}
                </Link>
                <p className="mt-1 text-sm text-slate-600">
                  {destination.reviewCount} reviews · {destination._count.bookmarks} bookmarks ·{" "}
                  {destination._count.itineraries} plans
                </p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                {destination.averageRating.toFixed(1)} rating
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
    </article>
  );
}
