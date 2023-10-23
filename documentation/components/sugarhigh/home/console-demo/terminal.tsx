import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { highlight } from "sugar-high";
import { Palette, defaultPalette } from "./palette/context";

interface EditorProps {
  title?: string;
  value?: string;
  onChange: (code: string) => void;
  highlight: (code: string) => string;
  className?: string;
  palette?: Palette;
}

const TerminalConsole = ({
  title,
  value,
  onChange,
  highlight,
  className,
  palette = defaultPalette,
}: EditorProps) => {
  const codeRef = useRef<HTMLSpanElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(value);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [maxCharsPerLine, setMaxCharsPerLine] = useState<number | null>(null);

  const update = (code: string) => {
    if (maxCharsPerLine) {
      const lines = code.split("\n");
      const newLines = lines.map((line) => {
        if (line.length > maxCharsPerLine) {
          // Insert line breaks as needed
          const segments = line.match(
            new RegExp(`.{1,${maxCharsPerLine}}`, "g")
          );
          return segments ? segments.join("\n") : line;
        }
        return line;
      });
      code = newLines.join("\n");
    }
    const highlighted = highlight(code);
    setText(code);
    onChange(code);
    if (codeRef.current) codeRef.current.innerHTML = highlighted;
  };

  useEffect(() => {
    // Calculate maxCharsPerLine based on the scrollArea width
    if (scrollAreaRef.current) {
      const width = scrollAreaRef.current.offsetWidth;
      // Assume each character takes approximately 10px (this is an estimate; adjust as needed)
      setMaxCharsPerLine(Math.floor(width / 9));
    }
    update(value ? value : "");
  }, [value, scrollAreaRef.current]);

  const onInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const code = event.target.value || "";
    update(code);
  };

  return (
    <ScrollArea
      ref={scrollAreaRef}
      id="terminal-console"
      className={cn(
        "min-h-[300px] h-full lg:h-[30vh] w-full rounded-md text-left relative",
        className
      )}
    >
      <style>{`
        ${`
        .editor {
          --sh-class: ${palette.class};
          --sh-identifier: ${palette.identifier};
          --sh-sign: ${palette.sign};
          --sh-string: ${palette.string};
          --sh-keyword: ${palette.keyword};
          --sh-comment: ${palette.comment};
          --sh-jsxliterals: ${palette.jsxliterals};
        }
        `}`}</style>
      <pre>
        <code
          ref={codeRef}
          className={cn("mr-2 font-light editor", className)}
        />
      </pre>
      <textarea
        ref={textareaRef}
        className={cn(
          "absolute top-0 left-0 w-full resize-none h-full font-light bg-transparent text-transparent focus:outline-none selection:text-select selection:bg-select caret-sh-keyword",
          className
        )}
        value={text}
        onChange={onInput}
      ></textarea>
    </ScrollArea>
  );
};

export default TerminalConsole;
