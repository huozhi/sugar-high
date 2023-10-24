import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce(
  this: any,
  func: (this: any, ...args: any[]) => void,
  timeout: number = 200
): (...args: any[]) => void {
  let timer: NodeJS.Timeout | null = null;
  return function (this: any, ...args: any[]): void {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
