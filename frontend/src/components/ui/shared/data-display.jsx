import { createPrimitive } from "./base";

export const Avatar = createPrimitive("span", "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full");
export const AvatarFallback = createPrimitive("span", "flex h-full w-full items-center justify-center rounded-full bg-muted");
export const AvatarImage = createPrimitive("img", "aspect-square h-full w-full");
export const Badge = createPrimitive("div", "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold");
export const badgeVariants = () => "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold";

export const Card = createPrimitive("div", "rounded-lg border bg-card text-card-foreground shadow-sm");
export const CardContent = createPrimitive("div", "p-6 pt-0");
export const CardDescription = createPrimitive("p", "text-sm text-muted-foreground");
export const CardFooter = createPrimitive("div", "flex items-center p-6 pt-0");
export const CardHeader = createPrimitive("div", "flex flex-col space-y-1.5 p-6");
export const CardTitle = createPrimitive("h3", "text-2xl font-semibold leading-none tracking-tight");

export const ChartContainer = createPrimitive("div");
export const ChartLegend = createPrimitive("div");
export const ChartLegendContent = createPrimitive("div");
export const ChartStyle = () => null;
export const ChartTooltip = createPrimitive("div");
export const ChartTooltipContent = createPrimitive("div");

export const Table = createPrimitive("table", "w-full caption-bottom text-sm");
export const TableBody = createPrimitive("tbody");
export const TableCaption = createPrimitive("caption", "mt-4 text-sm text-muted-foreground");
export const TableCell = createPrimitive("td", "p-4 align-middle");
export const TableFooter = createPrimitive("tfoot");
export const TableHead = createPrimitive("th", "h-12 px-4 text-left align-middle font-medium text-muted-foreground");
export const TableHeader = createPrimitive("thead");
export const TableRow = createPrimitive("tr", "border-b transition-colors");
