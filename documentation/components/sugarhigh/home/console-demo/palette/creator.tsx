import { useState } from "react";
import { Palette, Preset, defaultPalette, usePalette } from "./context";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { useToast } from "@/components/ui/use-toast";

const PaletteCreator = ({ onCancel }: { onCancel: () => void }) => {
  const { addCustomPalette, setSelectedPalette } = usePalette();
  const { toast } = useToast();

  // State to hold the new palette name
  const [newPaletteName, setNewPaletteName] = useState<string>("");

  // State to hold the selected colors
  const [newPaletteColors, setNewPaletteColors] =
    useState<Palette>(defaultPalette);

  const onReset = () => {
    setNewPaletteColors(defaultPalette);
  };

  const handleCreatePalette = () => {
    if (!newPaletteName) {
      toast({
        variant: "destructive",
        title: "Uh oh! Missing Palette Name!",
        description: "Looks like you forgot to add a name for your palette!",
      });
      return;
    }
    const newPreset: Preset = {
      label: newPaletteName, // Use the name from state
      value: newPaletteName.toLowerCase().replace(/ /g, "-"),
      palette: newPaletteColors, // Use the colors from state
    };
    addCustomPalette(newPreset);
    onCancel();
  };

  const handleColorChange = (color: string, tokenTypeName: keyof Palette) => {
    setNewPaletteColors({
      ...newPaletteColors,
      [tokenTypeName]: color,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Palette</DialogTitle>
        <DialogDescription>
          Add a new custom palette to Sugar High.
        </DialogDescription>
      </DialogHeader>
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="text">Palette name</Label>
            <Input
              id="text"
              placeholder="Crimson High"
              value={newPaletteName}
              onChange={(e) => setNewPaletteName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan">Palette Selection</Label>
            <div className="flex w-full rounded-md border border-input bg-transparent px-3 py-3 text-sm shadow-sm transition-colors gap-2 flex-wrap">
              {Object.keys(newPaletteColors).map((tokenTypeName) => (
                <SelectPaletteColor
                  key={tokenTypeName}
                  tokenTypeName={tokenTypeName as keyof Palette}
                  selectedColor={
                    newPaletteColors[tokenTypeName as keyof Palette]
                  }
                  onColorChange={handleColorChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <div className="justify-between w-full flex">
          <Button variant="ghost" onClick={onReset}>
            Reset
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleCreatePalette}>
              Save
            </Button>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

const SelectPaletteColor = ({
  tokenTypeName,
  selectedColor,
  onColorChange,
}: {
  tokenTypeName: keyof Palette;
  selectedColor: string;
  onColorChange: (color: string, tokenTypeName: keyof Palette) => void;
}) => {
  const capitalizedColorName =
    tokenTypeName.charAt(0).toUpperCase() + tokenTypeName.slice(1);

  const handleColorSelection = (color: string) => {
    onColorChange(color, tokenTypeName);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex justify-center items-center h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors cursor-pointer">
          <div
            className="mr-2 h-5 w-5 border border-input rounded-sm"
            style={{ backgroundColor: selectedColor }}
          />
          <div>{capitalizedColorName}</div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[232px]">
        <HexColorPicker color={selectedColor} onChange={handleColorSelection} />
        <div className="my-2">
          <Label
            htmlFor="hexcolorinput"
            className="text-muted-foreground text-xs"
          >
            Input Color
          </Label>
          <HexColorInput
            color={selectedColor}
            onChange={handleColorSelection}
            id="hexcolorinput"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 before:content:['#']"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PaletteCreator;
