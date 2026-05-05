import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { AbsherModule } from '../absher/absher.module'
import { ScoringService } from '../scoring/scoring.service'

@Module({
  imports: [AbsherModule],
  controllers: [AdminController],
  providers: [AdminService, ScoringService],
})
export class AdminModule {}
