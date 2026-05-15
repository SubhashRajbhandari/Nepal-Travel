export default function AboutPage() {
  return (
    <main className="flex-1 bg-white">
      <section className="mx-auto max-w-4xl px-5 py-14">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          About the project
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">
          Nepal Travel Recommendation Web App
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          This web app is a college project built to help travelers discover Nepal
          destinations, compare difficulty levels, estimate budgets, generate travel
          itineraries, save favorite places, and share reviews.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <Info
            title="Main purpose"
            body="Bring scattered Nepal travel information into one friendly and practical platform."
          />
          <Info
            title="Tourism support"
            body="Promote trekking trails, religious places, natural environments, cultural centers, routes, and adventure points."
          />
          <Info
            title="AI planning"
            body="Generate structured itinerary and budget suggestions with fallback behavior for local demos."
          />
          <Info
            title="Community feedback"
            body="Allow users to submit reviews, difficulty feedback, and new destination suggestions."
          />
        </div>
      </section>
    </main>
  );
}

function Info({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </article>
  );
}
