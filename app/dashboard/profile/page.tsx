import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/profile");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      _count: {
        select: {
          bookmarks: true,
          reviews: true,
          itineraries: true,
          suggestions: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
      <Link href="/dashboard" className="text-sm font-semibold text-emerald-700">
        Back to dashboard
      </Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Profile
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Edit account</h1>
        <p className="mt-3 text-slate-600">
          Update your name and phone number. Email is used for login and stays fixed.
        </p>
      </div>

      <div className="mt-8">
        <ProfileForm user={user} />
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-4">
        <Stat label="Saved" value={user._count.bookmarks} />
        <Stat label="Reviews" value={user._count.reviews} />
        <Stat label="Plans" value={user._count.itineraries} />
        <Stat label="Suggestions" value={user._count.suggestions} />
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    </article>
  );
}
