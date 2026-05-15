"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type ProfileFormProps = {
  user: {
    name: string;
    email: string;
    phone: string | null;
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
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
    const response = await fetch("/api/me/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        phone: formData.get("phone"),
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      setError(data?.message ?? "Could not update profile.");
      return;
    }

    setMessage("Profile updated.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            name="name"
            defaultValue={user.name}
            required
            className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
        <label>
          <span className="text-sm font-medium text-slate-700">Phone</span>
          <input
            name="phone"
            defaultValue={user.phone ?? ""}
            className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
      </div>
      <div className="mt-4">
        <span className="text-sm font-medium text-slate-700">Email</span>
        <p className="mt-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {user.email}
        </p>
      </div>

      {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
