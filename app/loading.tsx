"use client";

import {
  StaggerContainer,
  StaggerItem,
} from "@/app/components/MotionWrappers";
import { Skeleton } from "@/app/ui/Primitives/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
      <StaggerContainer className="bg-background mx-auto w-full flex-1 space-y-8 p-8 md:p-12 xl:max-w-7xl">
        <StaggerItem className="border-border flex flex-col items-start justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 md:w-96" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-28" />
          </div>
        </StaggerItem>

        <StaggerItem className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-30 rounded-xl border border-neutral-300 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-center justify-between pb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="mt-4 h-8 w-16" />
              <Skeleton className="mt-2 h-4 w-32" />
            </div>
          ))}
        </StaggerItem>

        <StaggerItem className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 h-100 rounded-xl border border-neutral-300 bg-white p-6 shadow-sm md:p-8 dark:border-neutral-800 dark:bg-neutral-900">
            <Skeleton className="mb-6 h-6 w-48" />
            <Skeleton className="h-70 w-full" />
          </div>
          <div className="col-span-3 h-100 rounded-xl border border-neutral-300 bg-white p-6 shadow-sm md:p-8 dark:border-neutral-800 dark:bg-neutral-900">
            <Skeleton className="mb-6 h-6 w-40" />
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full max-w-50" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
