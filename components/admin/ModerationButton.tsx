"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ModerationButtonProps = {
  endpoint: string;
  status: "APPROVED" | "REJECTED" | "PENDING";
  label: string;
  variant?: "approve" | "reject" | "neutral";
};

const styles = {
  approve: "bg-emerald-700 text-white hover:bg-emerald-800",
  reject: "bg-red-700 text-white hover:bg-red-800",
  neutral: "border border-slate-300 text-slate-700 hover:border-slate-500",
};

export function ModerationButton({
  endpoint,
  status,
  label,
  variant = "neutral",
}: ModerationButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    setIsSubmitting(true);

    await fetch(endpoint, {
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
      disabled={isSubmitting}
      onClick={handleClick}
      className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 ${styles[variant]}`}
    >
      {isSubmitting ? "Updating..." : label}
    </button>
  );
}
