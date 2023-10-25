"use client";
import Glow from "@/components/sugarhigh/background/glow";
import ConsoleDemo from "@/components/sugarhigh/home/console-demo";
import ShuffleConsolePreviews from "@/components/sugarhigh/home/console-previews";
import { PaletteProvider } from "@/components/sugarhigh/home/console-demo/palette/context";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between w-full">
      <PaletteProvider>
        <div className="flex flex-col justify-center space-y-8 text-center w-full">
          <Glow />
          <div className="space-y-2 mt-16">
            <h1
              className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 py-2 md:py-4 cursor-pointer"
              onClick={() =>
                window.open(
                  "https://www.npmjs.com/package/sugar-high",
                  "_blank"
                )
              }
            >
              Sugar High
            </h1>
            <p className="max-w-[600px] text-zinc-200 dark:text-zinc-100 mx-auto text-sm sm:text-md">
              Super lightweight syntax highlighter for JSX,
              <b> 1KB</b> after minified and gizpped.
            </p>
          </div>

          <div className="grid place-items-center">
            <ConsoleDemo />
            <ShuffleConsolePreviews />
          </div>
        </div>
      </PaletteProvider>
    </main>
  );
}