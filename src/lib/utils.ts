import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and merges Tailwind classes using twMerge.
 * @param inputs - Class names to be combined.
 * @returns A single string of combined class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

/**
 * Formats a Date object into a localized string.
 * @param date - The Date object to format.
 * @returns A formatted date string.
 */
export function formatDate(date: Date): string {
  return Intl.DateTimeFormat("en-GB", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

