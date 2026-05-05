import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuditService } from '../common/audit.service'

@Injectable()
export class AbsherService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async handleWebhook(secret: string, body: { ref: string; status: 'approved' | 'rejected'; reason?: string }) {
    if (secret !== process.env.ABSHER_WEBHOOK_SECRET)
      throw new UnauthorizedException('Invalid webhook secret')

    const investor = await this.prisma.investor.findFirst({ where: { absher_ref: body.ref } })
    if (!investor) throw new NotFoundException(`No investor with ref ${body.ref}`)

    const kycStatus = body.status === 'approved' ? 'APPROVED' : 'REJECTED'
    const docStatus = body.status === 'approved' ? 'VERIFIED' : 'REJECTED'

    await this.prisma.investor.update({
      where: { id: investor.id },
      data: {
        kyc_status: kycStatus,
        approved_at: body.status === 'approved' ? new Date() : undefined,
      },
    })

    await this.prisma.document.updateMany({
      where: { investor_id: investor.id, status: 'SUBMITTED' },
      data: { status: docStatus },
    })

    await this.audit.log({
      entityType: 'Investor',
      entityId: investor.id,
      action: `ABSHER_${kycStatus}`,
      metadata: { absher_ref: body.ref, reason: body.reason },
    })

    return { message: `Investor KYC ${kycStatus.toLowerCase()}` }
  }

  // Demo-only: simulate Absher calling back with approval
  async simulateApproval(investorId: string, status: 'approved' | 'rejected') {
    const investor = await this.prisma.investor.findUnique({ where: { id: investorId } })
    if (!investor || !investor.absher_ref) throw new NotFoundException()

    return this.handleWebhook(process.env.ABSHER_WEBHOOK_SECRET!, {
      ref: investor.absher_ref,
      status,
      reason: status === 'rejected' ? 'Document verification failed' : undefined,
    })
  }
}
