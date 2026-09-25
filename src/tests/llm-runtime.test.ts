/**
 * ADS INTELLIGENCE — LLM Runtime & Specialist Integration Test Suite
 */

import assert from 'assert';
import { FakeLLMProvider } from '../llm/provider';
import { StructuredOutputValidator } from '../llm/validator';
import { SpecialistContextBuilder } from '../llm/context-builder';
import { LLMRuntime } from '../llm/runtime';

async function runSprint05Tests() {
  console.log('=== SPRINT 05 INTEGRATION TESTS ===');

  // Test Evidence Binding Enforcement
  const output = {
    specialist: 'MARKET_INTELLIGENCE',
    summary: 'Test',
    recommendations: [],
    evidenceIds: ['invalid_id'],
    confidenceRationale: 'Test'
  } as any;
  
  const binding = StructuredOutputValidator.verifyEvidenceBinding(output, ['valid_1']);
  assert.strictEqual(binding.valid, false, 'Should reject invalid evidence IDs');
  
  // Test Tenant Context Isolation
  const contextBuilder = SpecialistContextBuilder.buildForSpecialist(
    'tenant_123', 
    'MARKET_INTELLIGENCE', 
    { brand: 'Test' }
  );
  assert.strictEqual(contextBuilder.organizationId, 'tenant_123');
  
  console.log('✓ PASS: Specialist Logic and Validation Gate Tests passed.');
}

runSprint05Tests().catch(err => {
  console.error(err);
  process.exit(1);
});
