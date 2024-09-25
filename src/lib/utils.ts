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

/**
 * Calculates the estimated reading time for a given HTML string.
 * @param html - The HTML content to calculate reading time for.
 * @returns A string indicating the estimated reading time.
 */
export function readingTime(html: string): string {
  const textOnly = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = textOnly.split(" ").filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${readingTimeMinutes} min read`;
}

/**
 * Formats a date range into a string.
 * @param startDate - The start date of the range.
 * @param endDate - The end date of the range, or a string like "Present".
 * @returns A formatted date range string.
 */
export function dateRange(startDate: Date, endDate?: Date | string): string {
  const startMonth = startDate.toLocaleString("default", { month: "short" });
  const startYear = startDate.getFullYear().toString();

  let endMonth = "";
  let endYear = "";

  if (endDate) {
    if (typeof endDate === "string") {
      endYear = endDate;
    } else {
      endMonth = endDate.toLocaleString("default", { month: "short" });
      endYear = endDate.getFullYear().toString();
    }
  }

  const start = `${startMonth} ${startYear}`;
  const end = endYear ? `${endMonth ? endMonth + " " : ""}${endYear}` : "Present";

  return `${start} - ${end}`;
}
