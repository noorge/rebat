import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function apiFetch(path: string, options?: RequestInit & { token?: string }) {
  const { token, ...rest } = options || {}
  const res = await fetch(`${API}/api${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(rest.headers || {}),
    },
  })
  if (res.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('rebat_token')
    localStorage.removeItem('rebat_role')
    window.location.href = '/auth/login'
    return
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(err.message || 'Request failed')
  }
  return res.json()
}
