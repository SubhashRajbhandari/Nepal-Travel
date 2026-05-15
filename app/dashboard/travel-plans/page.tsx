import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { formatDifficulty, formatNepaliCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type BudgetJson = {
  food?: number;
  transport?: number;
  accommodation?: number;
  activities?: number;
  total?: number;
};

export default async function TravelPlansPage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/travel-plans");
  }

  const itineraries = await prisma.itinerary.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      destination: {
        select: {
          name: true,
          slug: true,
          location: true,
        },
      },
    },
  });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
      <Link href="/dashboard" className="text-sm font-semibold text-emerald-700">
        Back to dashboard
      </Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Travel plans
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Saved AI itineraries</h1>
        <p className="mt-3 text-slate-600">
          Plans generated from destination detail pages are saved here.
        </p>
      </div>

      {itineraries.length ? (
        <section className="mt-8 space-y-5">
          {itineraries.map((itinerary) => {
            const budget = itinerary.budgetJson as BudgetJson;

            return (
              <article key={itinerary.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      {itinerary.aiProvider === "fallback" ? "Fallback planner" : "AI planner"}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-slate-950">
                      {itinerary.title}
                    </h2>
                    <Link
                      href={`/destinations/${itinerary.destination.slug}`}
                      className="mt-1 inline-flex text-sm font-semibold text-emerald-700"
                    >
                      {itinerary.destination.name}
                    </Link>
                  </div>
                  <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {formatDifficulty(itinerary.difficulty)}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">{itinerary.summary}</p>

                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
                  <PlanStat label="Duration" value={itinerary.duration} />
                  <PlanStat label="Style" value={itinerary.travelStyle} />
                  <PlanStat label="Budget" value={formatNepaliCurrency(itinerary.budget)} />
                  <PlanStat
                    label="Estimated total"
                    value={formatNepaliCurrency(budget.total ?? itinerary.budget)}
                  />
                </dl>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-950">No travel plans yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Open a destination and generate a plan with the AI trip planner.
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

function PlanStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-950">{value}</dd>
    </div>
  );
}
