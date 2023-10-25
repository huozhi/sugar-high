import {
  MotionValue,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { useState } from "react";

export type ListOrderItem = "front" | "middle" | "back";

interface CardProps {
  handleDragEnd: Function;
  dragProgress: MotionValue<number>;
  position: number;
  totalCards: number;
  dimensions?: { height: number; width: number };
  children: React.ReactNode;
}

const ShuffleCard = ({
  handleDragEnd,
  dragProgress,
  position,
  dimensions = { height: 450, width: 350 },
  totalCards,
  children,
}: CardProps) => {
  const [dragging, setDragging] = useState(false);

  const dragX = useMotionValue(0);

  useMotionValueEvent(dragX, "change", (latest) => {
    // When component first mounts, dragX will be a percentage
    // due to us setting the initial X value in the animate prop.
    if (typeof latest === "number" && dragging) {
      dragProgress.set(latest);
    } else {
      // Default back to 0 so that setInterval can continue
      dragProgress.set(0);
    }
  });

  const onDragStart = () => setDragging(true);

  const onDragEnd = () => {
    setDragging(false);
    handleDragEnd();
  };

  const x = `${(position / (totalCards - 1)) * 100}%`;
  const rotateZ = `${(position - (totalCards - 1) / 2) * 3}deg`;
  const zIndex = `${totalCards - 1 - position}`;

  const draggable = position === 0;

  return (
    <motion.div
      style={{
        zIndex,
        x: dragX,
        height: dimensions.height,
        width: dimensions.width,
      }}
      animate={{ rotate: rotateZ, x }}
      drag
      dragElastic={0.35}
      dragListener={draggable}
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      transition={{
        duration: 0.35,
      }}
      className={`absolute left-0 top-0 select-none space-y-6 rounded-2xl border shadow-xl backdrop-blur-md ${
        draggable ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      {children}
    </motion.div>
  );
};

export default ShuffleCard;
