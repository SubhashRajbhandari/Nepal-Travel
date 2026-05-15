import Link from "next/link";
import { MapPin, Mountain, Route, Sparkles } from "lucide-react";
import { homeHeroImage } from "@/lib/destination-images";

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
    <main className="flex-1 bg-[#f6f8f3]">
      <section
        className="relative overflow-hidden bg-slate-950 text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(15,23,42,0.88), rgba(15,23,42,0.55), rgba(15,23,42,0.2)), url(${homeHeroImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
              Nepal Travel Recommendation Web App
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-6xl">
              Discover destinations, estimate budgets, and plan trips across Nepal.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
              A student-friendly full-stack travel platform for exploring Nepal, saving
              destinations, writing reviews, and building AI-assisted travel plans.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/destinations"
                className="rounded-lg bg-emerald-500 px-5 py-3 text-center font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                Explore destinations
              </Link>
              <Link
                href="/signup"
                className="rounded-lg border border-white/60 px-5 py-3 text-center font-semibold text-white transition hover:bg-white hover:text-slate-950"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-8 grid max-w-6xl gap-4 px-5 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm"
            >
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
