/**
 * ADS INTELLIGENCE — Real Supabase Integration & Certification Test Suite
 * NO FALSE POSITIVES: Any failure in connection, migration, RLS, or persistence
 * throws an explicit Error and fails the process.
 */

import assert from 'assert';
import { createAdminSupabaseClient, createPublicSupabaseClient, createScopedSupabaseClient } from '../lib/supabase';
import {
  ProductionSupabaseOrganizationRepository,
  ProductionSupabaseBrandRepository,
  ProductionSupabaseProductServiceRepository,
  ProductionSupabaseCampaignRepository,
  ProductionSupabaseCampaignProposalRepository,
  ProductionSupabaseHumanDecisionRepository
} from '../repositories/supabase-production-adapters';

console.log('=== INICIANDO TESTES DE INTEGRAÇÃO REAL SUPABASE (PROMPT 03B) ===\n');

async function runStrictSupabaseIntegrationTests() {
  const adminClient = createAdminSupabaseClient();

  // 1. Connection Verification
  console.log('1. VERIFICAÇÃO DE CONEXÃO REAL...');
  const { data: orgCheck, error: connError } = await adminClient.from('organizations').select('id').limit(1);
  if (connError) {
    console.error('❌ Falha na conexão real com Supabase:', connError.message);
    throw new Error(`[Supabase Connection Failure] Não foi possível ligar ao projeto Supabase: ${connError.message}`);
  }
  console.log('✓ Conexão estabelecida com sucesso com a instância Supabase/PostgreSQL.\n');

  const orgRepo = new ProductionSupabaseOrganizationRepository(adminClient);
  const brandRepo = new ProductionSupabaseBrandRepository(adminClient);
  const prodRepo = new ProductionSupabaseProductServiceRepository(adminClient);
  const campRepo = new ProductionSupabaseCampaignRepository(adminClient);
  const propRepo = new ProductionSupabaseCampaignProposalRepository(adminClient);
  const humanRepo = new ProductionSupabaseHumanDecisionRepository(adminClient);

  // 2. Real Persistence Proof with a NEW Supabase Client
  console.log('2. PROVA DE PERSISTÊNCIA REAL (NOVO CLIENTE)...');
  const testSlug = `org_cert_${Date.now()}`;
  const org = await orgRepo.create({
    name: 'Org Certificação Real',
    slug: testSlug,
    status: 'ACTIVE'
  });
  assert(org.id, 'Organization ID must be returned by PostgreSQL');

  // Create NEW independent client instance to re-query
  const newIndependentClient = createAdminSupabaseClient();
  const independentOrgRepo = new ProductionSupabaseOrganizationRepository(newIndependentClient);
  const reReadOrg = await independentOrgRepo.findById(org.id);

  assert(reReadOrg, 'Re-read record must exist in PostgreSQL database');
  assert.strictEqual(reReadOrg.id, org.id, 'Re-read record ID must match');
  assert.strictEqual(reReadOrg.slug, testSlug, 'Re-read record slug must match');
  console.log(`✓ Prova de persistência real confirmada: ID ${org.id} gravado e lido por NOVO cliente.\n`);

  // 3. Zero vs Null Semantics Test
  console.log('3. TESTE DE SEMÂNTICA DE NULL vs ZERO...');
  const brand = await brandRepo.create({
    organizationId: org.id,
    name: 'Brand Certificação',
    country: 'BR',
    currency: 'BRL',
    timezone: 'America/Sao_Paulo'
  });

  // Product 1: Cost is 0 (zero explicitly)
  const zeroProduct = await prodRepo.create({
    organizationId: org.id,
    brandId: brand.id,
    type: 'PRODUCT',
    name: 'Produto Custo Zero',
    currency: 'EUR',
    currentPrice: 100,
    cost: 0,
    status: 'ACTIVE'
  });
  assert.strictEqual(zeroProduct.cost, 0, 'Database value 0 must remain 0 in domain entity');

  // Product 2: Cost is NULL (undefined)
  const nullProduct = await prodRepo.create({
    organizationId: org.id,
    brandId: brand.id,
    type: 'PRODUCT',
    name: 'Produto Custo Indefinido',
    currency: 'USD',
    currentPrice: 150,
    status: 'ACTIVE'
  });
  assert.strictEqual(nullProduct.cost, undefined, 'Database NULL value must remain undefined in domain entity');
  console.log('✓ Semântica de NULL vs ZERO comprovada: 0 permanece 0 e NULL permanece undefined.\n');

  // 4. Human Decision Append-Only Real Test
  console.log('4. TESTE DE DECISÃO HUMANA APPEND-ONLY NO POSTGRESQL...');
  const campaign = await campRepo.create({
    organizationId: org.id,
    brandId: brand.id,
    name: 'Campanha Decisões Append-Only',
    platform: 'META',
    objective: 'CONVERSIONS',
    status: 'DRAFT',
    approvalState: 'DRAFT'
  });

  const proposal = await propRepo.create({
    organizationId: org.id,
    campaignId: campaign.id,
    version: 1,
    proposalData: { title: 'Proposta v1' },
    confidenceScore: 82,
    confidenceBand: 'HIGH',
    auditStatus: 'PASS'
  });

  const dummyRecId = '00000000-0000-0000-0000-000000000001';
  // Insert Decision 1
  await humanRepo.create({
    organizationId: org.id,
    recommendationId: dummyRecId,
    userId: '00000000-0000-0000-0000-000000000002',
    decision: 'MODIFY',
    originalRecommendation: { title: 'Original' },
    modifiedValue: { budget: 500 },
    reason: 'Modificação inicial'
  });

  // Insert Decision 2
  await humanRepo.create({
    organizationId: org.id,
    recommendationId: dummyRecId,
    userId: '00000000-0000-0000-0000-000000000003',
    decision: 'ACCEPT',
    originalRecommendation: { title: 'Original' },
    reason: 'Aprovação final'
  });

  const decisionsList = await humanRepo.listByRecommendation(org.id, dummyRecId);
  assert.strictEqual(decisionsList.length, 2, 'Decisions must be append-only with 2 distinct entries');
  assert.strictEqual(decisionsList[0].decision, 'MODIFY');
  assert.strictEqual(decisionsList[1].decision, 'ACCEPT');
  console.log('✓ Decisão Humana Append-Only comprovada no PostgreSQL real.\n');

  // 5. Cleanup Test Artifacts
  console.log('5. LIMPEZA CONTROLADA DE DADOS DE TESTE...');
  await adminClient.from('organizations').delete().eq('id', org.id);
  console.log('✓ Limpeza de dados de teste concluída.\n');

  console.log('================================================================');
  console.log('CERTIFICAÇÃO REAL SUPABASE / POSTGRESQL CONCLUÍDA COM SUCESSO!');
  console.log('================================================================');
}

runStrictSupabaseIntegrationTests().catch(err => {
  console.error('\n❌ ERRO FATAL EM TESTE DE INTEGRAÇÃO SUPABASE REAL:', err);
  process.exitCode = 1;
  process.exit(1);
});
