import { StackIcon, CodeIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { useConsoleTerminalDebug } from "./context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type Props = {};

type ToggleOption = {
  label: string;
  id: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

const DebugToolsCard = (props: Props) => {
  const {
    showMaxCharPerLineLog, // Implemented in ../terminal.tsx
    setShowMaxCharPerLineLog, // Implemented in ./tools.tsx
    maxCharsPerLine, // Implemented in ../terminal.tsx
    setMaxCharsPerLine, // Implemented in ../terminal.tsx
    showEditorTextOnChangeLog, // Implemented in ../terminal.tsx
    setShowEditorTextOnChangeLog, // Implemented in ./tools.tsx
    showEditorText, // Implemented in ../terminal.tsx
    setShowEditorText, // Implemented in ./tools.tsx
    tokens,
    setTokens, // Implemented in ../terminal.tsx
  } = useConsoleTerminalDebug();

  const tokencount = useMotionValue(0);
  const animatedValue = useSpring(tokens.length);

  useEffect(() => {
    animatedValue.set(tokens.length);
  }, [animatedValue, tokens.length]);

  const animatedTokenCount = useTransform(animatedValue, (latest) =>
    Math.round(latest)
  );

  const toggleOptions = [
    {
      label: "Characters per line",
      id: "maxCharsPerLine",
      value: showMaxCharPerLineLog,
      onChange: setShowMaxCharPerLineLog,
    },
    {
      label: "Editor text on change",
      id: "editorTextOnChange",
      value: showEditorTextOnChangeLog,
      onChange: setShowEditorTextOnChangeLog,
    },
  ];

  return (
    <div className="rounded-md border">
      <div className="flex justify-start items-center p-2 py-3 border-b ">
        <h4 className="font-semibold leading-none tracking-tight">Debug/sh</h4>
      </div>
      <div className="flex flex-wrap space-x-4 text-sm text-muted-foreground ">
        <ScrollArea className="w-full relative h-[244px]">
          <div className="p-4">
            <Card className={cn("w-full text-left")}>
              <CardHeader>
                <CardTitle>Terminal</CardTitle>
                <CardDescription>Debug Information</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="debug-editor-text-switch"
                          checked={showEditorText}
                          onCheckedChange={setShowEditorText}
                        />
                        <Label
                          htmlFor="debug-editor-text-switch"
                          className="cursor-help flex"
                        >
                          <StackIcon className="mr-1 h-4 w-4" />
                          Show Editor Text
                        </Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Shows Editor Text Overlay Alignment</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CodeIcon className="h-4 w-4" />
                    <motion.span>{animatedTokenCount}</motion.span>
                    tokens
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={"w-full text-left mt-2"}>
              <CardHeader>
                <CardTitle>Console Logs</CardTitle>
                <CardDescription>Toggle Console Logs</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {toggleOptions.map((option) => (
                  <div className="flex items-center space-x-2" key={option.id}>
                    <Checkbox
                      checked={option.value}
                      id={option.id}
                      onCheckedChange={(checked: boolean) =>
                        option.onChange(checked)
                      }
                    />
                    <label
                      htmlFor={option.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DebugToolsCard;
