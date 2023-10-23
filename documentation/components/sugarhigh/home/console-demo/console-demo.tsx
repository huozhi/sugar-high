import React, { useEffect, useRef, useState, useCallback } from "react";
import { highlight, tokenize, SugarHigh, Token } from "sugar-high";
import { Editor } from "codice";

type Props = {
  className?: string;
};

type DebounceFunction = (...args: any[]) => void;

const defaultColorPlateColors = {
  class: "#8d85ff",
  identifier: "#354150",
  sign: "#8996a3",
  string: "#00a99a",
  keyword: "#f47067",
  comment: "#a19595",
  jsxliterals: "#bf7db6",
  break: "#ffffff",
  space: "#ffffff",
};

const defaultLiveCode = `export default function App() {
  return <p>hello world</p>
}`;

const debounce = (func: DebounceFunction, timeout = 200): DebounceFunction => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), timeout);
  };
};

const useTextTypingAnimation = (
  targetText: string,
  delay: number,
  onReady: () => void
) => {
  const [text, setText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const typeText = (index: number) => {
      if (index >= targetText.length) {
        setIsTyping(false);
        onReady();
        return;
      }
      setText(targetText.slice(0, index + 1));
      timeoutId = setTimeout(
        () => typeText(index + 1),
        delay / targetText.length
      );
    };
    typeText(0);
    return () => clearTimeout(timeoutId);
  }, [targetText, delay]);

  return { text, isTyping, setText };
};

const LiveConsole: React.FC<Props> = ({ className }) => {
  const editorRef = useRef<typeof Editor>(null);
  const [colorPlateColors, setColorPlateColors] = useState(
    defaultColorPlateColors
  );
  const isDebug = process.env.NODE_ENV === "development";

  const { text: liveCode, setText: setLiveCode } = useTextTypingAnimation(
    defaultLiveCode,
    1000,
    () => editorRef.current?.focus()
  );

  const [liveCodeTokens, setLiveCodeTokens] = useState<Token[]>([]);

  const debouncedTokenizeRef = useRef(
    debounce((code: string) => {
      setLiveCodeTokens(tokenize(code));
    }, 200)
  );
  return (
    <div className="pt-0 pb-10 px-2 live-editor-section">
      <style>{`
        ${`
        .live-editor-section {
          --sh-class: ${colorPlateColors.class};
          --sh-identifier: ${colorPlateColors.identifier};
          --sh-sign: ${colorPlateColors.sign};
          --sh-string: ${colorPlateColors.string};
          --sh-keyword: ${colorPlateColors.keyword};
          --sh-comment: ${colorPlateColors.comment};
          --sh-jsxliterals: ${colorPlateColors.jsxliterals};
        }
        `}`}</style>

      <div className="flex live-editor">
        <Editor
          ref={editorRef}
          className="codice-editor flex-1"
          highlight={highlight}
          value={defaultLiveCode}
          onChange={(newCode: React.SetStateAction<string>) => {
            setLiveCode(newCode);
            debouncedTokenizeRef.current(newCode);
          }}
        />
      </div>
    </div>
  );
};

export default LiveConsole;
