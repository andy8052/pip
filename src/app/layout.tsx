import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "pip - Launch tokens for any X profile",
  description:
    "Launch Clanker v4 tokens on Base for any X profile. The profile owner can claim 80% of fees + vesting tokens.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    title: "pip - Launch tokens for any X profile",
    description:
      "Launch Clanker v4 tokens on Base for any X profile. The profile owner can claim 80% of fees + vesting tokens.",
    siteName: "pip",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "pip - Launch tokens for any X profile",
    description:
      "Launch Clanker v4 tokens on Base for any X profile. The profile owner can claim 80% of fees + vesting tokens.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
