import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback",
  description: "Share your feedback with Local Store",
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
