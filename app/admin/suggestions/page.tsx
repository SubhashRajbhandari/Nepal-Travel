import Link from "next/link";
import { redirect } from "next/navigation";
import { ModerationButton } from "@/components/admin/ModerationButton";
import { getCurrentUser } from "@/lib/auth";
import { formatDifficulty, formatNepaliCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const statusStyles = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default async function AdminSuggestionsPage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/suggestions");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const suggestions = await prisma.destinationSuggestion.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
      <Link href="/admin" className="text-sm font-semibold text-emerald-700">
        Back to admin
      </Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Admin moderation
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Manage destination suggestions
        </h1>
        <p className="mt-3 text-slate-600">
          Review places suggested by users before adding them as destinations.
        </p>
      </div>

      <section className="mt-8 space-y-4">
        {suggestions.map((suggestion) => (
          <article key={suggestion.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="font-bold text-slate-950">{suggestion.name}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {suggestion.categoryName} · {suggestion.location}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Suggested by {suggestion.user.name} · {suggestion.user.email}
                </p>
              </div>
              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                  statusStyles[suggestion.status]
                }`}
              >
                {formatDifficulty(suggestion.status)}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">{suggestion.description}</p>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <Info label="Difficulty" value={suggestion.difficulty ? formatDifficulty(suggestion.difficulty) : "Not sure"} />
              <Info
                label="Budget"
                value={
                  suggestion.estimatedBudget
                    ? formatNepaliCurrency(suggestion.estimatedBudget)
                    : "Not provided"
                }
              />
              <Info label="Best time" value={suggestion.bestTimeToVisit ?? "Not provided"} />
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              <ModerationButton
                endpoint={`/api/admin/suggestions/${suggestion.id}`}
                status="APPROVED"
                label="Approve"
                variant="approve"
              />
              <ModerationButton
                endpoint={`/api/admin/suggestions/${suggestion.id}`}
                status="REJECTED"
                label="Reject"
                variant="reject"
              />
            </div>
          </article>
        ))}

        {!suggestions.length ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
            No destination suggestions have been submitted yet.
          </p>
        ) : null}
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-950">{value}</dd>
    </div>
  );
}
