import React, { useEffect } from "react";
import { usePalette } from "../home/console-demo/palette/context";

type Props = {};

const Glow = (props: Props) => {
  const { selectedPalette } = usePalette();
  return (
    <span
      className="absolute -top-[350px] left-[50%] z-0 h-[500px] w-[600px] -translate-x-[50%] rounded-full blur-[200px] opacity-50 transition-all duration-500"
      style={{
        background: `linear-gradient(to right, ${selectedPalette.palette.class} 20%, ${selectedPalette.palette.keyword} 20%)`,
      }}
    />
  );
};

export default Glow;
