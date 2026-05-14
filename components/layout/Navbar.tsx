import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";

export async function Navbar() {
  const session = await getCurrentUser();

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-lg font-bold text-emerald-800">
          Nepal Travel
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <Link className="font-medium text-slate-700 hover:text-emerald-800" href="/">
            Home
          </Link>
          {session?.user ? (
            <>
              <Link
                className="font-medium text-slate-700 hover:text-emerald-800"
                href="/dashboard"
              >
                Dashboard
              </Link>
              {session.user.role === "ADMIN" ? (
                <Link
                  className="font-medium text-slate-700 hover:text-emerald-800"
                  href="/admin"
                >
                  Admin
                </Link>
              ) : null}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                className="font-medium text-slate-700 hover:text-emerald-800"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800"
                href="/signup"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
