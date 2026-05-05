import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common'
import { KycService } from './kyc.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import type { AuthRequest } from '../common/types'

@Controller('kyc')
@UseGuards(JwtAuthGuard)
export class KycController {
  constructor(private kyc: KycService) {}

  @Get('status')
  getStatus(@Request() req: AuthRequest) {
    return this.kyc.getStatus(req.user.id)
  }

  @Post('submit')
  submit(@Request() req: AuthRequest) {
    return this.kyc.submitToAbsher(req.user.id, req.ip)
  }
}
