"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <Loader2 className={`${sizeClasses[size]} text-primary animate-spin`} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="space-y-4 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground animate-pulse text-sm">
          Loading...
        </p>
      </div>
    </div>
  );
}

export function CardLoader() {
  return (
    <div className="bg-muted flex h-[200px] w-full items-center justify-center rounded-xl border border-dashed">
      <LoadingSpinner />
    </div>
  );
}
