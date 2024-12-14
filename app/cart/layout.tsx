import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your cart items",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
