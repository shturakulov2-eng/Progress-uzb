import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "interactive-glow relative isolate inline-flex items-center justify-center overflow-hidden rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-[#0C3272] px-6 py-3 text-white shadow-[0_16px_40px_rgba(12,50,114,0.22)] hover:-translate-y-0.5 hover:bg-[#0f3f91] focus-visible:ring-[#0C3272]",
        secondary:
          "border border-slate-200 bg-white/85 px-6 py-3 text-slate-900 backdrop-blur-sm hover:border-[#0C3272] hover:text-[#0C3272] focus-visible:ring-[#0C3272] dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 dark:hover:border-blue-400 dark:hover:text-blue-300",
        ghost:
          "px-4 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-slate-400",
      },
      size: {
        default: "",
        large: "min-h-14 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export { Button, buttonVariants };
