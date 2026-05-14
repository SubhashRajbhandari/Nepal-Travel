import { Search } from "lucide-react";
import { Difficulty } from "@/lib/generated/prisma/client";
import { formatDifficulty } from "@/lib/format";

type DestinationFiltersProps = {
  categories: {
    name: string;
    slug: string;
  }[];
  query?: string;
  category?: string;
  difficulty?: string;
  action?: string;
};

export function DestinationFilters({
  categories,
  query,
  category,
  difficulty,
  action = "/destinations",
}: DestinationFiltersProps) {
  return (
    <form
      action={action}
      className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_220px_180px_auto]"
    >
      <label className="relative">
        <span className="sr-only">Search destinations</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          name="query"
          defaultValue={query}
          placeholder="Search by name, location, category, or difficulty"
          className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <label>
        <span className="sr-only">Category</span>
        <select
          name="category"
          defaultValue={category ?? ""}
          className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="sr-only">Difficulty</span>
        <select
          name="difficulty"
          defaultValue={difficulty ?? ""}
          className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
        >
          <option value="">Any difficulty</option>
          {Object.values(Difficulty).map((item) => (
            <option key={item} value={item}>
              {formatDifficulty(item)}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="h-11 rounded-lg bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        Search
      </button>
    </form>
  );
}
