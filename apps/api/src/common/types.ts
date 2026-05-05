export interface AuthRequest {
  user: { id: string; email: string; role: string }
  ip: string
}
