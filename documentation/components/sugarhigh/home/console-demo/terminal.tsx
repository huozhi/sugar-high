import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { highlight } from "sugar-high";
import { Palette, defaultPalette } from "./palette/context";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
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
        console.log("code", code);
      }
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
      <ScrollSync>
        <div className="w-full grid-cols-1 grid h-[300px] relative">
          <ScrollSyncPane>
            <div
              className="overflow-y-auto overflow-x-hidden scrollbar-thin"
              // ref={scrollAreaRef}s
            >
              <section
                style={{ height: 1000 }}
                // ref={scrollAreaRef}
                id="terminal-console"
              >
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
          </ScrollSyncPane>

          <ScrollSyncPane>
            <textarea
              ref={textareaRef}
              className={cn(
                "absolute top-0 left-0 w-full resize-none h-full font-light text-clip scrollbar-hidden bg-transparent  focus:outline-none selection:text-select selection:bg-select caret-sh-keyword ml-[33px]",
                false ? "text-transparent" : "text-white/10",
                className
              )}
              value={text}
              onChange={onInput}
            ></textarea>
          </ScrollSyncPane>
        </div>
      </ScrollSync>
      // <ScrollSync>
      //   <div
      //     className="w-full grid-cols-1 grid h-[300px] relative"
      //     id="terminal-console-constraints"
      //   >
      //     <ScrollSyncPane>
      //       <div
      //         className="overflow-y-auto overflow-x-hidden scrollbar-thin"
      //         // ref={scrollAreaRef}
      //       >
      //         <section style={{ height: 1000 }} id="terminal-console">
      //           <pre className="min-h-[300px] h-full lg:h-[30vh] w-full rounded-md text-left relative">
      //             <style>
      //               {`
      //                 ${`
      //                 .editor {
      //                   --sh-class: ${palette.class};
      //                   --sh-identifier: ${palette.identifier};
      //                   --sh-sign: ${palette.sign};
      //                   --sh-string: ${palette.string};
      //                   --sh-keyword: ${palette.keyword};
      //                   --sh-comment: ${palette.comment};
      //                   --sh-jsxliterals: ${palette.jsxliterals};
      //                 }
      //                 `}`}
      //             </style>
      //             <code
      //               ref={codeRef}
      //               className={cn("mr-2 font-light editor", className)}
      //             />
      //           </pre>
      //         </section>
      //       </div>
      //     </ScrollSyncPane>

      //     <ScrollSyncPane>
      //       <div className="overflow-y-auto overflow-x-hidden scrollbar-hidden absolute top-0 left-0 w-full">
      //         <section style={{ height: 300 }} className="w-full">
      //           <textarea
      //             ref={textareaRef}
      //             className={cn(
      //               " absolute top-0 left-0 w-[calc(100%-33px)] resize-none font-light scrollbar-hidden bg-transparent text-clip  focus:outline-none selection:text-select selection:bg-select caret-sh-keyword ml-[33px]",
      //               false ? "text-transparent" : "text-white/10",
      //               // "bg-slate-500",
      //               className
      //             )}
      //             value={text}
      //             onChange={onInput}
      //           ></textarea>
      //         </section>
      //       </div>
      //     </ScrollSyncPane>
      //   </div>
      // </ScrollSync>
    );
  }
);

TerminalConsole.displayName = "TerminalConsole";

export default TerminalConsole;
