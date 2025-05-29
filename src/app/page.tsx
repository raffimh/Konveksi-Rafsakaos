"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Users, Clock, Shirt, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl px-6 flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold">Rafsakaos Konveksi</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/auth/login")}>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button onClick={() => router.push("/auth/register")}>
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center">
        <div className="container mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="flex flex-col items-center space-y-8 text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Custom Clothing Manufacturing
              <br className="hidden sm:inline" />
              Made Simple
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Professional garment production service for your brand. Quality
              materials, expert craftsmanship, and reliable delivery.
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button size="lg" onClick={() => router.push("/auth/register")}>
                Start Your Project
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/auth/login")}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg border bg-background">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Customer-Centric</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated support throughout your production journey
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg border bg-background">
                <Shirt className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Quality Materials</h3>
              <p className="text-sm text-muted-foreground">
                Premium fabrics and materials for superior products
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg border bg-background">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Fast Production</h3>
              <p className="text-sm text-muted-foreground">
                Efficient manufacturing with quick turnaround times
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
