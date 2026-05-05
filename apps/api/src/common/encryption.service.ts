import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-cbc'
  private readonly key: Buffer

  constructor() {
    const raw = process.env.ENCRYPTION_KEY || 'fallback-key-32-chars-for-dev!!'
    this.key = Buffer.from(raw.padEnd(32).slice(0, 32))
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv)
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`
  }

  decrypt(payload: string): string {
    const [ivHex, encHex] = payload.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv)
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encHex, 'hex')), decipher.final()])
    return decrypted.toString('utf8')
  }

  hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex')
  }
}
