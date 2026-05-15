import Link from "next/link";
import { redirect } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/categories");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { destinations: true },
      },
    },
  });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
      <Link href="/admin" className="text-sm font-semibold text-emerald-700">
        Back to admin
      </Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Manage categories</h1>
        <p className="mt-3 text-slate-600">
          Add categories for trekking, religious places, natural environments, and more.
        </p>
      </div>

      <div className="mt-8">
        <CategoryForm />
      </div>

      <section className="mt-8 space-y-4">
        {categories.map((category) => (
          <article key={category.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-bold text-slate-950">{category.name}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {category.description ?? "No description"}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {category._count.destinations} destinations
                </p>
              </div>
              <DeleteButton endpoint={`/api/admin/categories/${category.id}`} />
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
