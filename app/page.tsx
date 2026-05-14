import Link from "next/link";
import { MapPin, Mountain, Route, Sparkles } from "lucide-react";

const highlights = [
  {
    title: "Explore Nepal destinations",
    description: "Browse trekking trails, religious places, natural spots, routes, and culture.",
    icon: Mountain,
  },
  {
    title: "Plan smarter trips",
    description: "Generate structured itineraries and budget estimates for saved destinations.",
    icon: Sparkles,
  },
  {
    title: "Use local travel details",
    description: "Check food points, best season, difficulty, transport, safety, and maps.",
    icon: MapPin,
  },
  {
    title: "Support tourism",
    description: "Share reviews and suggest new destinations for admin review.",
    icon: Route,
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Nepal Travel Recommendation Web App
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              Discover destinations, estimate budgets, and plan trips across Nepal.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              A student-friendly full-stack travel platform for exploring Nepal, saving
              destinations, writing reviews, and building AI-assisted travel plans.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/destinations"
                className="rounded-lg bg-emerald-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
              >
                Explore destinations
              </Link>
              <Link
                href="/signup"
                className="rounded-lg border border-slate-300 px-5 py-3 text-center font-semibold text-slate-800 transition hover:border-emerald-700 hover:text-emerald-800"
              >
                Create account
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Seeded sample data</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">12 destinations</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Everest Base Camp, Annapurna Base Camp, Pokhara, Lumbini, Rara Lake,
                Upper Mustang, Chitwan, Bandipur, Manang, Muktinath, Nagarkot, and
                Pashupatinath Temple are ready in the database.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <Icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
              <h2 className="mt-4 font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
