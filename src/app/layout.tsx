import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import HideNextOverlay from "@/components/hide";

const Navbar = dynamic(() => import("../components/navbar"), {
  loading: () => <div className="h-16 w-full" />,
});

const Footer = dynamic(() => import("../components/footer"), {
  loading: () => <div className="h-40 w-full" />,
});


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blood Mate",
  description: "Save Lives, Donate Blood with Blood Mate",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <HideNextOverlay />

        <Suspense fallback={<div className="h-16 w-full" />}>
          <Navbar />
        </Suspense>

        <main>
          <Suspense fallback={<div className="min-h-24" />}>
            {children}
          </Suspense>
        </main>

        <Suspense fallback={<div className="h-40 w-full" />}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
