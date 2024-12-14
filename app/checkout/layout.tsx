import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout page",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
