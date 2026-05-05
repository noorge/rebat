'use client'

export function getToken(): string | null { return 'mock-token' }
export function setToken(_token: string) {}
export function getRole(): string | null { return 'INVESTOR' }
export function setAuth(_token: string, _role: string) {}
export function clearAuth() {}
export function isAuthenticated(): boolean { return true }
