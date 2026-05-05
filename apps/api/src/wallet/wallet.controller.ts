import {
  Controller, Get, Post, Param, Body, UseGuards,
  Request, UseInterceptors, UploadedFile, Res,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Response } from 'express'
import { WalletService } from './wallet.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import type { AuthRequest } from '../common/types'
import * as fs from 'fs'

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private wallet: WalletService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Request() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
  ) {
    return this.wallet.uploadDocument(req.user.id, file, type, req.ip)
  }

  @Get('documents')
  getDocuments(@Request() req: AuthRequest) {
    return this.wallet.getDocuments(req.user.id)
  }

  @Get(':id/download')
  getDownloadUrl(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.wallet.getDownloadUrl(req.user.id, id, req.ip)
  }

  @Get(':id/file')
  async serveFile(@Request() req: AuthRequest, @Param('id') id: string, @Res() res: Response) {
    const filePath = await this.wallet.serveFile(req.user.id, id)
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' })
    res.sendFile(filePath)
  }

  @Post(':id/reuse')
  reuseDocument(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.wallet.reuseDocument(req.user.id, id)
  }
}
