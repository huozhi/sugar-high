"use client";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { CrossCircledIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect } from "react";
import { tokenize, SugarHigh } from "sugar-high";
import { debounce } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Palette, usePalette } from "./palette/context";

const TokenLogs = ({
  tokens,
  isTyping,
}: {
  tokens: [number, string][];
  isTyping?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedPalette } = usePalette();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger>
        <div className="flex items-center justify-start w-full">
          <h4 className="text-sm font-medium leading-none"></h4>
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1 py-1">
              {isOpen ? (
                <CrossCircledIcon className="h-4 w-4" />
              ) : (
                <InfoCircledIcon className="h-4 w-4" />
              )}
              Token Logs{isTyping ? " - Typing..." : ""}
            </Badge>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ScrollArea className="h-72 w-full rounded-md border mt-2">
          <Table>
            <TableCaption className="my-2">
              Tokens{isTyping ? " - Typing..." : " - Finished Typing"}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20px]">Index</TableHead>
                <TableHead className="w-[100px] text-center">Token</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map(([tokenType, token], i) => {
                const tokenTypeName =
                  SugarHigh.TokenTypes[tokenType].charAt(0).toUpperCase() +
                  SugarHigh.TokenTypes[tokenType].slice(1);

                return (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-right text-muted-foreground mr-2">
                      {i}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="border w-full"
                        style={{
                          borderColor:
                            selectedPalette.palette[
                              SugarHigh.TokenTypes[tokenType] as keyof Palette
                            ] + "40", //Hex 25% Opacity - Not Ideal way to do this :p
                        }}
                      >
                        <span className="w-full text-center">
                          {tokenTypeName}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-left">{token}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TokenLogs;

export const useDebouncedTokenize = (
  initialCode: string,
  delay: number = 300
) => {
  const [liveCodeTokens, setLiveCodeTokens] = useState<[number, string][]>([]);
  const debouncedTokenizeRef = useRef(
    debounce((code: string) => {
      const tokens = tokenize(code);
      setLiveCodeTokens(tokens);
    }, delay)
  );

  // Initialize
  useEffect(() => {
    debouncedTokenizeRef.current(initialCode);
  }, [initialCode]);

  const debouncedTokenize = debouncedTokenizeRef.current;

  return { liveCodeTokens, debouncedTokenize };
};
