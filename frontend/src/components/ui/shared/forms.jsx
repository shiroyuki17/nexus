import React from "react";
import { ButtonBase, createPrimitive, Div, InputBase, LabelBase, Span } from "./base";
import { cn } from "@/lib/utils";

export const Button = createPrimitive("button", "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50");
export const buttonVariants = () => "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors";

export const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} type="checkbox" className={cn("h-4 w-4 rounded border", className)} {...props} />
));

export const Form = ({ children }) => children;
export const FormControl = ({ children }) => children;
export const FormDescription = createPrimitive("p", "text-sm text-muted-foreground");
export const FormField = ({ render, ...props }) => render ? render(props) : null;
export const FormItem = createPrimitive("div", "space-y-2");
export const FormLabel = LabelBase;
export const FormMessage = createPrimitive("p", "text-sm font-medium text-destructive");
export const useFormField = () => ({});

export const Input = createPrimitive("input", "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm");
export const InputOTP = Div;
export const InputOTPGroup = Div;
export const InputOTPSeparator = Span;
export const InputOTPSlot = Div;
export const Label = createPrimitive("label", "text-sm font-medium leading-none");

export const RadioGroup = Div;
export const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} type="radio" className={cn("h-4 w-4", className)} {...props} />
));

export const Select = Div;
export const SelectContent = Div;
export const SelectGroup = Div;
export const SelectItem = Div;
export const SelectLabel = Div;
export const SelectScrollDownButton = ButtonBase;
export const SelectScrollUpButton = ButtonBase;
export const SelectSeparator = createPrimitive("div", "-mx-1 my-1 h-px bg-border");
export const SelectTrigger = ButtonBase;
export const SelectValue = Span;

export const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} type="range" className={cn("w-full", className)} {...props} />
));

export const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} type="checkbox" role="switch" className={cn("h-5 w-9", className)} {...props} />
));

export const Textarea = createPrimitive("textarea", "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm");
