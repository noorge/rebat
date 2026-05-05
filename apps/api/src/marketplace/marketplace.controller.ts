import { Controller, Get, Param, Query } from '@nestjs/common'
import { MarketplaceService } from './marketplace.service'

@Controller('marketplace')
export class MarketplaceController {
  constructor(private marketplace: MarketplaceService) {}

  @Get('opportunities')
  getAll(@Query('sector') sector?: string, @Query('risk') risk?: string) {
    return this.marketplace.getOpportunities(sector, risk)
  }

  @Get('opportunities/:id')
  getOne(@Param('id') id: string) {
    return this.marketplace.getOpportunity(id)
  }

  @Get('sectors')
  getSectors() {
    return this.marketplace.getSectors()
  }
}
