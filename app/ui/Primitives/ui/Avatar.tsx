import * as React from "react";
import { cn } from "@/app/ui/utils";

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-border bg-muted/30 relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

import Image from "next/image";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ComponentPropsWithoutRef<typeof Image>
>(({ className, src, alt, sizes = "40px", loading = "lazy", ...props }, ref) => (
  <div className={cn("relative h-full w-full", className)}>
    <Image
      ref={ref}
      src={src}
      alt={alt || ""}
      fill
      sizes={sizes}
      loading={loading}
      className="object-cover"
      {...props}
    />
  </div>
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-muted text-muted-foreground flex h-full w-full items-center justify-center rounded-full text-xs font-semibold uppercase",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
