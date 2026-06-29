import React from "react";
import { cn } from "@/lib/utils";

export function createPrimitive(tag, defaultClassName = "") {
  return React.forwardRef(({ className, asChild, ...props }, ref) => {
    const Component = asChild ? "span" : tag;
    return <Component ref={ref} className={cn(defaultClassName, className)} {...props} />;
  });
}

export const Div = createPrimitive("div");
export const Span = createPrimitive("span");
export const ButtonBase = createPrimitive("button");
export const InputBase = createPrimitive("input");
export const LabelBase = createPrimitive("label");
