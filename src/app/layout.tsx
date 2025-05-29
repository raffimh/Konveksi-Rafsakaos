import "@/app/globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
