"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function CategoryForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        description: formData.get("description"),
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      setError(data?.message ?? "Could not create category.");
      return;
    }

    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-bold text-slate-950">Add category</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            name="name"
            required
            className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
        <label>
          <span className="text-sm font-medium text-slate-700">Description</span>
          <input
            name="description"
            className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Adding..." : "Add category"}
      </button>
    </form>
  );
}
