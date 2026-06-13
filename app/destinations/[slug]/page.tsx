import Link from "next/link";
import type React from "react";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Clock,
  MapPin,
  Pencil,
  ShieldCheck,
  Star,
  Utensils,
  WalletCards,
} from "lucide-react";
import { AITripPlanner } from "@/components/ai/AITripPlanner";
import { BookmarkButton } from "@/components/destination/BookmarkButton";
import { ReviewForm } from "@/components/destination/ReviewForm";
import { getCurrentUser } from "@/lib/auth";
import { getDestinationImage } from "@/lib/destination-images";
import { getDestinationBySlug } from "@/lib/destinations";
import { formatDifficulty, formatNepaliCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type DestinationDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DestinationDetailPage({
  params,
}: DestinationDetailPageProps) {
  const { slug } = await params;
  const [destination, session] = await Promise.all([
    getDestinationBySlug(slug),
    getCurrentUser(),
  ]);

  if (!destination) {
    notFound();
  }

  const imageUrl = getDestinationImage(destination.slug, destination.imageUrls);

  const bookmark = session?.user
    ? await prisma.bookmark.findUnique({
        where: {
          userId_destinationId: {
            userId: session.user.id,
            destinationId: destination.id,
          },
        },
        select: { id: true },
      })
    : null;

  return (
    <main className="flex-1 bg-[#f6f8f3]">
      <section
        className="relative overflow-hidden bg-slate-950 text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(15,23,42,0.9), rgba(15,23,42,0.62), rgba(15,23,42,0.18)), url(${imageUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="flex items-center justify-between">
            <Link href="/destinations" className="text-sm font-semibold text-emerald-300">
              Back to destinations
            </Link>
            {session?.user?.role === "ADMIN" ? (
              <Link
                href={`/admin/destinations/${destination.id}`}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Edit Destination
              </Link>
            ) : null}
          </div>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
                {destination.category.name}
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight">{destination.name}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
                {destination.description}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-5">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-300 text-amber-300" aria-hidden="true" />
                <span className="text-2xl font-bold">{destination.averageRating.toFixed(1)}</span>
                <span className="text-sm text-slate-300">from {destination.reviewCount} reviews</span>
              </div>
              <p className="mt-4 text-sm text-slate-300">{destination.location}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard icon={MapPin} label="Location" value={destination.location} />
            <InfoCard icon={Clock} label="Duration" value={destination.duration} />
            <InfoCard
              icon={WalletCards}
              label="Estimated budget"
              value={formatNepaliCurrency(destination.estimatedBudget)}
            />
            <InfoCard
              icon={CalendarDays}
              label="Best time"
              value={destination.bestTimeToVisit}
            />
          </div>

          <DetailSection title="Transportation">
            <p>{destination.transportation}</p>
          </DetailSection>

          <DetailSection title="Local Food Points" icon={Utensils}>
            <TagList items={destination.localFood} />
          </DetailSection>

          <DetailSection title="Nearby Attractions">
            <TagList items={destination.nearbyAttractions} />
          </DetailSection>

          <DetailSection title="Safety Tips" icon={ShieldCheck}>
            <ul className="grid gap-2">
              {destination.safetyTips.map((tip) => (
                <li key={tip} className="rounded-lg bg-emerald-50 px-4 py-3 text-emerald-950">
                  {tip}
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="Reviews">
            <ReviewForm destinationId={destination.id} isLoggedIn={Boolean(session?.user)} />

            {destination.reviews.length ? (
              <div className="mt-5 space-y-4">
                {destination.reviews.map((review) => (
                  <article key={review.id} className="rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-slate-950">{review.user.name}</h3>
                      <span className="text-sm font-semibold text-amber-700">
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{review.remark}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
                No approved reviews yet. Review submission will be added in the reviews step.
              </p>
            )}
          </DetailSection>
        </div>

        <div className="space-y-5">
          <aside className="h-fit rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-950">Trip snapshot</h2>
            <div className="mt-5">
              <BookmarkButton
                destinationId={destination.id}
                isBookmarked={Boolean(bookmark)}
                isLoggedIn={Boolean(session?.user)}
              />
            </div>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-slate-500">Difficulty</dt>
                <dd className="mt-1 text-slate-950">
                  {formatDifficulty(destination.difficulty)}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Category</dt>
                <dd className="mt-1 text-slate-950">{destination.category.name}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Map</dt>
                <dd className="mt-1">
                  {destination.mapLink ? (
                    <a className="font-semibold text-emerald-700" href={destination.mapLink}>
                      Open map
                    </a>
                  ) : (
                    <span className="text-slate-600">Map link will be added by admin.</span>
                  )}
                </dd>
              </div>
            </dl>
          </aside>

          <div>
            <AITripPlanner
              destinationId={destination.id}
              defaultDuration={destination.duration}
              defaultBudget={destination.estimatedBudget}
              defaultDifficulty={destination.difficulty}
              isLoggedIn={Boolean(session?.user)}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

type IconComponent = React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: IconComponent;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <Icon className="h-5 w-5 text-emerald-700" aria-hidden={true} />
      <dt className="mt-3 text-sm font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-950">{value}</dd>
    </div>
  );
}

function DetailSection({
  title,
  children,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: IconComponent;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        {Icon ? <Icon className="h-5 w-5 text-emerald-700" aria-hidden={true} /> : null}
        <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      </div>
      <div className="text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
          {item}
        </span>
      ))}
    </div>
  );
}
