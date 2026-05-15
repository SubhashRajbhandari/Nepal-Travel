import Link from "next/link";
import { Compass } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";

const navLinkClass =
  "rounded-full px-3 py-2 font-medium text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-800 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500";

export async function Navbar() {
  const session = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-gradient-to-r from-white/95 via-emerald-50/95 to-sky-50/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-3 sm:flex-row">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-full px-2 py-1 text-lg font-bold text-emerald-900 transition hover:bg-emerald-50"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-700 text-white shadow-sm transition group-hover:bg-emerald-800">
            <Compass className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>Nepal Travel</span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-1 text-sm">
          <Link className={navLinkClass} href="/">
            Home
          </Link>
          <Link
            className={navLinkClass}
            href="/destinations"
          >
            Destinations
          </Link>
          <Link
            className={navLinkClass}
            href="/about"
          >
            About
          </Link>
          {session?.user ? (
            <>
              <Link
                className={navLinkClass}
                href="/dashboard"
              >
                Dashboard
              </Link>
              {session.user.role === "ADMIN" ? (
                <Link
                  className={navLinkClass}
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
                className={navLinkClass}
                href="/login"
              >
                Login
              </Link>
              <Link
                className="rounded-full bg-emerald-700 px-4 py-2 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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
