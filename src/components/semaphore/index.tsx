import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const semaphoreVariants = cva("rounded-full w-4 h-4", {
  variants: {
    variant: {
      default: "bg-green-600",
      primary: "bg-green-600",
      secondary: "bg-yellow-500",
      destructive: "bg-red-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface SemaphoreProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof semaphoreVariants> {}

function Semaphore({ className, variant, ...props }: SemaphoreProps) {
  return (
    <div className="flex justify-center">
      <div
        className={cn(semaphoreVariants({ variant }), className)}
        {...props}
      ></div>
    </div>
  );
}

export { Semaphore };
