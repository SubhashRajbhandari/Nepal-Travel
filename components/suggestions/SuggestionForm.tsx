"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { formatDifficulty } from "@/lib/format";

const difficulties = ["EASY", "MODERATE", "HARD", "EXTREME"] as const;
const categories = [
  "Trekking Trails",
  "Religious Places",
  "Exotic/Natural Environments",
  "Motorbike Routes",
  "Adventure Points",
  "Cultural Centers",
];

export function SuggestionForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        categoryName: formData.get("categoryName"),
        location: formData.get("location"),
        description: formData.get("description"),
        estimatedBudget: formData.get("estimatedBudget") || "",
        bestTimeToVisit: formData.get("bestTimeToVisit"),
        difficulty: formData.get("difficulty") || "",
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      setError(data?.message ?? "Could not submit suggestion.");
      return;
    }

    event.currentTarget.reset();
    setMessage("Suggestion submitted for admin review.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="name" label="Destination name" required />
        <TextField name="location" label="Location" required />
        <label>
          <span className="text-sm font-medium text-slate-700">Category</span>
          <select
            name="categoryName"
            required
            className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-sm font-medium text-slate-700">Difficulty</span>
          <select
            name="difficulty"
            className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="">Not sure</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {formatDifficulty(difficulty)}
              </option>
            ))}
          </select>
        </label>
        <TextField name="estimatedBudget" label="Estimated budget NPR" type="number" />
        <TextField name="bestTimeToVisit" label="Best time to visit" />
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-700">Description</span>
        <textarea
          name="description"
          required
          minLength={20}
          rows={5}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          placeholder="Explain why this destination should be added."
        />
      </label>

      {message ? (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Submitting..." : "Submit suggestion"}
      </button>
    </form>
  );
}

function TextField({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}
