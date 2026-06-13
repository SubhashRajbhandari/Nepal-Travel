import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { formatDifficulty } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const statusStyles = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default async function MyReviewsPage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/reviews");
  }

  const reviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
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
    <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
      <Link href="/dashboard" className="text-sm font-semibold text-emerald-700">
        Back to dashboard
      </Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          My reviews
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Review history</h1>
        <p className="mt-3 text-slate-600">
          Reviews are shown publicly after admin approval.
        </p>
      </div>

      {reviews.length ? (
        <section className="mt-8 space-y-4">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Link
                    href={`/destinations/${review.destination.slug}`}
                    className="text-lg font-bold text-slate-950 hover:text-emerald-800"
                  >
                    {review.destination.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-600">{review.destination.location}</p>
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyles[review.status as keyof typeof statusStyles]
                  }`}
                >
                  {formatDifficulty(review.status)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-800">
                  {review.rating}/5 rating
                </span>
                {review.difficultyFeedback ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {formatDifficulty(review.difficultyFeedback)}
                  </span>
                ) : null}
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600">{review.remark}</p>
            </article>
          ))}
        </section>
      ) : (
        <section className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-950">No reviews yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Open a destination detail page and share your travel experience.
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
