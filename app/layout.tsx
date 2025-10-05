import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import NavWrapper from "@/components/NavWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: "Local Store - Fresh Flavors, Delivered Fast",
    template: "%s | Local Store",
  },
  description:
    "Your one-stop shop for premium groceries, snacks, and essentials – all at your fingertips.",
  appleWebApp: {
    title: "LocalStore",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SessionProvider session={session}>
            <div className="flex min-h-screen flex-col">
              <NavWrapper />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SessionProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
