import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact us at TropikalFoods Bradford",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
