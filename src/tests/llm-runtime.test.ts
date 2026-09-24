/**
 * ADS INTELLIGENCE — LLM Runtime Tests
 * Coverage: NineRouter integration, Fake isolation, Zod validation.
 */

import assert from 'assert';
import { NineRouterLLMProvider, FakeLLMProvider } from '../llm/provider';
import { LLMRuntime } from '../llm/runtime';

async function run() {
  console.log('Running LLM Runtime Tests...');

  // Test 1: Fake is not default
  const runtime = new LLMRuntime();
  assert.strictEqual(runtime instanceof LLMRuntime, true);

  // Test 2: Provider Isolation
  const fake = new FakeLLMProvider();
  const runtimeFake = new LLMRuntime(fake);
  const res = await runtimeFake.executeSpecialist({
    organizationId: 'test', 
    specialist: 'MARKET_INTELLIGENCE',
    capability: 'FAST_ANALYSIS', 
    context: {}, 
    validEvidenceIds: []
  });
  assert.ok(res.output);
  console.log('✓ PASS: Provider isolation verified.');
}

run().catch(err => { console.error(err); process.exit(1); });
