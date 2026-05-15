"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteButtonProps = {
  endpoint: string;
  label?: string;
};

export function DeleteButton({ endpoint, label = "Delete" }: DeleteButtonProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    setError("");
    setIsSubmitting(true);

    const response = await fetch(endpoint, { method: "DELETE" });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      setError(data?.message ?? "Could not delete item.");
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isSubmitting}
        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
      >
        {isSubmitting ? "Deleting..." : label}
      </button>
      {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
