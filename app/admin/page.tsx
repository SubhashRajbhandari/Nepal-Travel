import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
        Admin dashboard
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950">
        Manage Nepal Travel
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Admin tools for destinations, categories, users, reviews, suggestions, and reports
        will be added in later steps.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Destinations", "Categories", "Users", "Reviews", "Suggestions", "Reports"].map(
          (item) => (
            <section key={item} className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-950">{item}</h2>
              <p className="mt-2 text-sm text-slate-600">Admin module coming soon.</p>
            </section>
          ),
        )}
      </div>
    </main>
  );
}
