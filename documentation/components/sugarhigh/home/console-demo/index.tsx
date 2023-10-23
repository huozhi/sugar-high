import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BellIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import React from "react";
import PaletteSwitcher from "./palette";
import LiveConsole from "./console-demo";
import TerminalConsole from "./terminal";
import { highlight } from "sugar-high";
import { usePalette } from "./palette/context";

type Props = {
  className?: string;
};

const ConsoleDemo = ({ className, ...props }: Props) => {
  const defaultLiveCode = `\
export default function App() {
  return <p>hello world</p>
}`;
  const { selectedPalette } = usePalette();
  return (
    <Card className={cn("w-[600px]", className)} {...props}>
      <div className="border-b">
        <div className="flex h-16 items-center px-4 justify-between">
          <div className="flex">
            {[1, 2, 3].map((_, i) => (
              <span key={i} className="mr-1 w-3 h-3 rounded-full border" />
            ))}
          </div>
          <PaletteSwitcher />
        </div>
      </div>
      <CardContent className="grid gap-4 mt-6">
        <TerminalConsole
          value={defaultLiveCode}
          className="font-mono"
          highlight={highlight}
          onChange={(e) => console.log(e)}
          palette={selectedPalette.palette}
        />
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConsoleDemo;
