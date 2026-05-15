import Link from "next/link";
import { redirect } from "next/navigation";
import { SuggestionForm } from "@/components/suggestions/SuggestionForm";
import { getCurrentUser } from "@/lib/auth";
import { formatDifficulty } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const statusStyles = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default async function SuggestDestinationPage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/suggest-destination");
  }

  const suggestions = await prisma.destinationSuggestion.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
      <Link href="/dashboard" className="text-sm font-semibold text-emerald-700">
        Back to dashboard
      </Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Suggest destination
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Recommend a new place</h1>
        <p className="mt-3 text-slate-600">
          Share a Nepal destination that should be added to the platform.
        </p>
      </div>

      <div className="mt-8">
        <SuggestionForm />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-950">Your suggestions</h2>
        {suggestions.length ? (
          <div className="mt-4 space-y-4">
            {suggestions.map((suggestion) => (
              <article key={suggestion.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-bold text-slate-950">{suggestion.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {suggestion.categoryName} · {suggestion.location}
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
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {suggestion.description}
                </p>
                {suggestion.adminNote ? (
                  <p className="mt-3 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Admin note: {suggestion.adminNote}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            You have not submitted any destination suggestions yet.
          </p>
        )}
      </section>
    </main>
  );
}
