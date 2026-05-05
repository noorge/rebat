import { Module } from '@nestjs/common'
import { WalletController } from './wallet.controller'
import { WalletService } from './wallet.service'
import { EncryptionService } from '../common/encryption.service'
import { AuditService } from '../common/audit.service'

@Module({
  controllers: [WalletController],
  providers: [WalletService, EncryptionService, AuditService],
})
export class WalletModule {}
