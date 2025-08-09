import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
}

export const slugify = (text: string) => {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}