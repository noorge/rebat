'use client'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('rebat_token')
}

export function setToken(token: string) {
  localStorage.setItem('rebat_token', token)
}

export function getRole(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('rebat_role')
}

export function setAuth(token: string, role: string) {
  localStorage.setItem('rebat_token', token)
  localStorage.setItem('rebat_role', role)
}

export function clearAuth() {
  localStorage.removeItem('rebat_token')
  localStorage.removeItem('rebat_role')
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
