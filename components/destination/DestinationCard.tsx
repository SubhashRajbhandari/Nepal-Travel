import Link from "next/link";
import { Clock, MapPin, WalletCards } from "lucide-react";
import type { Difficulty } from "@/lib/generated/prisma/client";
import { formatDifficulty, formatNepaliCurrency } from "@/lib/format";

type DestinationCardProps = {
  destination: {
    name: string;
    slug: string;
    description: string;
    location: string;
    duration: string;
    difficulty: Difficulty;
    estimatedBudget: number;
    averageRating: number;
    category: {
      name: string;
    };
  };
};

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="h-36 bg-[linear-gradient(135deg,#047857,#0f766e_45%,#f59e0b)]" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {destination.category.name}
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">{destination.name}</h2>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            {destination.averageRating.toFixed(1)}
          </span>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {destination.description}
        </p>

        <dl className="mt-5 grid gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            <span>{destination.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            <span>
              {destination.duration} · {formatDifficulty(destination.difficulty)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <WalletCards className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            <span>{formatNepaliCurrency(destination.estimatedBudget)}</span>
          </div>
        </dl>

        <Link
          href={`/destinations/${destination.slug}`}
          className="mt-6 rounded-lg bg-slate-950 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
