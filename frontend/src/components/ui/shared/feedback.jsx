import React from "react";
import { ButtonBase, createPrimitive } from "./base";
import { cn } from "@/lib/utils";

export const Alert = createPrimitive("div", "rounded-lg border p-4");
export const AlertTitle = createPrimitive("h5", "mb-1 font-medium leading-none tracking-tight");
export const AlertDescription = createPrimitive("div", "text-sm");

export function AnimatedCounter({ value = 0, className }) {
  return <span className={className}>{value}</span>;
}

export const Progress = React.forwardRef(({ value = 0, className, ...props }, ref) => (
  <div ref={ref} className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)} {...props}>
    <div className="h-full bg-primary transition-all" style={{ width: `${value}%` }} />
  </div>
));

export const Skeleton = createPrimitive("div", "animate-pulse rounded-md bg-muted");
export const SkeletonCard = createPrimitive("div", "skeleton rounded-lg");
export const Toaster = () => null;
export const toast = () => {};
export const Toggle = ButtonBase;
export const toggleVariants = () => "";
export const ToggleGroup = createPrimitive("div");
export const ToggleGroupItem = ButtonBase;
