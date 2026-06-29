import { ButtonBase, createPrimitive, Div, Span } from "./base";

export const Breadcrumb = createPrimitive("nav");
export const BreadcrumbEllipsis = createPrimitive("span", "flex h-9 w-9 items-center justify-center");
export const BreadcrumbItem = createPrimitive("li", "inline-flex items-center gap-1.5");
export const BreadcrumbLink = createPrimitive("a", "transition-colors hover:text-foreground");
export const BreadcrumbList = createPrimitive("ol", "flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground");
export const BreadcrumbPage = createPrimitive("span", "font-normal text-foreground");
export const BreadcrumbSeparator = createPrimitive("li", "[&>svg]:size-3.5");

export const Command = Div;
export const CommandDialog = Div;
export const CommandEmpty = Div;
export const CommandGroup = Div;
export const CommandInput = createPrimitive("input");
export const CommandItem = Div;
export const CommandList = Div;
export const CommandSeparator = createPrimitive("div", "-mx-1 h-px bg-border");
export const CommandShortcut = Span;

export const Menubar = Div;
export const MenubarCheckboxItem = Div;
export const MenubarContent = Div;
export const MenubarGroup = Div;
export const MenubarItem = Div;
export const MenubarLabel = Div;
export const MenubarMenu = Div;
export const MenubarPortal = ({ children }) => children;
export const MenubarRadioGroup = Div;
export const MenubarRadioItem = Div;
export const MenubarSeparator = createPrimitive("div", "-mx-1 my-1 h-px bg-border");
export const MenubarShortcut = Span;
export const MenubarSub = Div;
export const MenubarSubContent = Div;
export const MenubarSubTrigger = Div;
export const MenubarTrigger = ButtonBase;

export const NavigationMenu = Div;
export const NavigationMenuContent = Div;
export const NavigationMenuIndicator = Div;
export const NavigationMenuItem = Div;
export const NavigationMenuLink = createPrimitive("a");
export const NavigationMenuList = Div;
export const NavigationMenuTrigger = ButtonBase;
export const NavigationMenuViewport = Div;
export const navigationMenuTriggerStyle = () => "";

export const Pagination = createPrimitive("nav");
export const PaginationContent = createPrimitive("ul", "flex flex-row items-center gap-1");
export const PaginationEllipsis = Span;
export const PaginationItem = createPrimitive("li");
export const PaginationLink = createPrimitive("a");
export const PaginationNext = createPrimitive("a");
export const PaginationPrevious = createPrimitive("a");

export const Tabs = Div;
export const TabsContent = Div;
export const TabsList = Div;
export const TabsTrigger = ButtonBase;
