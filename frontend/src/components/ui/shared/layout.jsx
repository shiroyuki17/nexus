import React from "react";
import { ButtonBase, createPrimitive, Div } from "./base";
import { Card } from "./data-display";

export const Accordion = Div;
export const AccordionContent = Div;
export const AccordionItem = Div;
export const AccordionTrigger = ButtonBase;

export const AspectRatio = React.forwardRef(({ ratio = 1, className, children, ...props }, ref) => (
  <div ref={ref} className={className} style={{ aspectRatio: ratio }} {...props}>
    {children}
  </div>
));

export const Calendar = createPrimitive("div", "p-3");
export const Carousel = Div;
export const CarouselContent = Div;
export const CarouselItem = Div;
export const CarouselNext = ButtonBase;
export const CarouselPrevious = ButtonBase;
export const Collapsible = Div;
export const CollapsibleContent = Div;
export const CollapsibleTrigger = ButtonBase;
export const GlassCard = createPrimitive("div", "glass-card rounded-lg");
export const NeonButton = ButtonBase;
export const ResizableHandle = Div;
export const ResizablePanel = Div;
export const ResizablePanelGroup = Div;
export const ScrollArea = createPrimitive("div", "overflow-auto");
export const ScrollBar = Div;
export const Separator = createPrimitive("div", "shrink-0 bg-border");
export const StatCard = Card;
