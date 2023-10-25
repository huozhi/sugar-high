import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the context shape
interface ConsoleTerminalDebugContextProps {
  showMaxCharPerLineLog: boolean;
  setShowMaxCharPerLineLog: (show: boolean) => void;
  maxCharsPerLine: number;
  setMaxCharsPerLine: (max: number) => void;

  showEditorTextOnChangeLog: boolean;
  setShowEditorTextOnChangeLog: (show: boolean) => void;

  showEditorText: boolean;
  setShowEditorText: (show: boolean) => void;

  tokens: [number, string][];
  setTokens: (tokens: [number, string][]) => void;
}

// Create context
const ConsoleTerminalDebugContext = createContext<
  ConsoleTerminalDebugContextProps | undefined
>(undefined);

// Create Provider
interface ProviderProps {
  children: ReactNode;
}

export const ConsoleTerminalDebugProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  // State management
  const [showMaxCharPerLineLog, setShowMaxCharPerLineLog] =
    useState<boolean>(false);
  const [maxCharsPerLine, setMaxCharsPerLine] = useState<number>(0);
  const [showEditorTextOnChangeLog, setShowEditorTextOnChangeLog] =
    useState<boolean>(false);
  const [showEditorText, setShowEditorText] = useState<boolean>(false);
  const [tokens, setTokens] = useState<[number, string][]>([]);

  // Provide state and setters to children
  const value = {
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
  };

  return (
    <ConsoleTerminalDebugContext.Provider value={value}>
      {children}
    </ConsoleTerminalDebugContext.Provider>
  );
};

// Custom hook to use the context
export const useConsoleTerminalDebug = (): ConsoleTerminalDebugContextProps => {
  const context = useContext(ConsoleTerminalDebugContext);
  if (context === undefined) {
    throw new Error(
      "useConsoleTerminalDebug must be used within a ConsoleTerminalDebugProvider"
    );
  }
  return context;
};
