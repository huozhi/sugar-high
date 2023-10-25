"use client";

import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Preset, usePalette } from "./context";
import { useState } from "react";
import PaletteCreator from "./creator";
import { Label } from "@/components/ui/label";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface PaletteSwitcherProps extends PopoverTriggerProps {
  onClick?: () => void;
}

export default function PaletteSwitcher({
  className,
  onClick,
}: PaletteSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [showNewPaletteDialog, setShowNewPaletteDialog] = useState(false);
  const { palettes, addCustomPalette, selectedPalette, setSelectedPalette } =
    usePalette();

  return (
    <Dialog open={showNewPaletteDialog} onOpenChange={setShowNewPaletteDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a palette"
            className={cn("w-[200px] justify-between", className)}
            id="palette-switcher"
            onClick={onClick}
          >
            <div
              className={cn("mr-2 h-5 w-5 rounded-full")}
              style={{
                background: `linear-gradient(to right, ${selectedPalette.palette.keyword} 0%, ${selectedPalette.palette.class} 90%, ${selectedPalette.palette.identifier} 100%)`,
              }}
            />
            {selectedPalette.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search Palette..." />
              <CommandEmpty>No palette found.</CommandEmpty>
              {palettes.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.presets.map((preset) => (
                    <CommandItem
                      key={preset.value}
                      onSelect={() => {
                        setSelectedPalette(preset);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <div
                        className={"mr-2 h-5 w-5 rounded-full "}
                        style={{
                          background: `linear-gradient(to right, ${preset.palette.keyword} 0%, ${preset.palette.class} 90%, ${preset.palette.identifier} 100%)`,
                        }}
                      />
                      {preset.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedPalette.value === preset.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewPaletteDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Palette
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <PaletteCreator onCancel={() => setShowNewPaletteDialog(false)} />
    </Dialog>
  );
}
