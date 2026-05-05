const OPP_1 = {
  id: 'opp-001',
  title_en: 'NEOM Smart City Infrastructure',
  title_ar: 'البنية التحتية لمدينة نيوم الذكية',
  sector: 'Technology',
  description_en: 'A flagship infrastructure project under NEOM, the $500B futuristic city being built in northwestern Saudi Arabia. Includes AI-powered urban systems, renewable energy grids, and autonomous transportation networks.',
  description_ar: 'مشروع بنية تحتية رائد ضمن مشروع نيوم، المدينة المستقبلية التي تُبنى في شمال غرب المملكة العربية السعودية بتكلفة 500 مليار دولار.',
  min_investment: 10_000_000,
  max_investment: 100_000_000,
  currency: 'SAR',
  expected_roi_min: 12,
  expected_roi_max: 18,
  risk_level: 'MEDIUM',
  sdg_goals: [9, 11, 13],
  vision_2030_pillars: ['DIGITAL_ECONOMY', 'URBAN_DEVELOPMENT', 'CLEAN_ENERGY'],
  incentives: '100% foreign ownership, 0% corporate tax for first 10 years, dedicated NEOM regulatory zone with fast-track licensing.',
  status: 'ACTIVE',
  score: { financial_score: 82, risk_score: 71, vision_score: 94, sdg_score: 78, composite: 82 },
}

const OPP_2 = {
  id: 'opp-002',
  title_en: 'Red Sea Tourism Resort Development',
  title_ar: 'تطوير منتجع البحر الأحمر السياحي',
  sector: 'Tourism',
  description_en: 'Luxury eco-resort development across 28 pristine islands on the Red Sea coast. Part of the Red Sea Project, targeting 1 million visitors annually by 2030.',
  description_ar: 'تطوير منتجعات فاخرة صديقة للبيئة عبر 28 جزيرة على ساحل البحر الأحمر، ضمن مشروع البحر الأحمر.',
  min_investment: 5_000_000,
  max_investment: 50_000_000,
  currency: 'SAR',
  expected_roi_min: 9,
  expected_roi_max: 15,
  risk_level: 'LOW',
  sdg_goals: [8, 14, 17],
  vision_2030_pillars: ['TOURISM', 'ENVIRONMENTAL_SUSTAINABILITY'],
  incentives: 'Government co-investment of 30%, guaranteed land lease at preferential rates, tourism zone tax exemptions.',
  status: 'ACTIVE',
  score: { financial_score: 76, risk_score: 85, vision_score: 88, sdg_score: 72, composite: 80 },
}

const OPP_3 = {
  id: 'opp-003',
  title_en: 'Riyadh Green Hydrogen Plant',
  title_ar: 'مصنع الهيدروجين الأخضر بالرياض',
  sector: 'Clean Energy',
  description_en: 'Industrial-scale green hydrogen production facility powered by 100% solar energy. Aligned with Saudi Green Initiative targeting 50% renewable energy by 2030.',
  description_ar: 'منشأة صناعية لإنتاج الهيدروجين الأخضر تعمل بالطاقة الشمسية 100%، تتوافق مع مبادرة السعودية الخضراء.',
  min_investment: 25_000_000,
  max_investment: 200_000_000,
  currency: 'SAR',
  expected_roi_min: 14,
  expected_roi_max: 22,
  risk_level: 'HIGH',
  sdg_goals: [7, 9, 13],
  vision_2030_pillars: ['CLEAN_ENERGY', 'INDUSTRIAL_DEVELOPMENT'],
  incentives: 'NEOM hydrogen offtake agreement, ACWA Power partnership, PIF co-investment eligibility.',
  status: 'ACTIVE',
  score: { financial_score: 88, risk_score: 58, vision_score: 91, sdg_score: 90, composite: 82 },
}

const OPP_4 = {
  id: 'opp-004',
  title_en: 'AlUla Heritage Real Estate Fund',
  title_ar: 'صندوق العقارات التراثية في العُلا',
  sector: 'Real Estate',
  description_en: "Premium real estate investment fund developing luxury lodges and cultural immersion residences around AlUla's UNESCO World Heritage sites. Managed by RCU (Royal Commission for AlUla).",
  description_ar: 'صندوق استثماري عقاري متميز يطور منتجعات فاخرة وإقامات ثقافية حول مواقع التراث العالمي لليونسكو في العُلا.',
  min_investment: 2_000_000,
  max_investment: 20_000_000,
  currency: 'SAR',
  expected_roi_min: 8,
  expected_roi_max: 13,
  risk_level: 'LOW',
  sdg_goals: [8, 10, 11],
  vision_2030_pillars: ['TOURISM', 'CULTURAL_HERITAGE', 'REGIONAL_DEVELOPMENT'],
  incentives: 'RCU managed fund with government guarantee on principal, 15-year lease agreements, tax-free returns.',
  status: 'ACTIVE',
  score: { financial_score: 70, risk_score: 88, vision_score: 85, sdg_score: 68, composite: 78 },
}

const OPP_5 = {
  id: 'opp-005',
  title_en: 'Saudi Agri-Tech Vertical Farms',
  title_ar: 'مزارع الزراعة الرأسية التقنية في السعودية',
  sector: 'Agriculture',
  description_en: 'High-tech vertical farming network to reduce Saudi food import dependency from 80% to 40% by 2030. Uses AI-driven hydroponic systems across 5 major cities.',
  description_ar: 'شبكة مزارع رأسية عالية التقنية لتقليل الاعتماد السعودي على الاستيراد الغذائي من 80% إلى 40% بحلول 2030.',
  min_investment: 3_000_000,
  max_investment: 30_000_000,
  currency: 'SAR',
  expected_roi_min: 10,
  expected_roi_max: 16,
  risk_level: 'MEDIUM',
  sdg_goals: [2, 3, 12],
  vision_2030_pillars: ['FOOD_SECURITY', 'DIGITAL_ECONOMY'],
  incentives: 'Ministry of Environment subsidies, 5-year tax holiday, guaranteed offtake with Saudi supermarket chains.',
  status: 'ACTIVE',
  score: { financial_score: 74, risk_score: 72, vision_score: 80, sdg_score: 85, composite: 76 },
}

const ALL_OPPS = [OPP_1, OPP_2, OPP_3, OPP_4, OPP_5]

const MOCK_DOCS = [
  { id: 'doc-001', type: 'MISA', status: 'VERIFIED', file_hash: 'a3f9c2e1d4b7f8a2c5', uploaded_at: '2025-04-10T08:00:00Z' },
  { id: 'doc-002', type: 'MOC',  status: 'VERIFIED', file_hash: 'b2e8d1c4a5f7b3e9d2', uploaded_at: '2025-04-10T08:15:00Z' },
  { id: 'doc-003', type: 'MOFA', status: 'VERIFIED', file_hash: 'c4d7a2f1e8b5c3a7f4', uploaded_at: '2025-04-10T08:30:00Z' },
  { id: 'doc-004', type: 'SAMA', status: 'VERIFIED', file_hash: 'd5e3b9c2a8f4d1e6b8', uploaded_at: '2025-04-10T08:45:00Z' },
]

const MOCK_APPS = [
  {
    id: 'app-001',
    investor_id: 'inv-001',
    status: 'APPROVED',
    absher_ref: 'ABS-2025-4421',
    submitted_at: '2025-04-15T10:00:00Z',
    resolved_at: '2025-04-18T14:00:00Z',
    opportunity: OPP_1,
    status_history: [
      { id: 'sh-001', status: 'APPROVED',     note: 'All documents verified. Investment license issued.', created_at: '2025-04-18T14:00:00Z' },
      { id: 'sh-002', status: 'UNDER_REVIEW', note: 'Documents under review by MISA.', created_at: '2025-04-16T09:00:00Z' },
      { id: 'sh-003', status: 'SUBMITTED',    note: null, created_at: '2025-04-15T10:00:00Z' },
    ],
  },
  {
    id: 'app-002',
    investor_id: 'inv-001',
    status: 'UNDER_REVIEW',
    absher_ref: 'ABS-2025-4489',
    submitted_at: '2025-04-28T11:00:00Z',
    resolved_at: null,
    opportunity: OPP_2,
    status_history: [
      { id: 'sh-004', status: 'UNDER_REVIEW', note: 'Forwarded to Red Sea Project authority.', created_at: '2025-04-29T08:00:00Z' },
      { id: 'sh-005', status: 'SUBMITTED',    note: null, created_at: '2025-04-28T11:00:00Z' },
    ],
  },
  {
    id: 'app-003',
    investor_id: 'inv-001',
    status: 'SUBMITTED',
    absher_ref: 'ABS-2025-4512',
    submitted_at: '2025-05-01T09:00:00Z',
    resolved_at: null,
    opportunity: OPP_4,
    status_history: [
      { id: 'sh-006', status: 'SUBMITTED', note: null, created_at: '2025-05-01T09:00:00Z' },
    ],
  },
]

const MOCK_DASHBOARD = {
  kyc_status: 'APPROVED',
  total_documents: 4,
  verified_documents: 4,
  recent_applications: MOCK_APPS,
  recent_activity: [
    { id: 'log-001', action: 'APPLICATION_SUBMITTED',  created_at: '2025-05-01T09:00:00Z' },
    { id: 'log-002', action: 'APPLICATION_APPROVED',   created_at: '2025-04-18T14:00:00Z' },
    { id: 'log-003', action: 'DOCUMENT_VERIFIED',      created_at: '2025-04-12T10:00:00Z' },
    { id: 'log-004', action: 'KYC_APPROVED',           created_at: '2025-04-11T16:00:00Z' },
    { id: 'log-005', action: 'DOCUMENTS_SUBMITTED',    created_at: '2025-04-10T09:00:00Z' },
    { id: 'log-006', action: 'DOCUMENT_UPLOADED',      created_at: '2025-04-10T08:45:00Z' },
  ],
}

const MOCK_ADMIN_INVESTORS = {
  total: 5,
  data: [
    { id: 'inv-001', full_name: 'Mohammed Al-Rashid',  nationality: 'UAE',     company_name: 'Al-Rashid Holdings',   kyc_status: 'APPROVED',            user: { email: 'm.alrashid@holdings.ae' } },
    { id: 'inv-002', full_name: 'Sarah Chen',           nationality: 'China',   company_name: 'Horizon Capital',      kyc_status: 'SUBMITTED_TO_ABSHER', user: { email: 's.chen@horizoncap.cn' } },
    { id: 'inv-003', full_name: 'James Whitfield',      nationality: 'UK',      company_name: 'Whitfield Ventures',   kyc_status: 'APPROVED',            user: { email: 'j.whitfield@ventures.co.uk' } },
    { id: 'inv-004', full_name: 'Fatima Al-Mansouri',  nationality: 'Bahrain', company_name: null,                   kyc_status: 'PENDING',             user: { email: 'fatima.m@gmail.com' } },
    { id: 'inv-005', full_name: 'Rajiv Mehta',          nationality: 'India',   company_name: 'Mehta Infrastructure', kyc_status: 'SUBMITTED_TO_ABSHER', user: { email: 'r.mehta@mehtainfra.in' } },
  ],
}

const MOCK_AUDIT_LOGS = {
  total: 12,
  data: [
    { id: 'al-001', user_id: 'inv-001', entity_type: 'Application', entity_id: 'app-003', action: 'APPLICATION_SUBMITTED',  ip_address: '185.220.101.42', created_at: '2025-05-01T09:00:00Z' },
    { id: 'al-002', user_id: 'inv-001', entity_type: 'Application', entity_id: 'app-001', action: 'APPLICATION_APPROVED',   ip_address: '185.220.101.42', created_at: '2025-04-18T14:00:00Z' },
    { id: 'al-003', user_id: 'inv-002', entity_type: 'Document',    entity_id: 'doc-005', action: 'DOCUMENT_UPLOADED',      ip_address: '220.181.38.148', created_at: '2025-04-17T11:00:00Z' },
    { id: 'al-004', user_id: 'inv-001', entity_type: 'Document',    entity_id: 'doc-001', action: 'DOCUMENT_VERIFIED',      ip_address: '185.220.101.42', created_at: '2025-04-12T10:00:00Z' },
    { id: 'al-005', user_id: 'inv-003', entity_type: 'Investor',    entity_id: 'inv-003', action: 'KYC_APPROVED',           ip_address: '82.45.33.21',    created_at: '2025-04-10T09:00:00Z' },
  ],
}

function delay(ms = 400) {
  return new Promise((r) => setTimeout(r, ms))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mockApiFetch(path: string, options?: { method?: string; body?: string }): Promise<any> {
  await delay()

  const method = options?.method?.toUpperCase() || 'GET'

  if (path === '/investor/dashboard') return MOCK_DASHBOARD

  if (path === '/kyc/status') return { kyc_status: 'APPROVED', absher_ref: 'ABS-2025-3301', documents: MOCK_DOCS }
  if (path === '/kyc/submit' && method === 'POST') return { message: 'Submitted to Absher successfully.' }

  if (path === '/wallet/documents') return MOCK_DOCS

  if (path === '/marketplace/opportunities') return ALL_OPPS
  if (path === '/marketplace/sectors') return ['Technology', 'Tourism', 'Clean Energy', 'Real Estate', 'Agriculture']
  if (path.startsWith('/marketplace/opportunities/')) {
    const id = path.split('/').pop()
    return ALL_OPPS.find((o) => o.id === id) || null
  }

  if (path === '/applications' && method === 'GET') return MOCK_APPS
  if (path === '/applications' && method === 'POST') {
    return { id: 'app-new-001', status: 'SUBMITTED', message: 'Application submitted successfully.' }
  }
  if (path.match(/^\/applications\/.*\/timeline$/)) {
    const id = path.split('/')[2]
    return MOCK_APPS.find((a) => a.id === id) || null
  }

  if (path.startsWith('/admin/investors')) return MOCK_ADMIN_INVESTORS
  if (path.startsWith('/admin/audit-logs')) return MOCK_AUDIT_LOGS
  if (path === '/admin/absher/simulate' || path === '/absher/simulate') {
    return { message: 'Absher approval simulated successfully.' }
  }

  return null
}
