"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { formatDifficulty, formatNepaliCurrency } from "@/lib/format";

const difficulties = ["EASY", "MODERATE", "HARD", "EXTREME"] as const;

type GeneratedItinerary = {
  title: string;
  summary: string;
  plan: {
    day: number;
    title: string;
    activities: string[];
    foodSuggestion: string;
    safetyNote: string;
  }[];
  budget: {
    food: number;
    transport: number;
    accommodation: number;
    activities: number;
    total: number;
  };
  provider: "openai" | "fallback";
};

type AITripPlannerProps = {
  destinationId: string;
  defaultDuration: string;
  defaultBudget: number;
  defaultDifficulty: string;
  isLoggedIn: boolean;
};

export function AITripPlanner({
  destinationId,
  defaultDuration,
  defaultBudget,
  defaultDifficulty,
  isLoggedIn,
}: AITripPlannerProps) {
  const router = useRouter();
  const [generated, setGenerated] = useState<GeneratedItinerary | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/ai/itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinationId,
        duration: formData.get("duration"),
        budget: formData.get("budget"),
        difficulty: formData.get("difficulty"),
        travelStyle: formData.get("travelStyle"),
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      setError(data?.message ?? "Could not generate itinerary.");
      return;
    }

    const data = (await response.json()) as { generated: GeneratedItinerary };
    setGenerated(data.generated);
    router.refresh();
  }

  return (
    <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-emerald-700" aria-hidden="true" />
        <h2 className="text-lg font-bold text-slate-950">AI trip planner</h2>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Duration</span>
          <input
            name="duration"
            defaultValue={defaultDuration}
            required
            className="mt-2 h-11 w-full rounded-lg border border-emerald-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Budget NPR</span>
          <input
            name="budget"
            type="number"
            min={1000}
            defaultValue={defaultBudget}
            required
            className="mt-2 h-11 w-full rounded-lg border border-emerald-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Difficulty</span>
          <select
            name="difficulty"
            defaultValue={defaultDifficulty}
            className="mt-2 h-11 w-full rounded-lg border border-emerald-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {formatDifficulty(difficulty)}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Travel style</span>
          <select
            name="travelStyle"
            defaultValue="Balanced"
            className="mt-2 h-11 w-full rounded-lg border border-emerald-200 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            <option>Budget</option>
            <option>Balanced</option>
            <option>Comfort</option>
            <option>Adventure</option>
            <option>Culture focused</option>
          </select>
        </label>

        {error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting
            ? "Generating..."
            : isLoggedIn
              ? "Generate and save plan"
              : "Login to generate"}
        </button>
      </form>

      {generated ? (
        <div className="mt-6 border-t border-emerald-200 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {generated.provider === "fallback" ? "Fallback plan" : "AI generated plan"}
          </p>
          <h3 className="mt-2 font-bold text-slate-950">{generated.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{generated.summary}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <BudgetItem label="Food" value={generated.budget.food} />
            <BudgetItem label="Transport" value={generated.budget.transport} />
            <BudgetItem label="Stay" value={generated.budget.accommodation} />
            <BudgetItem label="Activities" value={generated.budget.activities} />
          </dl>
          <p className="mt-3 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white">
            Total: {formatNepaliCurrency(generated.budget.total)}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function BudgetItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-950">{formatNepaliCurrency(value)}</dd>
    </div>
  );
}
