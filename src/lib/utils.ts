import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const appUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api`

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



