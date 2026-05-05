import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { EncryptionService } from '../common/encryption.service'

@Injectable()
export class InvestorService {
  constructor(private prisma: PrismaService, private encryption: EncryptionService) {}

  async getProfile(userId: string) {
    const investor = await this.prisma.investor.findUnique({
      where: { user_id: userId },
      include: { user: { select: { email: true, role: true, status: true } } },
    })
    if (!investor) throw new NotFoundException('Investor not found')
    return { ...investor, passport_number: '***ENCRYPTED***' }
  }

  async getDashboard(userId: string) {
    const investor = await this.prisma.investor.findUnique({ where: { user_id: userId } })
    if (!investor) throw new NotFoundException()

    const [totalDocs, verifiedDocs, applications, recentLogs] = await Promise.all([
      this.prisma.document.count({ where: { investor_id: investor.id } }),
      this.prisma.document.count({ where: { investor_id: investor.id, status: 'VERIFIED' } }),
      this.prisma.application.findMany({
        where: { investor_id: investor.id },
        orderBy: { created_at: 'desc' },
        take: 5,
        include: { opportunity: { select: { title_en: true, title_ar: true, sector: true } } },
      }),
      this.prisma.auditLog.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        take: 10,
      }),
    ])

    return {
      kyc_status: investor.kyc_status,
      approved_at: investor.approved_at,
      total_documents: totalDocs,
      verified_documents: verifiedDocs,
      recent_applications: applications,
      recent_activity: recentLogs,
    }
  }

  async updateProfile(userId: string, data: { full_name?: string; company_name?: string }) {
    const investor = await this.prisma.investor.findUnique({ where: { user_id: userId } })
    if (!investor) throw new NotFoundException()
    return this.prisma.investor.update({ where: { id: investor.id }, data })
  }
}
