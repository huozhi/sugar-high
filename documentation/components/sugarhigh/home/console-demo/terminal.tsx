"use client";
import { cn } from "@/lib/utils";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Palette, defaultPalette } from "./palette/context";
import dynamic from "next/dynamic";
const DynamicScrollSync = dynamic(
  () => import("react-scroll-sync").then((mod) => mod.ScrollSync),
  {
    ssr: false,
  }
);

const DynamicScrollSyncPane = dynamic(
  () => import("react-scroll-sync").then((mod) => mod.ScrollSyncPane),
  {
    ssr: false,
  }
);
import { useConsoleTerminalDebug } from "./debug/context";

interface EditorProps {
  title?: string;
  value?: string;
  onChange: (code: string) => void;
  highlight: (code: string) => string;
  className?: string;
  palette?: Palette;
}

export interface TerminalConsoleRef {
  focus: () => void;
}

const TerminalConsole = forwardRef<TerminalConsoleRef, EditorProps>(
  (
    { title, value, onChange, highlight, className, palette = defaultPalette },
    ref
  ) => {
    const codeRef = useRef<HTMLSpanElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [text, setText] = useState(value);
    const {
      showEditorTextOnChangeLog,
      maxCharsPerLine,
      setMaxCharsPerLine,
      showMaxCharPerLineLog,
      showEditorText,
    } = useConsoleTerminalDebug();

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      setMaxCharsPerLine(Math.floor(450 / 9));
    }, []);

    const update = (code: string) => {
      if (showEditorTextOnChangeLog) console.log("Editor:", code);
      if (showMaxCharPerLineLog)
        console.log("maxCharsPerLine", maxCharsPerLine); //This is never being triggered
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

      const highlighted = highlight(code);
      setText(code);
      onChange(code);
      if (codeRef.current) codeRef.current.innerHTML = highlighted;
    };

    // Expose focus method to parent component
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      },
    }));

    useLayoutEffect(() => {
      update(value ? value : "");
    }, [value]);

    const onInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const code = event.target.value || "";
      update(code);
    };

    return (
      <>
        <DynamicScrollSync>
          <div className="w-full grid-cols-1 grid h-[300px] relative">
            <DynamicScrollSyncPane>
              <div
                className="overflow-y-auto overflow-x-hidden scrollbar-thin"
                ref={scrollAreaRef}
              >
                <section style={{ height: 1000 }} id="terminal-console">
                  <pre className="min-h-[300px] h-full lg:h-[30vh] w-full rounded-md text-left relative">
                    <style>
                      {`
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
                      `}`}
                    </style>
                    <code
                      ref={codeRef}
                      className={cn("mr-2 font-light editor", className)}
                    />
                  </pre>
                </section>
              </div>
            </DynamicScrollSyncPane>

            <DynamicScrollSyncPane>
              <textarea
                ref={textareaRef}
                className={cn(
                  "absolute top-0 left-0 w-full resize-none h-full font-light text-clip scrollbar-hidden bg-transparent  focus:outline-none selection:text-select selection:bg-select caret-sh-keyword ml-[33px]",
                  showEditorText ? "text-white/10" : "text-transparent",
                  className
                )}
                value={text}
                onChange={onInput}
              ></textarea>
            </DynamicScrollSyncPane>
          </div>
        </DynamicScrollSync>
      </>
    );
  }
);

TerminalConsole.displayName = "TerminalConsole";

export default TerminalConsole;
