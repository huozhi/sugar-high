"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export const tokenTypes = [
  "identifier",
  "keyword",
  "string",
  "class",
  "sign",
  "comment",
  "break",
  "space",
  "jsxliterals",
];

export type Palette = {
  identifier: string;
  class: string;
  sign: string;
  string: string;
  keyword: string;
  comment: string;
  jsxliterals: string;
};

export type Preset = {
  label: string;
  value: string;
  palette: Palette;
};

type PaletteContextProps = {
  palettes: { label: string; presets: Preset[] }[];
  addCustomPalette: (preset: Preset) => void;
  selectedPalette: Preset;
  setSelectedPalette: (preset: Preset) => void;
};

export const defaultPalette: Palette = {
  class: "#8d85ff",
  identifier: "#354150",
  sign: "#8996a3",
  string: "#00a99a",
  keyword: "#f47067",
  comment: "#a19595",
  jsxliterals: "#bf7db6",
};

type PaletteGroup = {
  label: string;
  presets: Preset[];
};
const defaultPalettes = [
  {
    label: "Default Palettes",
    presets: [
      {
        label: "SH Default",
        value: "sh-default",
        palette: defaultPalette,
      },
      {
        label: "v0",
        value: "v0",
        palette: {
          class: "#00a7fd",
          identifier: "#fff",
          sign: "#9b9b9b",
          string: "#00e7c1",
          keyword: "#ff0078",
          comment: "#a19595",
          jsxliterals: "#ffff72",
        },
      },
      {
        label: "vercel",
        value: "vercel",
        palette: {
          class: "#52a8ff", // From --shiki-token-constant
          identifier: "#ededed", // From --shiki-color-text
          sign: "#ededed", // From --shiki-token-punctuation
          string: "#62c073", // From --shiki-token-string
          keyword: "#f75f8f", // From --shiki-token-keyword
          comment: "#a1a1a1", // From --shiki-token-comment
          jsxliterals: "#62c073", // From --shiki-token-string-expression
        },
      },
    ],
  },
  {
    label: "Custom Palettes",
    presets: [],
  },
];

const PaletteContext = createContext<PaletteContextProps | undefined>(
  undefined
);

export const PaletteProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [palettes, setPalettes] = useState<PaletteGroup[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<Preset>(
    defaultPalettes[0].presets[0]
  );

  const addCustomPalette = (preset: Preset) => {
    // Logic to add custom palette
    const updatedPalettes = [...palettes];
    const customPaletteGroup = updatedPalettes.find(
      (group) => group.label === "Custom Palettes"
    );
    if (customPaletteGroup) {
      customPaletteGroup.presets.push(preset);
    } else {
      updatedPalettes.push({
        label: "Custom Palettes",
        presets: [preset],
      });
    }
    setPalettes(updatedPalettes);
    setSelectedPalette(preset);
  };

  useEffect(() => {
    if (palettes == defaultPalettes || palettes.length === 0) return;
    console.log("Saving palettes to local storage");
    localStorage.setItem("palettes", JSON.stringify(palettes));
  }, [palettes]);

  useEffect(() => {
    console.log("Loading palettes from local storage");
    const storedPalettes = localStorage.getItem("palettes");
    if (storedPalettes) {
      const parsedPalettes = JSON.parse(storedPalettes);
      if (parsedPalettes.length > 0) {
        setPalettes(parsedPalettes);
        console.log("Loaded palettes from local storage");
        return;
      }
    }
    setPalettes(defaultPalettes);
    console.log("Loaded default palettes");
  }, []);

  return (
    <PaletteContext.Provider
      value={{
        palettes,
        addCustomPalette,
        selectedPalette,
        setSelectedPalette,
      }}
    >
      {children}
    </PaletteContext.Provider>
  );
};

export const usePalette = () => {
  const context = useContext(PaletteContext);
  if (!context) {
    throw new Error("usePalette must be used within a PaletteProvider");
  }
  return context;
};
