import { Module } from '@nestjs/common'
import { KycController } from './kyc.controller'
import { KycService } from './kyc.service'
import { AuditService } from '../common/audit.service'

@Module({
  controllers: [KycController],
  providers: [KycService, AuditService],
})
export class KycModule {}
