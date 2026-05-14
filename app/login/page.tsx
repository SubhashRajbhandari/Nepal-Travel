import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getCurrentUser();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12">
      <section className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Login</h1>
          <p className="mt-3 text-sm text-slate-600">
            Continue planning and saving your Nepal travel ideas.
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
