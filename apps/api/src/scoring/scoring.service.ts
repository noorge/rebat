import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

const VISION_2030_PILLARS = [
  'economy_diversification', 'empowering_citizens', 'vibrant_society',
  'tourism', 'entertainment', 'technology', 'renewable_energy', 'manufacturing',
]

@Injectable()
export class ScoringService {
  constructor(private prisma: PrismaService) {}

  async getScore(opportunityId: string) {
    const score = await this.prisma.opportunityScore.findUnique({
      where: { opportunity_id: opportunityId },
    })
    if (!score) return this.calculate(opportunityId)
    return score
  }

  async calculate(opportunityId: string) {
    const opp = await this.prisma.opportunity.findUnique({ where: { id: opportunityId } })
    if (!opp) throw new NotFoundException('Opportunity not found')

    const roiRange = opp.expected_roi_max - opp.expected_roi_min
    const financial_score = Math.min(
      100,
      ((opp.expected_roi_min + opp.expected_roi_max) / 2) * 5 + roiRange * 2,
    )

    const riskMap = { LOW: 90, MEDIUM: 60, HIGH: 30 }
    const risk_score = riskMap[opp.risk_level]

    const matchedPillars = opp.vision_2030_pillars.filter((p) =>
      VISION_2030_PILLARS.includes(p),
    ).length
    const vision_score = Math.min(100, (matchedPillars / VISION_2030_PILLARS.length) * 100)

    const sdg_score = Math.min(100, (opp.sdg_goals.length / 17) * 100)

    const composite = Math.round(
      financial_score * 0.35 + risk_score * 0.25 + vision_score * 0.25 + sdg_score * 0.15,
    )

    return this.prisma.opportunityScore.upsert({
      where: { opportunity_id: opportunityId },
      create: {
        opportunity_id: opportunityId,
        financial_score: Math.round(financial_score),
        risk_score,
        vision_score: Math.round(vision_score),
        sdg_score: Math.round(sdg_score),
        composite,
      },
      update: {
        financial_score: Math.round(financial_score),
        risk_score,
        vision_score: Math.round(vision_score),
        sdg_score: Math.round(sdg_score),
        composite,
        calculated_at: new Date(),
      },
    })
  }
}
