import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'
import { EncryptionService } from '../common/encryption.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private encryption: EncryptionService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (existing) throw new ConflictException('Email already registered')

    const password_hash = await bcrypt.hash(dto.password, 12)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password_hash,
        status: 'ACTIVE',
        investor: {
          create: {
            full_name: dto.full_name,
            nationality: dto.nationality,
            passport_number: this.encryption.encrypt(dto.passport_number),
            company_name: dto.company_name,
          },
        },
      },
      include: { investor: true },
    })

    return this.signTokens(user.id, user.email, user.role)
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(dto.password, user.password_hash)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    if (user.status === 'SUSPENDED') throw new UnauthorizedException('Account suspended')

    return this.signTokens(user.id, user.email, user.role)
  }

  private signTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role }
    const access_token = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h' as const,
    })
    const refresh_token = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d' as const,
    })
    return { access_token, refresh_token, role }
  }

  async refresh(token: string) {
    try {
      const payload = this.jwt.verify(token, { secret: process.env.JWT_REFRESH_SECRET })
      return this.signTokens(payload.sub, payload.email, payload.role)
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
