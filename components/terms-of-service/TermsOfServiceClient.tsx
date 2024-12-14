"use client";

import { useSiteConfig } from "@/hooks/use-site-config";

export default function TermsOfServiceClient() {
  const { data: siteConfig } = useSiteConfig();

  if (!siteConfig) return null;

  return (
    <div className="space-y-6 text-gray-600">
      <section>
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          1. Acceptance of Terms
        </h2>
        <p>{siteConfig?.terms_acceptance?.toString() || ""}</p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          2. Use License
        </h2>
        <p>{siteConfig?.use_license?.toString() || ""}</p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          3. Disclaimer
        </h2>
        <p>{siteConfig?.disclaimer?.toString() || ""}</p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          4. Limitations
        </h2>
        <p>{siteConfig?.limitations?.toString() || ""}</p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          5. Revisions and Errata
        </h2>
        <p>{siteConfig?.revisions_errata?.toString() || ""}</p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-gray-900">6. Links</h2>
        <p>{siteConfig?.links?.toString() || ""}</p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          7. Governing Law
        </h2>
        <p>{siteConfig?.governing_law?.toString() || ""}</p>
      </section>

      <section className="pt-4">
        <p className="text-sm">
          Last updated:{" "}
          {new Date(
            siteConfig?.last_updated?.toString() || new Date().toISOString(),
          ).toLocaleDateString()}
        </p>
      </section>
    </div>
  );
}
