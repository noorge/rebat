import { Module } from '@nestjs/common'
import { AbsherController } from './absher.controller'
import { AbsherService } from './absher.service'
import { AuditService } from '../common/audit.service'

@Module({
  controllers: [AbsherController],
  providers: [AbsherService, AuditService],
  exports: [AbsherService],
})
export class AbsherModule {}
