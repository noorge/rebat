import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuditService } from '../common/audit.service'

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async create(userId: string, opportunityId?: string) {
    const investor = await this.prisma.investor.findUnique({ where: { user_id: userId } })
    if (!investor) throw new NotFoundException()
    if (investor.kyc_status !== 'APPROVED')
      throw new ForbiddenException('KYC approval required before applying')

    const app = await this.prisma.application.create({
      data: {
        investor_id: investor.id,
        opportunity_id: opportunityId,
        status: 'SUBMITTED',
        submitted_at: new Date(),
        status_history: { create: { status: 'SUBMITTED', note: 'Application submitted' } },
      },
    })

    await this.audit.log({
      userId,
      entityType: 'Application',
      entityId: app.id,
      action: 'CREATED',
      metadata: { opportunity_id: opportunityId },
    })

    return app
  }

  async getAll(userId: string) {
    const investor = await this.prisma.investor.findUnique({ where: { user_id: userId } })
    if (!investor) throw new NotFoundException()
    return this.prisma.application.findMany({
      where: { investor_id: investor.id },
      include: { opportunity: { select: { title_en: true, title_ar: true, sector: true } } },
      orderBy: { created_at: 'desc' },
    })
  }

  async getTimeline(userId: string, appId: string) {
    const investor = await this.prisma.investor.findUnique({ where: { user_id: userId } })
    if (!investor) throw new NotFoundException()

    const app = await this.prisma.application.findUnique({
      where: { id: appId },
      include: {
        status_history: { orderBy: { created_at: 'asc' } },
        opportunity: true,
      },
    })
    if (!app || app.investor_id !== investor.id) throw new ForbiddenException()
    return app
  }
}
