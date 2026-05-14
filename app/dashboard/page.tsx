import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
        User dashboard
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950">
        Namaste, {session.user.name}
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Your saved destinations, travel plans, reviews, and suggestions will appear here as
        we build the next modules.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Saved destinations", "Travel plans", "My reviews", "Suggest destination"].map(
          (item) => (
            <section key={item} className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-950">{item}</h2>
              <p className="mt-2 text-sm text-slate-600">Coming in the dashboard step.</p>
            </section>
          ),
        )}
      </div>
    </main>
  );
}
