import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const imgUrl =
  "https://repository-images.githubusercontent.com/453236442/aa0db684-bad3-4cd3-a420-f4e53b8c6757";

export const metadata: Metadata = {
  metadataBase: new URL("https://sugar-high.vercel.app"),
  title: "Sugar High",
  authors: [{ name: "@huozhi" }, { name: "@zerofcs" }],
  description:
    "Super lightweight JSX syntax highlighter, around 1KB after minified and gzipped",
  twitter: {
    card: "summary_large_image",
    images: imgUrl,
    title: "Sugar High",
    description:
      "Super lightweight JSX syntax highlighter, around 1KB after minified and gzipped",
  },
  openGraph: {
    images: imgUrl,
    title: "Sugar High",
    description:
      "Super lightweight JSX syntax highlighter, around 1KB after minified and gzipped",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="grid grid-cols-1">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            test
          </header>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
