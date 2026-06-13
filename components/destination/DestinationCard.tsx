import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Star, WalletCards } from "lucide-react";
import { Difficulty } from "@/lib/types";
import { getDestinationImage } from "@/lib/destination-images";
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
    imageUrls: string[];
    category: {
      name: string;
    };
  };
};

export function DestinationCard({ destination }: DestinationCardProps) {
  const imageUrl = getDestinationImage(destination.slug, destination.imageUrls);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative h-44 overflow-hidden">
        <Image
          src={imageUrl}
          alt={destination.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
      </div>
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
          className="mt-6 rounded-lg bg-emerald-700 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
