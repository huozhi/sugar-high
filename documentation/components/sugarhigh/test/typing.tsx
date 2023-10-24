import React from "react";
import { useTextTypingAnimation } from "@/lib/hooks";

const TestComponent = () => {
  const { text, isTyping, setText } = useTextTypingAnimation({
    targetText: "Hello World",
    delay: 1000,
    onReady: () => console.log("Typing done!"),
  });

  return (
    <div>
      <p>{text}</p>
      {isTyping && <p>Typing...</p>}
    </div>
  );
};

export default TestComponent;
