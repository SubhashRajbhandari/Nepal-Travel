import Link from "next/link";
import { redirect } from "next/navigation";
import { ModerationButton } from "@/components/admin/ModerationButton";
import { getCurrentUser } from "@/lib/auth";
import { formatDifficulty } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const statusStyles = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default async function AdminReviewsPage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/reviews");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const reviews = await prisma.review.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      destination: {
        select: { name: true, slug: true },
      },
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
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Manage reviews</h1>
        <p className="mt-3 text-slate-600">
          Approve useful reviews so they appear publicly on destination pages.
        </p>
      </div>

      <section className="mt-8 space-y-4">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Link
                  href={`/destinations/${review.destination.slug}`}
                  className="font-bold text-slate-950 hover:text-emerald-800"
                >
                  {review.destination.name}
                </Link>
                <p className="mt-1 text-sm text-slate-600">
                  {review.user.name} · {review.user.email} · {review.rating}/5 rating
                </p>
              </div>
              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                  statusStyles[review.status as keyof typeof statusStyles]
                }`}
              >
                {formatDifficulty(review.status)}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">{review.remark}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              <ModerationButton
                endpoint={`/api/admin/reviews/${review.id}`}
                status="APPROVED"
                label="Approve"
                variant="approve"
              />
              <ModerationButton
                endpoint={`/api/admin/reviews/${review.id}`}
                status="REJECTED"
                label="Reject"
                variant="reject"
              />
              <ModerationButton
                endpoint={`/api/admin/reviews/${review.id}`}
                status="PENDING"
                label="Mark pending"
              />
            </div>
          </article>
        ))}

        {!reviews.length ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
            No reviews have been submitted yet.
          </p>
        ) : null}
      </section>
    </main>
  );
}
