import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common'
import { ApplicationsService } from './applications.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import type { AuthRequest } from '../common/types'

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private apps: ApplicationsService) {}

  @Post()
  create(@Request() req: AuthRequest, @Body('opportunity_id') opportunityId?: string) {
    return this.apps.create(req.user.id, opportunityId)
  }

  @Get()
  getAll(@Request() req: AuthRequest) {
    return this.apps.getAll(req.user.id)
  }

  @Get(':id/timeline')
  getTimeline(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.apps.getTimeline(req.user.id, id)
  }
}
