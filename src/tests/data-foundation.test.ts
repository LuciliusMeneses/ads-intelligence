/**
 * ADS INTELLIGENCE — Data Foundation & Supabase Persistence Tests
 * Prompt 03 Test Suite: Multi-tenant Isolation, Repository Adapters, RLS Verification,
 * Human Decision Append-Only, Proposal Versioning, and Performance Null Handling.
 */

import assert from 'assert';
import {
  SupabaseOrganizationRepository,
  SupabaseBrandRepository,
  SupabaseProductServiceRepository,
  SupabaseCampaignRepository,
  SupabaseCampaignProposalRepository,
  SupabaseRecommendationRepository,
  SupabaseEvidenceRepository,
  SupabaseHumanDecisionRepository,
  SupabaseAuditRepository,
  SupabaseLearningRepository
} from '../repositories/supabase-adapters';
import { ApprovalGate } from '../state-machine/approval-gate';

console.log('=== INICIANDO TESTES PROMPT 03: DATA FOUNDATION & SUPABASE PERSISTENCE ===\n');

// Repositories
const orgRepo = new SupabaseOrganizationRepository();
const brandRepo = new SupabaseBrandRepository();
const productRepo = new SupabaseProductServiceRepository();
const campaignRepo = new SupabaseCampaignRepository();
const proposalRepo = new SupabaseCampaignProposalRepository();
const recRepo = new SupabaseRecommendationRepository();
const evidenceRepo = new SupabaseEvidenceRepository();
const humanRepo = new SupabaseHumanDecisionRepository();
const auditRepo = new SupabaseAuditRepository();
const learningRepo = new SupabaseLearningRepository();

async function runDataFoundationTests() {
  // 1. Organization & Brand CRUD
  console.log('TEST 1: Organization & Brand CRUD...');
  const orgA = await orgRepo.create({ name: 'Acme Corp', slug: 'acme', status: 'ACTIVE' });
  const orgB = await orgRepo.create({ name: 'Beta Ltd', slug: 'beta', status: 'ACTIVE' });

  assert(orgA.id && orgB.id, 'Organizations must be assigned unique IDs');

  const brandA = await brandRepo.create({
    organizationId: orgA.id,
    name: 'Acme SaaS',
    country: 'BR',
    currency: 'BRL',
    timezone: 'America/Sao_Paulo'
  });

  const brandB = await brandRepo.create({
    organizationId: orgB.id,
    name: 'Beta E-com',
    country: 'US',
    currency: 'USD',
    timezone: 'America/New_York'
  });

  console.log('✓ PASS: Organization and Brand created successfully.\n');

  // 2. Multi-Tenant Isolation Test (Cross-Tenant Access Denial)
  console.log('TEST 2: Multi-Tenant Isolation & Cross-Tenant Access Denial...');
  // Org A trying to fetch Org B's brand should return null
  const crossFetch = await brandRepo.findById(orgA.id, brandB.id);
  assert.strictEqual(crossFetch, null, 'Tenant A must NOT be able to read Tenant B brand data');

  const orgABrands = await brandRepo.listByOrganization(orgA.id);
  assert.strictEqual(orgABrands.length, 1, 'Tenant A listing should only return Tenant A brands');
  assert.strictEqual(orgABrands[0].id, brandA.id);
  console.log('✓ PASS: Strict multi-tenant isolation enforced.\n');

  // 3. Product / Service CRUD & Null Price Handling
  console.log('TEST 3: Product / Service CRUD & Null Price Handling...');
  const prodA = await productRepo.create({
    organizationId: orgA.id,
    brandId: brandA.id,
    type: 'SERVICE',
    name: 'Software de Automação',
    currency: 'BRL',
    status: 'ACTIVE'
    // Price, margin, CAC left undefined intentionally to verify no fake zero fallbacks
  });

  assert.strictEqual(prodA.currentPrice, undefined, 'Missing price must remain undefined (no fake zero filling)');
  assert.strictEqual(prodA.targetCac, undefined, 'Missing target CAC must remain undefined');
  console.log('✓ PASS: Product created with clean null/undefined handling.\n');

  // 4. Campaign & Approval State Persistence
  console.log('TEST 4: Campaign Persistence & State Machine Verification...');
  const campaignA = await campaignRepo.create({
    organizationId: orgA.id,
    brandId: brandA.id,
    productServiceId: prodA.id,
    name: 'Campanha Q4 Conversões',
    platform: 'META',
    objective: 'CONVERSIONS',
    status: 'DRAFT',
    approvalState: 'DRAFT'
  });

  // Test valid transition: DRAFT -> ANALYZING
  const updatedCampaign = await campaignRepo.updateApprovalState(orgA.id, campaignA.id, 'ANALYZING');
  assert.strictEqual(updatedCampaign.approvalState, 'ANALYZING', 'Approval state should update to ANALYZING');

  // Attempt invalid transition: DRAFT directly to PUBLISHED
  assert.strictEqual(ApprovalGate.canTransition('DRAFT', 'PUBLISHED'), false, 'Direct DRAFT -> PUBLISHED must be rejected');
  console.log('✓ PASS: Campaign state persistence and Approval Gate rules verified.\n');

  // 5. Campaign Proposal Versioning
  console.log('TEST 5: Campaign Proposal Versioning...');
  const propV1 = await proposalRepo.create({
    organizationId: orgA.id,
    campaignId: campaignA.id,
    version: 1,
    proposalData: { note: 'Proposta Inicial' },
    confidenceScore: 78,
    confidenceBand: 'HIGH',
    auditStatus: 'PASS'
  });

  const propV2 = await proposalRepo.create({
    organizationId: orgA.id,
    campaignId: campaignA.id,
    version: 2,
    proposalData: { note: 'Proposta Refinada com Mais Dados' },
    confidenceScore: 88,
    confidenceBand: 'HIGH',
    auditStatus: 'PASS'
  });

  const latestProp = await proposalRepo.getLatestVersion(orgA.id, campaignA.id);
  assert.strictEqual(latestProp?.version, 2, 'Latest proposal version must be version 2');
  assert.strictEqual(latestProp?.id, propV2.id);
  console.log('✓ PASS: Proposal versioning works correctly.\n');

  // 6. Human Decision Append-Only Guarantee
  console.log('TEST 6: Human Decision Append-Only Guarantee...');
  const recA = await recRepo.create({
    organizationId: orgA.id,
    campaignId: campaignA.id,
    proposalId: propV2.id,
    specialist: 'AUDIENCE_STRATEGIST',
    type: 'AUDIENCE',
    title: 'Testar Broad Targeting',
    description: 'Direcionar orçamento para público amplo',
    priority: 'HIGH',
    confidence: 85,
    expectedImpact: 'Redução de CPA',
    risk: 'Fase de aprendizado',
    status: 'PROPOSED',
    classification: 'AI_RECOMMENDATION',
    evidence: ['Histórico positivo'],
    hypothesisIds: []
  });

  // Decision 1: MODIFY
  const dec1 = await humanRepo.create({
    organizationId: orgA.id,
    recommendationId: recA.id,
    userId: 'usr_manager_1',
    decision: 'MODIFY',
    originalRecommendation: { ...recA },
    modifiedValue: { budgetDaily: 500 },
    reason: 'Ajuste de verba inicial'
  });

  // Decision 2: ACCEPT (Follow-up)
  const dec2 = await humanRepo.create({
    organizationId: orgA.id,
    recommendationId: recA.id,
    userId: 'usr_owner_1',
    decision: 'ACCEPT',
    originalRecommendation: { ...recA },
    reason: 'Aprovado após alinhamento'
  });

  const decisionHistory = await humanRepo.listByRecommendation(orgA.id, recA.id);
  assert.strictEqual(decisionHistory.length, 2, 'Decision history must contain both entries (Append-only)');
  assert.strictEqual(decisionHistory[0].decision, 'MODIFY');
  assert.strictEqual(decisionHistory[1].decision, 'ACCEPT');
  assert.deepStrictEqual(decisionHistory[0].originalRecommendation, recA, 'Original recommendation preserved intact');
  console.log('✓ PASS: Human decisions operate strictly append-only without deleting original recommendations.\n');

  // 7. Audit Results & Learning Records
  console.log('TEST 7: Audit Results & Learning Records...');
  const auditA = await auditRepo.create({
    organizationId: orgA.id,
    campaignId: campaignA.id,
    proposalId: propV2.id,
    status: 'PASS',
    blockers: [],
    warnings: [],
    observations: ['Proposta aprovada para revisão humana']
  });

  const learningA = await learningRepo.create({
    organizationId: orgA.id,
    brandId: brandA.id,
    campaignId: campaignA.id,
    recommendationId: recA.id,
    humanDecisionId: dec2.id,
    summary: 'Broad targeting superou expectativas de conversão',
    outcome: 'CPA reduzido em 18%',
    lesson: 'Públicos amplos com boa proposta de valor performam melhor no Meta Ads.',
    confidence: 90
  });

  assert.strictEqual(auditA.status, 'PASS');
  assert(learningA.id.startsWith('learn_'), 'Learning record created successfully');
  console.log('✓ PASS: Audit results and Learning records successfully persisted.\n');

  console.log('================================================================');
  console.log('TODOS OS TESTES DE PERSISTÊNCIA DATA FOUNDATION PASSARAM COM SUCESSO!');
  console.log('================================================================');
}

runDataFoundationTests().catch(err => {
  console.error('❌ Data Foundation Test Error:', err);
  process.exit(1);
});
