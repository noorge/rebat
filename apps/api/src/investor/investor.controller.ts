import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common'
import { InvestorService } from './investor.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import type { AuthRequest } from '../common/types'

@Controller('investor')
@UseGuards(JwtAuthGuard)
export class InvestorController {
  constructor(private investor: InvestorService) {}

  @Get('profile')
  getProfile(@Request() req: AuthRequest) {
    return this.investor.getProfile(req.user.id)
  }

  @Get('dashboard')
  getDashboard(@Request() req: AuthRequest) {
    return this.investor.getDashboard(req.user.id)
  }

  @Put('profile')
  updateProfile(@Request() req: AuthRequest, @Body() body: { full_name?: string; company_name?: string }) {
    return this.investor.updateProfile(req.user.id, body)
  }
}
