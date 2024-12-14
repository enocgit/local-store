import TermsOfServiceClient from "@/components/terms-of-service/TermsOfServiceClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service and conditions for using TropikalFoods",
};

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Terms of Service
      </h1>

      <TermsOfServiceClient />
    </div>
  );
}
