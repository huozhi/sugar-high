import ShuffleCard, { ListOrderItem } from "@/components/ui/shuffle-card";
import { cn } from "@/lib/utils";
import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { Preset, usePalette } from "./console-demo/palette/context";
import { highlight } from "sugar-high";
import { ConsoleTerminalDebugProvider } from "./console-demo/debug/context";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import useMeasure from "react-use-measure";
import { Button } from "@/components/ui/button";

const EXAMPLE_PAIRS = [
  {
    title: "install.js",
    code: `\
// npm i -S sugar-high

import { highlight } from 'sugar-high'

const html = highlight(code)

document.querySelector('pre > code').innerHTML = html
  `,
  },
  {
    title: "app.jsx",
    code: `\
const element = (
  <>
    <Food
      season={{
        sault: <p a={[{}]} />
      }}>
    </Food>
    {/* jsx comment */}
    <h1 className="title" data-title="true">
      Read{' '}
      <Link href="/posts/first-post">
        <a>this page! - {Date.now()}</a>
      </Link>
    </h1>
  </>
)
  `,
  },
  {
    title: "hello.js",
    code: `\
const nums = [
  1000_000_000, 1.2e3, 0x1f, .14, 1n
].filter(Boolean)

function* foo(index) {
  do {
    yield index++;
    return void 0
  } while (index < 2)
}
  `,
  },
  {
    title: "klass.js",
    code: `\
/**
 * @param {string} names
 * @return {Promise<string[]>}
 */
async function notify(names) {
  const tags = []
  for (let i = 0; i < names.length; i++) {
    tags.push('@' + names[i])
  }
  await ping(tags)
}

class SuperArray extends Array {
  static core = Object.create(null)

  constructor(...args) { super(...args); }

  bump(value) {
    return this.map(
      x => x == undefined ? x + 1 : 0
    ).concat(value)
  }
}
  `,
  },
  {
    title: "regex.js",
    code: `\
export const test = (str) => /^\\/[0-5]\\/$/g.test(str)

// This is a super lightweight javascript syntax highlighter npm package

// This is a inline comment / <- a slash
/// <reference path="..." /> // reference comment
/* This is another comment */ alert('good') // <- alerts

// Invalid calculation: regex and numbers
const _in = 123 - /555/ + 444;
const _iu = /* evaluate */ (19) / 234 + 56 / 7;
  `,
  },
];

const ShuffleConsolePreviews = () => {
  const dragProgress = useMotionValue(0);
  const initialOrder = Array.from({ length: EXAMPLE_PAIRS.length }, (_, i) =>
    i.toString()
  );
  const [order, setOrder] = useState<string[]>(initialOrder);
  const { selectedPalette } = usePalette();
  const dimensions = { height: 400, width: 500 };

  const handleDragEnd = () => {
    const x = dragProgress.get();
    if (x <= -50) {
      const orderCopy = [...order];
      orderCopy.unshift(orderCopy.pop() as ListOrderItem);
      setOrder(orderCopy);
    }
  };

  useEffect(() => {
    const FIVE_SECONDS = 5000;

    // Automatically shuffle the list every 5 seconds, so long as it isn't being dragged
    const intervalRef = setInterval(() => {
      const x = dragProgress.get();
      if (x === 0) {
        setOrder((pv) => {
          const orderCopy = [...pv];
          orderCopy.unshift(orderCopy.pop() as ListOrderItem);
          return orderCopy;
        });
      }
    }, FIVE_SECONDS);

    return () => clearInterval(intervalRef);
  }, []);

  return (
    <div className="w-full">
      <div className=" place-content-center px-8 py-24 text-slate-50 w-full overflow-visible hidden lg:grid">
        <motion.div
          whileTap={{ scale: 0.985 }}
          className="relative"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            translateX: "-" + EXAMPLE_PAIRS.length * 50 + "px",
          }}
        >
          {EXAMPLE_PAIRS.map(({ title, code }, i) => {
            return (
              <ConsoleTerminalDebugProvider key={i}>
                <ShuffleCard
                  handleDragEnd={handleDragEnd}
                  dragProgress={dragProgress}
                  position={parseInt(order[i], 10)}
                  totalCards={EXAMPLE_PAIRS.length}
                  dimensions={dimensions}
                >
                  <TerminalPreview
                    title={title}
                    code={code}
                    selectedPalette={selectedPalette}
                  />
                </ShuffleCard>
              </ConsoleTerminalDebugProvider>
            );
          })}
        </motion.div>
      </div>
      <Carousel
        selectedPalette={selectedPalette}
        className="block lg:hidden mt-10"
      />
      <div className="grid grid-cols-1 gap-4"></div>
    </div>
  );
};

const Carousel = ({
  selectedPalette,
  className,
}: {
  selectedPalette: Preset;
  className?: string;
}) => {
  const MARGIN = 20;

  const [ref, { width }] = useMeasure();
  const [offset, setOffset] = useState(0);
  const [cardWidths, setCardWidths] = useState<number[]>(
    Array(EXAMPLE_PAIRS.length).fill(0)
  );

  const totalWidth = cardWidths.reduce((acc, curr) => acc + curr + MARGIN, 0);
  const CAN_SHIFT_LEFT = offset < 0;
  const CAN_SHIFT_RIGHT = Math.abs(offset) < totalWidth - width;

  const shiftLeft = () => {
    if (!CAN_SHIFT_LEFT) return;
    const shiftAmount = cardWidths[0] + MARGIN; // Adjust logic as needed
    setOffset((pv) => (pv += shiftAmount));
  };

  const shiftRight = () => {
    if (!CAN_SHIFT_RIGHT) return;
    const shiftAmount = cardWidths[0] + MARGIN; // Adjust logic as needed
    setOffset((pv) => (pv -= shiftAmount));
  };
  return (
    <section
      className={cn("py-8 w-[99vw] overflow-x-hidden", className)}
      ref={ref}
    >
      <div className="relative overflow-hidden p-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <h3 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-sh-identifier to-gray-500 py-2 md:py-4 cursor-pointer">
              Sugar High Showcase
            </h3>

            <div className="flex items-center gap-2 mx-4">
              <Button
                variant={"outline"}
                disabled={!CAN_SHIFT_LEFT}
                onClick={shiftLeft}
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                variant={"outline"}
                disabled={!CAN_SHIFT_RIGHT}
                onClick={shiftRight}
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
          <motion.div
            animate={{ x: offset }}
            transition={{ ease: "easeInOut" }}
            className="flex gap-4"
          >
            {EXAMPLE_PAIRS.map(({ title, code }, i) => (
              <div
                className="select-none space-y-6 rounded-2xl border shadow-xl backdrop-blur-md"
                key={i}
                ref={(el) => {
                  if (el) {
                    const newWidth = el.offsetWidth;
                    if (newWidth !== cardWidths[i]) {
                      setCardWidths((prev) => {
                        const newWidths = [...prev];
                        newWidths[i] = newWidth;
                        return newWidths;
                      });
                    }
                  }
                }}
              >
                <TerminalPreview
                  title={title}
                  code={code}
                  selectedPalette={selectedPalette}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const TerminalPreview = ({
  title,
  code,
  selectedPalette,
}: {
  title: string;
  code: string;
  selectedPalette: Preset;
}) => {
  const highlighted = highlight(code);
  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center px-4 justify-between">
          <div className="flex gap-2 hover:opacity-75 transition-opacity duration-500 cursor-pointer">
            <div className="w-3 h-3 rounded-full border bg-red-500" />
            <div className="w-3 h-3 rounded-full border bg-yellow-500" />
            <div className="w-3 h-3 rounded-full border bg-green-500" />
          </div>
          <Badge variant="outline" className="gap-1 py-1">
            {title}
          </Badge>
        </div>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="grid gap-4 px-4">
          <pre className=" h-fit w-full rounded-md text-left relative">
            <style>
              {`
                        ${`
                        .editor {
                          --sh-class: ${selectedPalette.palette.class};
                          --sh-identifier: ${selectedPalette.palette.identifier};
                          --sh-sign: ${selectedPalette.palette.sign};
                          --sh-string: ${selectedPalette.palette.string};
                          --sh-keyword: ${selectedPalette.palette.keyword};
                          --sh-comment: ${selectedPalette.palette.comment};
                          --sh-jsxliterals: ${selectedPalette.palette.jsxliterals};
                        }
                        `}`}
            </style>
            <code
              className="mr-2 font-light editor"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </pre>
        </div>
      </ScrollArea>
    </>
  );
};

export default ShuffleConsolePreviews;
