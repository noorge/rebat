import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const adminHash = await bcrypt.hash('Admin@12345', 12)
  await prisma.user.upsert({
    where: { email: 'admin@rebat.sa' },
    update: {},
    create: {
      email: 'admin@rebat.sa',
      password_hash: adminHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })

  // Sample opportunities
  const opportunities = [
    {
      title_en: 'Red Sea Tourism Resort Development',
      title_ar: 'تطوير منتجع البحر الأحمر السياحي',
      sector: 'Tourism',
      description_en: 'Luxury eco-resort development on the Red Sea coast, part of NEOM and Vision 2030 tourism expansion.',
      description_ar: 'تطوير منتجع فاخر صديق للبيئة على ساحل البحر الأحمر، ضمن مشروع نيوم ورؤية 2030 السياحية.',
      min_investment: 5000000,
      max_investment: 50000000,
      expected_roi_min: 12,
      expected_roi_max: 18,
      risk_level: 'MEDIUM' as const,
      sdg_goals: [8, 9, 11, 14, 17],
      vision_2030_pillars: ['tourism', 'economy_diversification', 'vibrant_society'],
      incentives: '100% foreign ownership, 15-year tax holiday, fast-track licensing via MISA',
    },
    {
      title_en: 'Renewable Energy — Solar Farm, Riyadh',
      title_ar: 'الطاقة المتجددة — مزرعة طاقة شمسية، الرياض',
      sector: 'Energy',
      description_en: '500MW solar photovoltaic farm supporting Saudi Arabia\'s target of 50% renewable energy by 2030.',
      description_ar: 'مزرعة طاقة شمسية بقدرة 500 ميغاواط لدعم هدف المملكة بـ 50% طاقة متجددة بحلول 2030.',
      min_investment: 20000000,
      max_investment: 200000000,
      expected_roi_min: 9,
      expected_roi_max: 14,
      risk_level: 'LOW' as const,
      sdg_goals: [7, 9, 13, 17],
      vision_2030_pillars: ['renewable_energy', 'economy_diversification', 'technology'],
      incentives: 'Government offtake agreement (PPA), subsidized land, import duty exemptions',
    },
    {
      title_en: 'Advanced Manufacturing Hub — KAEC',
      title_ar: 'مركز التصنيع المتقدم — مدينة الملك عبدالله الاقتصادية',
      sector: 'Manufacturing',
      description_en: 'State-of-the-art advanced manufacturing facility in King Abdullah Economic City.',
      description_ar: 'منشأة تصنيع متقدمة في مدينة الملك عبدالله الاقتصادية.',
      min_investment: 10000000,
      max_investment: 100000000,
      expected_roi_min: 11,
      expected_roi_max: 16,
      risk_level: 'MEDIUM' as const,
      sdg_goals: [8, 9, 12, 17],
      vision_2030_pillars: ['manufacturing', 'economy_diversification', 'empowering_citizens'],
      incentives: 'Zero-customs zone, 30-year land lease, workforce training subsidy',
    },
    {
      title_en: 'FinTech Innovation Centre — Riyadh Valley',
      title_ar: 'مركز الابتكار في التكنولوجيا المالية — وادي الرياض',
      sector: 'Technology',
      description_en: 'Joint venture opportunity in Saudi Arabia\'s first dedicated FinTech hub, regulated by SAMA.',
      description_ar: 'فرصة مشاريع مشتركة في أول مركز متخصص للتكنولوجيا المالية في المملكة، منظم من قبل ساما.',
      min_investment: 2000000,
      max_investment: 20000000,
      expected_roi_min: 18,
      expected_roi_max: 30,
      risk_level: 'HIGH' as const,
      sdg_goals: [8, 9, 10, 17],
      vision_2030_pillars: ['technology', 'economy_diversification', 'empowering_citizens'],
      incentives: 'SAMA regulatory sandbox access, MISA fast-track, seed co-investment from PIF',
    },
    {
      title_en: 'Healthcare & MedTech Campus — Jeddah',
      title_ar: 'حرم الرعاية الصحية والتكنولوجيا الطبية — جدة',
      sector: 'Healthcare',
      description_en: 'Integrated healthcare campus with hospital, research centre, and MedTech manufacturing.',
      description_ar: 'حرم رعاية صحية متكامل يشمل مستشفى ومركز بحثي ومصنع تكنولوجيا طبية.',
      min_investment: 15000000,
      max_investment: 150000000,
      expected_roi_min: 10,
      expected_roi_max: 15,
      risk_level: 'LOW' as const,
      sdg_goals: [3, 8, 9, 17],
      vision_2030_pillars: ['empowering_citizens', 'vibrant_society', 'economy_diversification'],
      incentives: 'MOH partnership, accreditation fast-track, staff housing subsidy',
    },
  ]

  for (const opp of opportunities) {
    const created = await prisma.opportunity.create({ data: opp })
    // Calculate initial scores
    const roiAvg = (opp.expected_roi_min + opp.expected_roi_max) / 2
    const financial_score = Math.min(100, roiAvg * 5)
    const riskMap = { LOW: 90, MEDIUM: 60, HIGH: 30 }
    const risk_score = riskMap[opp.risk_level]
    const PILLARS_COUNT = 8
    const vision_score = Math.min(100, (opp.vision_2030_pillars.length / PILLARS_COUNT) * 100)
    const sdg_score = Math.min(100, (opp.sdg_goals.length / 17) * 100)
    const composite = Math.round(financial_score * 0.35 + risk_score * 0.25 + vision_score * 0.25 + sdg_score * 0.15)

    await prisma.opportunityScore.create({
      data: {
        opportunity_id: created.id,
        financial_score: Math.round(financial_score),
        risk_score,
        vision_score: Math.round(vision_score),
        sdg_score: Math.round(sdg_score),
        composite,
      },
    })
  }

  console.log('✅ Database seeded: admin user + 5 investment opportunities')
}

main().catch(console.error).finally(() => prisma.$disconnect())
