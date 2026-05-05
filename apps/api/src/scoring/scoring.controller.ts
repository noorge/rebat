import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common'
import { ScoringService } from './scoring.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@Controller('scoring')
export class ScoringController {
  constructor(private scoring: ScoringService) {}

  @Get('opportunities/:id')
  getScore(@Param('id') id: string) {
    return this.scoring.getScore(id)
  }

  @Post('calculate/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  recalculate(@Param('id') id: string) {
    return this.scoring.calculate(id)
  }
}
