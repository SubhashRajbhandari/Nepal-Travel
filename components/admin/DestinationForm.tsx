"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { formatDifficulty } from "@/lib/format";

const difficulties = ["EASY", "MODERATE", "HARD", "EXTREME"] as const;

type DestinationFormProps = {
  categories: {
    id: string;
    name: string;
  }[];
};

export function DestinationForm({ categories }: DestinationFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        categoryId: formData.get("categoryId"),
        description: formData.get("description"),
        location: formData.get("location"),
        mapLink: formData.get("mapLink"),
        estimatedBudget: formData.get("estimatedBudget"),
        bestTimeToVisit: formData.get("bestTimeToVisit"),
        duration: formData.get("duration"),
        difficulty: formData.get("difficulty"),
        localFood: formData.get("localFood"),
        nearbyAttractions: formData.get("nearbyAttractions"),
        transportation: formData.get("transportation"),
        safetyTips: formData.get("safetyTips"),
        imageUrls: formData.get("imageUrls"),
        isFeatured: formData.get("isFeatured") === "on",
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      setError(data?.message ?? "Could not create destination.");
      return;
    }

    router.push("/admin/destinations");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="name" label="Name" required />
        <TextField name="location" label="Location" required />
        <label>
          <span className="text-sm font-medium text-slate-700">Category</span>
          <select
            name="categoryId"
            required
            className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-sm font-medium text-slate-700">Difficulty</span>
          <select
            name="difficulty"
            className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {formatDifficulty(difficulty)}
              </option>
            ))}
          </select>
        </label>
        <TextField name="estimatedBudget" label="Estimated budget NPR" type="number" required />
        <TextField name="duration" label="Duration" required />
        <TextField name="bestTimeToVisit" label="Best time to visit" required />
        <TextField name="mapLink" label="Map link" />
      </div>

      <TextArea name="description" label="Description" required />
      <TextArea name="localFood" label="Local food points" required />
      <TextArea name="nearbyAttractions" label="Nearby attractions" required />
      <TextArea name="transportation" label="Transportation details" required />
      <TextArea name="safetyTips" label="Safety tips" required />
      <TextArea name="imageUrls" label="Image URLs or paths" />

      <label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700">
        <input name="isFeatured" type="checkbox" className="h-4 w-4 rounded border-slate-300" />
        Featured destination
      </label>

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Saving..." : "Save destination"}
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

function TextArea({
  name,
  label,
  required = false,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="mt-4 block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        name={name}
        required={required}
        rows={3}
        className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}
