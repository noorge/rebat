import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { InvestorModule } from './investor/investor.module'
import { KycModule } from './kyc/kyc.module'
import { WalletModule } from './wallet/wallet.module'
import { ApplicationsModule } from './applications/applications.module'
import { MarketplaceModule } from './marketplace/marketplace.module'
import { ScoringModule } from './scoring/scoring.module'
import { AbsherModule } from './absher/absher.module'
import { AdminModule } from './admin/admin.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    AuthModule,
    InvestorModule,
    KycModule,
    WalletModule,
    ApplicationsModule,
    MarketplaceModule,
    ScoringModule,
    AbsherModule,
    AdminModule,
  ],
})
export class AppModule {}
