import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common'
import { AdminService } from './admin.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('investors')
  getInvestors(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.admin.getInvestors(+page, +limit)
  }

  @Post('absher/simulate/:investorId')
  simulateAbsher(
    @Param('investorId') investorId: string,
    @Body('status') status: 'approved' | 'rejected',
  ) {
    return this.admin.simulateAbsherApproval(investorId, status)
  }

  @Get('audit-logs')
  getAuditLogs(@Query('page') page = '1', @Query('limit') limit = '50') {
    return this.admin.getAuditLogs(+page, +limit)
  }

  @Post('marketplace/opportunities')
  createOpportunity(@Body() body: any) {
    return this.admin.createOpportunity(body)
  }

  @Get('marketplace/opportunities')
  getOpportunities() {
    return this.admin.getOpportunities()
  }
}
