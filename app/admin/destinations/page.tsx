import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getCurrentUser } from "@/lib/auth";
import { formatDifficulty, formatNepaliCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminDestinationsPage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/destinations");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
    include: {
      category: {
        select: { name: true },
      },
      _count: {
        select: { reviews: true, bookmarks: true, itineraries: true },
      },
    },
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
      <Link href="/admin" className="text-sm font-semibold text-emerald-700">
        Back to admin
      </Link>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Manage destinations</h1>
          <p className="mt-3 text-slate-600">
            Add and remove destination records shown on the public pages.
          </p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Add destination
        </Link>
      </div>

      <section className="mt-8 space-y-4">
        {destinations.map((destination) => (
          <article key={destination.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Link
                  href={`/destinations/${destination.slug}`}
                  className="font-bold text-slate-950 hover:text-emerald-800"
                >
                  {destination.name}
                </Link>
                <p className="mt-1 text-sm text-slate-600">
                  {destination.category.name} · {destination.location} ·{" "}
                  {formatDifficulty(destination.difficulty)}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {formatNepaliCurrency(destination.estimatedBudget)} ·{" "}
                  {destination._count.reviews} reviews · {destination._count.bookmarks} saves ·{" "}
                  {destination._count.itineraries} plans
                </p>
              </div>
              <DeleteButton endpoint={`/api/admin/destinations/${destination.id}`} />
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
