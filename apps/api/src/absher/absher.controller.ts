import { Controller, Post, Body, Headers } from '@nestjs/common'
import { AbsherService } from './absher.service'

@Controller('absher')
export class AbsherController {
  constructor(private absher: AbsherService) {}

  @Post('webhook')
  webhook(
    @Headers('x-absher-secret') secret: string,
    @Body() body: { ref: string; status: 'approved' | 'rejected'; reason?: string },
  ) {
    return this.absher.handleWebhook(secret, body)
  }
}
