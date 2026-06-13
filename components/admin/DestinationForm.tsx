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
  initialData?: {
    id: string;
    name: string;
    categoryId: string;
    description: string;
    location: string;
    mapLink: string | null;
    estimatedBudget: number;
    bestTimeToVisit: string;
    duration: string;
    difficulty: string;
    localFood: string[];
    nearbyAttractions: string[];
    transportation: string;
    safetyTips: string[];
    imageUrls: string[];
    isFeatured: boolean;
  };
};

export function DestinationForm({ categories, initialData }: DestinationFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const url = initialData 
      ? `/api/admin/destinations/${initialData.id}` 
      : "/api/admin/destinations";
    const method = initialData ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
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
        <TextField name="name" label="Name" defaultValue={initialData?.name} required />
        <TextField name="location" label="Location" defaultValue={initialData?.location} required />
        <label>
          <span className="text-sm font-medium text-slate-700">Category</span>
          <select
            name="categoryId"
            defaultValue={initialData?.categoryId}
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
            defaultValue={initialData?.difficulty}
            className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {formatDifficulty(difficulty)}
              </option>
            ))}
          </select>
        </label>
        <TextField name="estimatedBudget" label="Estimated budget NPR" type="number" min={0} defaultValue={initialData?.estimatedBudget} required />
        <TextField name="duration" label="Duration" defaultValue={initialData?.duration} required />
        <TextField name="bestTimeToVisit" label="Best time to visit" defaultValue={initialData?.bestTimeToVisit} required />
        <TextField name="mapLink" label="Map link" defaultValue={initialData?.mapLink ?? ""} />
      </div>

      <TextArea name="description" label="Description" defaultValue={initialData?.description} required />
      <TextArea name="localFood" label="Local food points" defaultValue={initialData?.localFood.join(", ")} required />
      <TextArea name="nearbyAttractions" label="Nearby attractions" defaultValue={initialData?.nearbyAttractions.join(", ")} required />
      <TextArea name="transportation" label="Transportation details" defaultValue={initialData?.transportation} required />
      <TextArea name="safetyTips" label="Safety tips" defaultValue={initialData?.safetyTips.join(", ")} required />
      <TextArea name="imageUrls" label="Image URLs or paths" defaultValue={initialData?.imageUrls.join(", ")} />

      <label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700">
        <input name="isFeatured" type="checkbox" defaultChecked={initialData?.isFeatured} className="h-4 w-4 rounded border-slate-300" />
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
  min,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  min?: number;
  defaultValue?: string | number;
}) {
  return (
    <label>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        defaultValue={defaultValue}
        className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function TextArea({
  name,
  label,
  required = false,
  defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="mt-4 block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        name={name}
        required={required}
        defaultValue={defaultValue}
        rows={3}
        className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}
