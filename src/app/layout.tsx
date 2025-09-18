import "@/app/globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ProgressBar } from "@/components/ui/progress-bar";
import { I18nProvider } from "@/lib/hooks/use-i18n";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Rafsakaos Konveksi",
    template: "%s - Rafsakaos Konveksi",
  },
  description:
    "Professional garment production service for your brand. Quality materials, expert craftsmanship, and reliable delivery.",
  keywords: [
    "konveksi",
    "clothing",
    "manufacturing",
    "garment",
    "custom clothing",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <I18nProvider>
          <Suspense fallback={null}>
            <ProgressBar />
          </Suspense>
          <main>{children}</main>
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
