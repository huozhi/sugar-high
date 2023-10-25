import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const CTAArrow = ({
  text,
  className,
  textClassName,
  arrowColor = "#7D7BE5",
  duration = 1,
}: {
  text: string;
  className?: string;
  arrowColor?: string;
  textClassName?: string;
  duration?: number;
}) => (
  <div className={cn("absolute -right-[100px] top-2 sm:top-0", className)}>
    <motion.svg
      width="95"
      height="62"
      viewBox="0 0 95 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="scale-50 sm:scale-75"
      initial={{ scale: 0.7, rotate: 5 }}
      animate={{ scale: 0.75, rotate: 0 }}
      transition={{
        repeat: Infinity,
        repeatType: "mirror",
        duration: duration,
        ease: "easeOut",
      }}
    >
      <path
        d="M14.7705 15.8619C33.2146 15.2843 72.0772 22.1597 79.9754 54.2825"
        stroke={arrowColor}
        strokeWidth="3"
      />
      <path
        d="M17.7987 7.81217C18.0393 11.5987 16.4421 15.8467 15.5055 19.282C15.2179 20.3369 14.9203 21.3791 14.5871 22.4078C14.4728 22.7608 14.074 22.8153 13.9187 23.136C13.5641 23.8683 12.0906 22.7958 11.7114 22.5416C8.63713 20.4812 5.49156 18.3863 2.58664 15.9321C1.05261 14.6361 2.32549 14.1125 3.42136 13.0646C4.37585 12.152 5.13317 11.3811 6.22467 10.7447C8.97946 9.13838 12.7454 8.32946 15.8379 8.01289"
        stroke={arrowColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </motion.svg>
    <span
      className={cn(
        "block text-xs w-fit text-white shadow px-1.5 py-0.5 rounded -mt-1 ml-8 -rotate-2 font-light italic",
        textClassName
      )}
      style={{ backgroundColor: arrowColor }}
    >
      {text}
    </span>
  </div>
);

export default CTAArrow;
