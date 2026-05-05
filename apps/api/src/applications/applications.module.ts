import { Module } from '@nestjs/common'
import { ApplicationsController } from './applications.controller'
import { ApplicationsService } from './applications.service'
import { AuditService } from '../common/audit.service'

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService, AuditService],
})
export class ApplicationsModule {}
