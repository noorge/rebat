import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) {}

  async getOpportunities(sector?: string, risk?: string) {
    return this.prisma.opportunity.findMany({
      where: {
        status: 'ACTIVE',
        ...(sector && { sector }),
        ...(risk && { risk_level: risk as any }),
      },
      include: { score: true },
      orderBy: { created_at: 'desc' },
    })
  }

  async getOpportunity(id: string) {
    return this.prisma.opportunity.findUnique({
      where: { id },
      include: { score: true },
    })
  }

  async getSectors() {
    const opps = await this.prisma.opportunity.findMany({
      where: { status: 'ACTIVE' },
      select: { sector: true },
      distinct: ['sector'],
    })
    return opps.map((o) => o.sector)
  }
}
