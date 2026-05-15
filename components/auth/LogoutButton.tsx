"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      Logout
    </button>
  );
}
