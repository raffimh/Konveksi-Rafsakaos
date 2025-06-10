"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
  speed: 500
});

let isNavigating = false;

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Stop progress when route changes complete
    if (isNavigating) {
      NProgress.done();
      isNavigating = false;
    }

    // Cleanup
    return () => {
      NProgress.done();
    };
  }, [pathname, searchParams]);

  return null;
}

// Helper function to start progress manually
export function startProgress() {
  if (!isNavigating) {
    isNavigating = true;
    NProgress.start();
  }
}

// Helper function to stop progress manually
export function stopProgress() {
  isNavigating = false;
  NProgress.done();
}