import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/app/ui/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground font-bold shadow-sm hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-md cursor-pointer",
        destructive:
          "bg-destructive text-destructive-foreground font-bold shadow-sm hover:bg-destructive-hover hover:-translate-y-0.5 cursor-pointer",
        outline:
          "border border-border bg-background font-bold shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer",
        secondary:
          "bg-secondary text-secondary-foreground font-bold border border-border shadow-sm hover:bg-secondary-hover hover:-translate-y-0.5 cursor-pointer",
        tertiary:
          "text-primary bg-transparent font-bold hover:underline cursor-pointer px-0",
        ghost:
          "font-bold hover:bg-accent hover:text-accent-foreground cursor-pointer",
        link: "text-primary font-bold underline-offset-4 hover:underline cursor-pointer",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 sm:text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
