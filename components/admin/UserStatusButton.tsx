"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UserStatusButtonProps = {
  userId: string;
  status: "ACTIVE" | "PENDING" | "BLOCKED";
  label: string;
};

export function UserStatusButton({ userId, status, label }: UserStatusButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    setIsSubmitting(true);

    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setIsSubmitting(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSubmitting}
      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-700 hover:text-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-200"
    >
      {isSubmitting ? "Updating..." : label}
    </button>
  );
}
