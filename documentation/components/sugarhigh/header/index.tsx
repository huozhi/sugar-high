"use client";
import React from "react";
import { NavigationMenuDemo } from "./navigation";
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
import { GitHubLogoIcon, ArchiveIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-8 flex justify-between">
      <div className="flex">
        <Link href={"/"}>
          <h1 className="text-md font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 py-2 md:py-4 cursor-pointer mr-4">
            Sugar High
          </h1>
        </Link>
        <NavigationMenuDemo />
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
                  <ArchiveIcon className="h-5 w-4" />
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
