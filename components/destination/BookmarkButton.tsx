"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";

type BookmarkButtonProps = {
  destinationId: string;
  isBookmarked: boolean;
  isLoggedIn: boolean;
};

export function BookmarkButton({
  destinationId,
  isBookmarked,
  isLoggedIn,
}: BookmarkButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(isBookmarked);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    setError("");

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    const response = await fetch(
      saved ? `/api/bookmarks/${destinationId}` : "/api/bookmarks",
      {
        method: saved ? "DELETE" : "POST",
        headers: saved ? undefined : { "Content-Type": "application/json" },
        body: saved ? undefined : JSON.stringify({ destinationId }),
      },
    );

    setIsSubmitting(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      setError(data?.message ?? "Could not update bookmark.");
      return;
    }

    setSaved((current) => !current);
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleClick}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        <Bookmark className={saved ? "h-4 w-4 fill-white" : "h-4 w-4"} aria-hidden="true" />
        {isSubmitting ? "Saving..." : saved ? "Saved destination" : "Save destination"}
      </button>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
