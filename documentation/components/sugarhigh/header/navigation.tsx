"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
// import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { MarginIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

const documentation: { title: string; href: string; description: string }[] = [
  {
    title: "Highlighting",
    href: "/docs/features/highlighting",
    description:
      "Utilize the highlight function to convert code to highlighted HTML.",
  },
  {
    title: "Line Numbers",
    href: "/docs/features/line-numbers",
    description: "Enable line numbers with simple CSS customization.",
  },
  {
    title: "Token Customization",
    href: "/docs/features/token-customization",
    description: "Customize the appearance of different token types using CSS.",
  },
  {
    title: "CSS Class Names",
    href: "/docs/features/css-class-names",
    description:
      "Utilize custom CSS class names to further customize the output node of each token.",
  },
  {
    title: "Inline Editing",
    href: "/docs/features/editor",
    description:
      "Set up inline editing to modify code directly within the highlighted output, providing a dynamic, interactive code editing and viewing experience.",
  },
  {
    title: "License",
    href: "/docs/license",
    description:
      "Understand the licensing under which Sugar High is distributed.",
  },
];
export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            Getting started
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <MarginIcon className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Sugar High
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Super lightweight syntax highlighter for JSX,
                      <b> 1KB</b> after minified and gizpped.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Examples">
                Component examples built using Sugar High!
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                Installation and getting started with the basic usage.
              </ListItem>
              <ListItem
                href="/docs/primitives/customization"
                title="Customization"
              >
                Create your own customized color palettes
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            Documentation
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {documentation.map((page) => (
                <ListItem key={page.title} title={page.title} href={page.href}>
                  {page.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
