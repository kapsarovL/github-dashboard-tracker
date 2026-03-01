"use client";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary as BaseErrorBoundary } from "./ErrorBoundary";
import { ReactNode } from "react";

interface QueryErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function QueryErrorBoundary({
  children,
  fallback,
}: QueryErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <BaseErrorBoundary
      fallback={fallback}
      onError={() => {
        // Reset React Query error state when error boundary catches an error
        reset();
      }}
    >
      {children}
    </BaseErrorBoundary>
  );
}
