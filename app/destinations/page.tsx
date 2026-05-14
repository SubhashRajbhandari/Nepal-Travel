import { DestinationCard } from "@/components/destination/DestinationCard";
import { DestinationFilters } from "@/components/destination/DestinationFilters";
import { getDestinationCategories, getDestinations } from "@/lib/destinations";

type DestinationsPageProps = {
  searchParams: Promise<{
    query?: string;
    category?: string;
    difficulty?: string;
  }>;
};

export default async function DestinationsPage({ searchParams }: DestinationsPageProps) {
  const params = await searchParams;
  const [categories, destinations] = await Promise.all([
    getDestinationCategories(),
    getDestinations(params),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Explore Nepal
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Destinations</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Search and filter Nepal destinations by category, location, and difficulty level.
        </p>
      </div>

      <DestinationFilters
        categories={categories}
        query={params.query}
        category={params.category}
        difficulty={params.difficulty}
      />

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-950">{destinations.length}</span>{" "}
          destinations
        </p>
      </div>

      {destinations.length ? (
        <section className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </section>
      ) : (
        <section className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-950">No destinations found</h2>
          <p className="mt-2 text-sm text-slate-600">
            Try a different search word, category, or difficulty level.
          </p>
        </section>
      )}
    </main>
  );
}
