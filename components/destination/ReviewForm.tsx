"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { formatDifficulty } from "@/lib/format";

const difficulties = ["EASY", "MODERATE", "HARD", "EXTREME"] as const;

type ReviewFormProps = {
  destinationId: string;
  isLoggedIn: boolean;
};

export function ReviewForm({ destinationId, isLoggedIn }: ReviewFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinationId,
        rating: formData.get("rating"),
        difficultyFeedback: formData.get("difficultyFeedback") || undefined,
        remark: formData.get("remark"),
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      setError(data?.message ?? "Could not submit review.");
      return;
    }

    form.reset();
    setMessage("Review submitted. Admin approval is required before it appears publicly.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-lg font-bold text-slate-950">Share your review</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-sm font-medium text-slate-700">Rating</span>
          <select
            name="rating"
            required
            defaultValue="5"
            className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} star{rating > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="text-sm font-medium text-slate-700">Difficulty feedback</span>
          <select
            name="difficultyFeedback"
            className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="">No difficulty feedback</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {formatDifficulty(difficulty)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-700">Remarks</span>
        <textarea
          name="remark"
          required
          minLength={10}
          rows={4}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          placeholder="Share useful travel tips, experience, food points, or difficulty notes."
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
        className="mt-5 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Submitting..." : isLoggedIn ? "Submit review" : "Login to review"}
      </button>
    </form>
  );
}
