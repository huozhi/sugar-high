"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CopyIcon, CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import clipboardCopy from "clipboard-copy";
import React, { useRef, useState } from "react";
import PaletteSwitcher from "./palette";
import TerminalConsole, { TerminalConsoleRef } from "./terminal";
import { highlight } from "sugar-high";
import { usePalette } from "./palette/context";
import { useToast } from "@/components/ui/use-toast";
import { useTextTypingAnimation } from "@/lib/hooks";
import TokenLogs, { useDebouncedTokenize } from "./debug/token-logs";
import { ConsoleTerminalDebugProvider } from "./debug/context";
import CTAArrow from "./cta-arrow";

type Props = {
  className?: string;
};

const ConsoleDemo = ({ className, ...props }: Props) => {
  const { selectedPalette } = usePalette();
  const { toast } = useToast();
  const [showCta, setShowCta] = useState(true);
  const editorRef = useRef<TerminalConsoleRef | null>(null);
  const defaultLiveCode = `\
  export default function App() {
    return <p>hello world</p>
  }`;

  const installPackageCommands = [
    { packageManager: "npm", command: "npm install sugar-high" },
    { packageManager: "yarn", command: "yarn add sugar-high" },
    { packageManager: "bun", command: "bun install sugar-high" },
    { packageManager: "pnpm", command: "pnpm add sugar-high" },
  ];

  const copyToClipboard = (cmd: string) => {
    clipboardCopy(cmd);
    toast({
      description: `Copied: ${cmd}`,
    });
  };

  const {
    text: liveCode,
    isTyping,
    setText,
  } = useTextTypingAnimation({
    targetText: defaultLiveCode,
    delay: 1000, // 1 second
    onReady: () => {
      console.log("Finished typing");

      if (editorRef.current) {
        // focus needs to be delayed
        setTimeout(() => {
          editorRef.current?.focus();
        });
      }
    },
  });

  //? Logic for Debugging Token Highlighting
  const { liveCodeTokens, debouncedTokenize } = useDebouncedTokenize(liveCode);

  return (
    <ConsoleTerminalDebugProvider>
      <Card
        className={cn("w-full max-w-[600px] backdrop-blur-sm", className)}
        {...props}
      >
        <div className="border-b">
          <div className="flex h-16 items-center px-4 justify-between">
            <div
              className="flex gap-2 hover:opacity-75 transition-opacity duration-500 cursor-pointer"
              onClick={() => {
                setText(defaultLiveCode);
                toast({
                  description: (
                    <div className="flex items-center gap-2">
                      <CounterClockwiseClockIcon className=" h-4 w-4" />
                      Reset editor to default code.
                    </div>
                  ),
                });
              }}
            >
              <div className="w-3 h-3 rounded-full border bg-red-500" />
              <div className="w-3 h-3 rounded-full border bg-yellow-500" />
              <div className="w-3 h-3 rounded-full border bg-green-500" />
            </div>
            <PaletteSwitcher onClick={() => setShowCta(false)} />
            {showCta && (
              <CTAArrow
                text={"Change Palette"}
                className="mt-4 -right-[110px] hidden lg:block"
                arrowColor={selectedPalette.palette.keyword}
                duration={3}
              />
            )}
          </div>
        </div>
        <CardContent className="grid gap-4 mt-6">
          <TerminalConsole
            ref={editorRef}
            value={liveCode}
            className="font-mono"
            highlight={highlight}
            onChange={(newCode) => {
              setText(newCode);
              debouncedTokenize(newCode);
            }}
            palette={selectedPalette.palette}
          />
        </CardContent>
        <CardFooter>
          <div className="w-full grid grid-cols-1 gap-4">
            {true && <TokenLogs tokens={liveCodeTokens} isTyping={isTyping} />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="w-full relative font-mono"
                  onMouseUp={(e) => {
                    if (e.button === 1) {
                      window.open(
                        "https://www.npmjs.com/package/sugar-high",
                        "_blank"
                      );
                    }
                  }}
                >
                  $ {installPackageCommands[0].command}
                  <div className="hover:bg-muted-foreground absolute p-2 mr-1 right-0 rounded-sm transition-colors duration-500">
                    <CopyIcon className=" h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-2">
                {installPackageCommands.map((pkgCmd, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => copyToClipboard(pkgCmd.command)}
                  >
                    {pkgCmd.packageManager}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </Card>
    </ConsoleTerminalDebugProvider>
  );
};

export default ConsoleDemo;
