import React, { useEffect } from "react";
import { usePalette } from "../home/console-demo/palette/context";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = { className?: string; background?: string };

const Glow = ({ className, background }: Props) => {
  const { selectedPalette } = usePalette();
  return (
    <motion.div
      className={cn(
        "absolute -top-[350px] left-[50%] z-0 h-[500px] w-full md:w-[600px] -translate-x-[50%] rounded-full blur-[200px] opacity-50 transition-all duration-500",
        className
      )}
      animate={{
        background: background
          ? background
          : `linear-gradient(to right, ${selectedPalette.palette.class} 20%, ${selectedPalette.palette.keyword} 20%)`,
      }}
    />
  );
};

export default Glow;
