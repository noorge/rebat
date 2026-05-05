export type Role = 'INVESTOR' | 'ADMIN'
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED'
export type KycStatus = 'PENDING' | 'SUBMITTED_TO_ABSHER' | 'APPROVED' | 'REJECTED'
export type DocType = 'PASSPORT' | 'COMMERCIAL_REG' | 'FINANCIAL_STMT' | 'BANK_STMT'
export type DocStatus = 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED' | 'EXPIRED'
export type AppStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type OppStatus = 'ACTIVE' | 'CLOSED' | 'DRAFT'

export interface JwtPayload {
  sub: string
  email: string
  role: Role
}

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
}
