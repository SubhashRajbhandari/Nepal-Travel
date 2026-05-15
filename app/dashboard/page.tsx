import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

const dashboardItems = [
  {
    title: "Saved destinations",
    description: "View places you bookmarked for future trips.",
    href: "/dashboard/saved-destinations",
  },
  {
    title: "Travel plans",
    description: "Saved AI itineraries will appear here.",
    href: "/dashboard/travel-plans",
  },
  {
    title: "My reviews",
    description: "Track your submitted reviews and approval status.",
    href: "/dashboard/reviews",
  },
  {
    title: "Suggest destination",
    description: "Suggest new Nepal destinations for admin review.",
    href: "/dashboard/suggest-destination",
  },
  {
    title: "Profile",
    description: "Edit your account details and view activity counts.",
    href: "/dashboard/profile",
  },
];

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
        {dashboardItems.map((item) => (
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
