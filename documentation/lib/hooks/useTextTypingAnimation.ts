import { useEffect, useState } from "react";

type UseTextTypingAnimationProps = {
  targetText: string;
  delay: number;
  onReady: () => void;
};

export const useTextTypingAnimation = ({
  targetText,
  delay,
  onReady,
}: UseTextTypingAnimationProps) => {
  const [text, setText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    console.log("useEffect triggered");

    const typeText = (index: number) => {
      if (index === targetText.length) {
        setIsTyping(false);
        onReady();
        return;
      }

      setText(targetText.substring(0, index + 1));
      timeoutId = setTimeout(
        () => typeText(index + 1),
        delay / targetText.length
      );
    };

    typeText(0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [targetText, delay]);

  return { text, isTyping, setText };
};
