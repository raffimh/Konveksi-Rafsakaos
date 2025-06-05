"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FloatingCard({ children, className, delay = 0 }: FloatingCardProps) {
  return (
    <Card
      className={cn(
        "animate-float bg-white/90 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}