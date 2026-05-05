import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { EncryptionService } from '../common/encryption.service'
import { AuditService } from '../common/audit.service'
import * as fs from 'fs'
import * as path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    private encryption: EncryptionService,
    private audit: AuditService,
  ) {}

  async uploadDocument(
    userId: string,
    file: Express.Multer.File,
    docType: string,
    ipAddress?: string,
  ) {
    const investor = await this.prisma.investor.findUnique({ where: { user_id: userId } })
    if (!investor) throw new NotFoundException()

    const fileHash = this.encryption.hash(file.buffer.toString('base64'))
    const fileKey = `${investor.id}/${Date.now()}-${file.originalname}`
    const filePath = path.join(UPLOAD_DIR, fileKey.replace('/', '_'))

    fs.writeFileSync(filePath, file.buffer)

    const doc = await this.prisma.document.create({
      data: {
        investor_id: investor.id,
        type: docType as any,
        file_key: fileKey,
        file_hash: fileHash,
      },
    })

    await this.prisma.walletItem.upsert({
      where: { investor_id_document_id: { investor_id: investor.id, document_id: doc.id } },
      create: { investor_id: investor.id, document_id: doc.id },
      update: {},
    })

    await this.audit.log({
      userId,
      entityType: 'Document',
      entityId: doc.id,
      action: 'UPLOADED',
      metadata: { type: docType, filename: file.originalname },
      ipAddress,
    })

    return doc
  }

  async getDocuments(userId: string) {
    const investor = await this.prisma.investor.findUnique({ where: { user_id: userId } })
    if (!investor) throw new NotFoundException()
    return this.prisma.document.findMany({
      where: { investor_id: investor.id },
      orderBy: { uploaded_at: 'desc' },
    })
  }

  async getDownloadUrl(userId: string, docId: string, ipAddress?: string) {
    const investor = await this.prisma.investor.findUnique({ where: { user_id: userId } })
    if (!investor) throw new NotFoundException()

    const doc = await this.prisma.document.findUnique({ where: { id: docId } })
    if (!doc || doc.investor_id !== investor.id) throw new ForbiddenException()

    await this.audit.log({
      userId,
      entityType: 'Document',
      entityId: docId,
      action: 'VIEWED',
      ipAddress,
    })

    return { download_url: `/api/wallet/${docId}/file`, expires_in: 900 }
  }

  async reuseDocument(userId: string, docId: string) {
    const investor = await this.prisma.investor.findUnique({ where: { user_id: userId } })
    if (!investor) throw new NotFoundException()

    const doc = await this.prisma.document.findUnique({ where: { id: docId } })
    if (!doc || doc.investor_id !== investor.id) throw new ForbiddenException()

    await this.prisma.walletItem.update({
      where: { investor_id_document_id: { investor_id: investor.id, document_id: docId } },
      data: { reuse_count: { increment: 1 }, last_used: new Date() },
    })

    return { message: 'Document marked for reuse', document_id: docId }
  }

  async serveFile(userId: string, docId: string) {
    const investor = await this.prisma.investor.findUnique({ where: { user_id: userId } })
    if (!investor) throw new NotFoundException()
    const doc = await this.prisma.document.findUnique({ where: { id: docId } })
    if (!doc || doc.investor_id !== investor.id) throw new ForbiddenException()
    const filePath = path.join(UPLOAD_DIR, doc.file_key.replace('/', '_'))
    return filePath
  }
}
