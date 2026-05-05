import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  log(params: {
    userId?: string
    entityType: string
    entityId: string
    action: string
    metadata?: Record<string, string | number | boolean | null | undefined>
    ipAddress?: string
  }) {
    return this.prisma.auditLog.create({
      data: {
        user_id: params.userId,
        entity_type: params.entityType,
        entity_id: params.entityId,
        action: params.action,
        metadata: params.metadata as object | undefined,
        ip_address: params.ipAddress,
      },
    })
  }
}
