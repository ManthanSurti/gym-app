import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "GymFlow — Find Your Workout",
  description: "Select your equipment, choose a muscle group, get exercise tutorials.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div style={{ height: 56, borderBottom: '1px solid var(--border)' }} />}>
          <Navbar />
        </Suspense>
        <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
