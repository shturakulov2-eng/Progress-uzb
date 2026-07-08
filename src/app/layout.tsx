import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

import { AppProviders } from "@/components/providers/app-providers";
import { Toaster } from "sonner";
import { defaultMetadata, getLocalBusinessSchema } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="uz"
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable} h-full scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-[--color-background] font-sans text-slate-950 antialiased"
      >
        <AppProviders>
          {children}
          <Toaster richColors position="top-right" />
        </AppProviders>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getLocalBusinessSchema()),
          }}
        />
      </body>
    </html>
  );
}
