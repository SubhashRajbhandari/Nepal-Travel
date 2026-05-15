import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

const adminItems = [
  { title: "Destinations", href: "/admin/destinations", description: "Add and edit destination data." },
  { title: "Categories", href: "/admin/categories", description: "Manage destination categories." },
  { title: "Users", href: "/admin/users", description: "Review registered users." },
  { title: "Reviews", href: "/admin/reviews", description: "Approve or reject user reviews." },
  { title: "Suggestions", href: "/admin/suggestions", description: "Review suggested destinations." },
  { title: "Reports", href: "/admin/reports", description: "View project activity summaries." },
];

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
        {adminItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm"
          >
            <h2 className="font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
