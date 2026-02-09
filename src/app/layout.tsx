import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

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
    "Launch Clanker v4 tokens on Base for any X profile. 10% of the token is reserved for the X account and vested, plus 80% fee sharing.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    title: "pip - Launch tokens for any X profile",
    description:
      "Launch Clanker v4 tokens on Base for any X profile. 10% of the token is reserved for the X account and vested, plus 80% fee sharing.",
    siteName: "pip",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "pip - Launch tokens for any X profile",
    description:
      "Launch Clanker v4 tokens on Base for any X profile. 10% of the token is reserved for the X account and vested, plus 80% fee sharing.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover" as const,
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
          <main>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
