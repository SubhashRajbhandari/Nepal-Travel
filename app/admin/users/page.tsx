import Link from "next/link";
import { redirect } from "next/navigation";
import { UserStatusButton } from "@/components/admin/UserStatusButton";
import { getCurrentUser } from "@/lib/auth";
import { formatDifficulty } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const statusStyles = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-amber-100 text-amber-800",
  BLOCKED: "bg-red-100 text-red-800",
};

export default async function AdminUsersPage() {
  const session = await getCurrentUser();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/users");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          reviews: true,
          bookmarks: true,
          itineraries: true,
        },
      },
    },
  });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
      <Link href="/admin" className="text-sm font-semibold text-emerald-700">
        Back to admin
      </Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Manage users</h1>
        <p className="mt-3 text-slate-600">
          View users and activate or block accounts when needed.
        </p>
      </div>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Activity</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-950">{user.name}</p>
                    <p className="text-slate-600">{user.email}</p>
                    {user.phone ? <p className="text-slate-500">{user.phone}</p> : null}
                  </td>
                  <td className="px-4 py-4">{user.role}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[user.status as keyof typeof statusStyles]
                      }`}
                    >
                      {formatDifficulty(user.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {user._count.reviews} reviews · {user._count.bookmarks} saves ·{" "}
                    {user._count.itineraries} plans
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <UserStatusButton userId={user.id} status="ACTIVE" label="Activate" />
                      <UserStatusButton userId={user.id} status="BLOCKED" label="Block" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
