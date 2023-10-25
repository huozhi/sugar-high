"use client";
import React from "react";
import {
  NavigationMenuDemo,
  documentation,
  gettingStarted,
} from "./navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { GitHubLogoIcon, ArchiveIcon, MarginIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { MobileView, BrowserView } from "react-device-detect";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-8 flex justify-between">
      <div className="flex">
        <Sheet>
          <SheetTrigger>
            <h1 className="text-md font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 py-2 md:py-4 cursor-pointer mx-4 sm:hidden">
              Sugar High
            </h1>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>
                <Link href={"/"}>
                  <div className="flex items-center gap-2 -translate-x-2">
                    <MarginIcon className="h-6 w-6" />
                    <h1 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white/75 to-gray-500 py-2 md:py-4 cursor-pointer w-full text-left">
                      Sugar High
                    </h1>
                  </div>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="relative overflow-hidden my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <h4 className="mb-4 text-lg font-medium leading-none">
                Getting Started
              </h4>
              <Separator className="my-2" />
              {gettingStarted.map((link) => (
                <div key={link.href} className="my-2">
                  <Link
                    href={link.href}
                    className="text-md font-semibold hover:underline flex items-center gap-1"
                  >
                    {link.title} <ArrowTopRightIcon />
                  </Link>
                  <p className="text-xs font-mono text-muted-foreground">
                    {link.description}
                  </p>
                </div>
              ))}
              <h4 className="my-4 text-lg font-medium leading-none">
                Documentation
              </h4>
              <Separator className="my-2" />
              {documentation.map((link) => (
                <div key={link.href} className="my-2">
                  <Link
                    href={link.href}
                    className="text-md font-semibold hover:underline flex items-center gap-1"
                  >
                    {link.title} <ArrowTopRightIcon />
                  </Link>
                  <p className="text-xs font-mono text-muted-foreground">
                    {link.description}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <div className="hidden sm:flex">
          <Link href={"/"}>
            <h1 className="text-md font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 py-2 md:py-4 cursor-pointer mr-4">
              Sugar High
            </h1>
          </Link>
          <NavigationMenuDemo />
        </div>
      </div>
      <div className="flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                href="https://github.com/huozhi/sugar-high"
                legacyBehavior
                passHref
              >
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
                >
                  <GitHubLogoIcon className="h-4 w-4" />
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="https://www.npmjs.com/package/sugar-high"
                legacyBehavior
                passHref
              >
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
                >
                  <ArchiveIcon className="h-4 w-4" />
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;
