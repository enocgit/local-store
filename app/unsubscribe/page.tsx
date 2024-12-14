"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const email = searchParams.get("email");

  async function handleUnsubscribe() {
    if (!email) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error();

      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold">Unsubscribe from Emails</h1>

        {status === "idle" && (
          <div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to unsubscribe {email} from our emails?
            </p>
            <button
              onClick={handleUnsubscribe}
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Unsubscribe
            </button>
          </div>
        )}

        {status === "loading" && <p>Processing your request...</p>}

        {status === "success" && (
          <div>
            <p className="text-green-600">
              You have been successfully unsubscribed.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              You will no longer receive emails from us. If this was a mistake,
              you can always resubscribe from our website.
            </p>
          </div>
        )}

        {status === "error" && (
          <p className="text-red-600">
            Failed to unsubscribe. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
}
