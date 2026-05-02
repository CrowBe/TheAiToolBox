import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLogoUrl(tool: { logoUrl?: string; websiteUrl: string }) {
  if (tool.logoUrl) return tool.logoUrl;
  try {
    const url = new URL(tool.websiteUrl);
    return `https://logo.clearbit.com/${url.hostname}`;
  } catch (e) {
    return "";
  }
}
