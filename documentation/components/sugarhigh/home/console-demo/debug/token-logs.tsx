"use client";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDownIcon,
  CircleIcon,
  CrossCircledIcon,
  InfoCircledIcon,
  PlusIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect, use } from "react";
import { tokenize, SugarHigh } from "sugar-high";
import { cn, debounce } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Palette, usePalette } from "../palette/context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DebugToolsCard from "./tools";
import { useConsoleTerminalDebug } from "./context";

const TokenLogs = ({
  tokens,
  isTyping,
}: {
  tokens: [number, string][];
  isTyping?: boolean;
}) => {
  const { setTokens } = useConsoleTerminalDebug();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDebugToolsOpen, setIsDebugToolsOpen] = useState<boolean>(false);
  const { selectedPalette } = usePalette();

  useEffect(() => {
    setTokens(tokens);
  }, [tokens]);

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
        <div
          className={cn(
            "h-full w-full rounded-md relative grid pt-2 gap-2",
            isDebugToolsOpen ? "grid-cols-2" : "grid-cols-1"
          )}
        >
          <Badge
            variant="outline"
            className="gap-1 py-1 absolute top-0 right-0 z-10 m-4 bg-black cursor-pointer"
            onClick={() => setIsDebugToolsOpen((prev) => !prev)}
          >
            {isDebugToolsOpen ? (
              <CrossCircledIcon className="h-4 w-4" />
            ) : (
              <InfoCircledIcon className="h-4 w-4" />
            )}
            {isDebugToolsOpen ? "Close Debug Tools" : "Open Debug Tools"}
          </Badge>

          <ScrollArea className="h-72 w-full rounded-md border relative">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20px]">Index</TableHead>
                  <TableHead className="w-[100px] text-center">Token</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.map(([tokenType, token], i) => (
                  <TokenTableRow
                    key={i}
                    index={i}
                    tokenType={tokenType}
                    token={token}
                    palette={selectedPalette}
                  />
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          {isDebugToolsOpen && <DebugToolsCard />}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TokenLogs;

interface TokenTableRowProps {
  index: number;
  tokenType: number; // Replace with the actual type
  token: string; // Replace with the actual type
  palette: any; // Replace with the actual type
}

const TokenTableRow: React.FC<TokenTableRowProps> = ({
  index,
  tokenType,
  token,
  palette,
}) => {
  const rowRef = useRef<HTMLTableRowElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  const handleRowClick = () => {
    setIsSelected(true);
    rowRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  useEffect(() => {
    if (isSelected) {
      const timer = setTimeout(() => {
        setIsSelected(false);
      }, 500); // 0.5 second after scrolling completes

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isSelected]);

  const tokenTypeName =
    SugarHigh.TokenTypes[tokenType].charAt(0).toUpperCase() +
    SugarHigh.TokenTypes[tokenType].slice(1);

  return (
    <TableRow
      className="cursor-pointer"
      ref={rowRef}
      onClick={handleRowClick}
      data-state={isSelected ? "selected" : ""}
    >
      <TableCell className="font-medium text-right text-muted-foreground mr-2">
        {index}
      </TableCell>
      <TableCell className="text-center">
        <Badge
          variant="outline"
          className="border w-full"
          style={{
            borderColor:
              palette.palette[
                SugarHigh.TokenTypes[tokenType] as keyof Palette
              ] + (isSelected ? "FF" : "40"), //Hex 25% Opacity - Not Ideal way to do this :p
          }}
        >
          <span className="w-full text-center">{tokenTypeName}</span>
        </Badge>
      </TableCell>
      <TableCell className="text-left">{token}</TableCell>
    </TableRow>
  );
};

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
