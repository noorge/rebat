import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AbsherService } from '../absher/absher.service'
import { ScoringService } from '../scoring/scoring.service'

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private absher: AbsherService,
    private scoring: ScoringService,
  ) {}

  async getInvestors(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [investors, total] = await Promise.all([
      this.prisma.investor.findMany({
        skip,
        take: limit,
        include: { user: { select: { email: true, status: true } } },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.investor.count(),
    ])
    return { data: investors, total, page, limit }
  }

  async simulateAbsherApproval(investorId: string, status: 'approved' | 'rejected') {
    return this.absher.simulateApproval(investorId, status)
  }

  async getAuditLogs(page = 1, limit = 50) {
    const skip = (page - 1) * limit
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: { user: { select: { email: true } } },
      }),
      this.prisma.auditLog.count(),
    ])
    return { data: logs, total, page, limit }
  }

  async createOpportunity(data: any) {
    const opp = await this.prisma.opportunity.create({ data })
    await this.scoring.calculate(opp.id)
    return opp
  }

  async getOpportunities() {
    return this.prisma.opportunity.findMany({ include: { score: true }, orderBy: { created_at: 'desc' } })
  }
}
