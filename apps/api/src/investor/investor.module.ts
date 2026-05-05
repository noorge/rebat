import { Module } from '@nestjs/common'
import { InvestorController } from './investor.controller'
import { InvestorService } from './investor.service'
import { EncryptionService } from '../common/encryption.service'

@Module({
  controllers: [InvestorController],
  providers: [InvestorService, EncryptionService],
})
export class InvestorModule {}
