"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";

interface Customer {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

interface CustomerSliderProps {
  customers: Customer[];
  direction?: "left" | "right";
  speed?: number;
  className?: string;
}

export function CustomerSlider({
  customers,
  direction = "right",
  speed = 30,
  className = ""
}: CustomerSliderProps) {
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const animationIdRef = useRef<number | undefined>(undefined);

  // Duplicate customers untuk infinite scroll
  const duplicatedCustomers = [...customers, ...customers, ...customers];

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const itemWidth = 320; // width + gap
    const totalWidth = customers.length * itemWidth;

    // Initialize position for left direction only on first mount
    if (direction === "left" && positionRef.current === 0) {
      positionRef.current = -totalWidth;
      slider.style.transform = `translateX(${positionRef.current}px)`;
    }

    const animate = () => {
      if (!isPaused) {
        if (direction === "right") {
          positionRef.current -= speed / 60; // 60fps
          if (positionRef.current <= -totalWidth) {
            positionRef.current = 0;
          }
        } else {
          positionRef.current += speed / 60; // 60fps
          if (positionRef.current >= 0) {
            positionRef.current = -totalWidth;
          }
        }
        slider.style.transform = `translateX(${positionRef.current}px)`;
      }
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isPaused, speed, direction, customers.length]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={sliderRef}
        className="flex gap-6"
        style={{ width: `${duplicatedCustomers.length * 320}px` }}
      >
        {duplicatedCustomers.map((customer, index) => (
          <Card
            key={`${customer.name}-${index}`}
            className="w-80 flex-shrink-0 bg-white/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-1">
                {[...Array(customer.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground italic text-sm leading-relaxed">
                &quot;{customer.content}&ldquo;
              </p>
              <div className="flex items-center space-x-3">
                <Image
                  src={customer.avatar}
                  alt={customer.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm">
                    {customer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {customer.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Left fade overlay */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50/80 via-slate-50/60 to-transparent dark:from-slate-800/80 dark:via-slate-800/60 pointer-events-none z-10" />
      
      {/* Right fade overlay */}
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50/80 via-slate-50/60 to-transparent dark:from-slate-800/80 dark:via-slate-800/60 pointer-events-none z-10" />
    </div>
  );
}