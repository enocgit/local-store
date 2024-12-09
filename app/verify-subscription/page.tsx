"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifySubscription() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get("token");
        const response = await fetch(`/api/verify-subscription?token=${token}`);

        if (!response.ok) throw new Error();

        setStatus("success");
      } catch (error) {
        setStatus("error");
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      {status === "loading" && <p>Verifying your subscription...</p>}
      {status === "success" && (
        <div>
          <h1 className="text-2xl font-bold">Subscription Confirmed!</h1>
          <p className="mt-2">Thank you for subscribing to our updates.</p>
        </div>
      )}
      {status === "error" && (
        <div>
          <h1 className="text-2xl font-bold">Verification Failed</h1>
          <p className="mt-2">
            The verification link is invalid or has expired.
          </p>
        </div>
      )}
    </div>
  );
}
