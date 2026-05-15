import Link from "next/link";
import { redirect } from "next/navigation";
import { DestinationForm } from "@/components/admin/DestinationForm";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NewDestinationPage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/destinations/new");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
      <Link href="/admin/destinations" className="text-sm font-semibold text-emerald-700">
        Back to destinations
      </Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Add destination</h1>
        <p className="mt-3 text-slate-600">
          Add practical travel details for a Nepal destination.
        </p>
      </div>

      <div className="mt-8">
        <DestinationForm categories={categories} />
      </div>
    </main>
  );
}
