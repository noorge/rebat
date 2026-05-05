import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { mockApiFetch } from './mock-api'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function apiFetch(path: string, options?: RequestInit & { token?: string }) {
  return mockApiFetch(path, { method: options?.method as string, body: options?.body as string })
}
