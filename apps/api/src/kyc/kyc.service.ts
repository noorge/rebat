import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuditService } from '../common/audit.service'

@Injectable()
export class KycService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async getStatus(userId: string) {
    const investor = await this.prisma.investor.findUnique({
      where: { user_id: userId },
      include: { documents: true },
    })
    if (!investor) throw new NotFoundException()
    return {
      kyc_status: investor.kyc_status,
      absher_ref: investor.absher_ref,
      approved_at: investor.approved_at,
      documents: investor.documents,
    }
  }

  async submitToAbsher(userId: string, ipAddress?: string) {
    const investor = await this.prisma.investor.findUnique({
      where: { user_id: userId },
      include: { documents: true },
    })
    if (!investor) throw new NotFoundException()
    if (investor.kyc_status === 'APPROVED') throw new BadRequestException('Already approved')
    if (investor.kyc_status === 'SUBMITTED_TO_ABSHER')
      throw new BadRequestException('Already submitted to Absher')

    const hasPassport = investor.documents.some((d) => d.type === 'PASSPORT')
    if (!hasPassport) throw new BadRequestException('Passport document is required')

    const absherRef = `ABS-${Date.now()}-${investor.id.slice(0, 6).toUpperCase()}`

    await this.prisma.investor.update({
      where: { id: investor.id },
      data: { kyc_status: 'SUBMITTED_TO_ABSHER', absher_ref: absherRef },
    })

    await this.prisma.document.updateMany({
      where: { investor_id: investor.id },
      data: { status: 'SUBMITTED' },
    })

    await this.audit.log({
      userId,
      entityType: 'Investor',
      entityId: investor.id,
      action: 'KYC_SUBMITTED_TO_ABSHER',
      metadata: { absher_ref: absherRef },
      ipAddress,
    })

    return { message: 'Documents submitted to Absher successfully', absher_ref: absherRef }
  }
}
