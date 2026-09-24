/**
 * ADS INTELLIGENCE — LLM Runtime & 9Router Integration Test Suite
 */

import assert from 'assert';
import { FakeLLMProvider, NineRouterLLMProvider } from '../llm/provider';
import { LLMRuntime } from '../llm/runtime';

async function runTests() {
  console.log('--- TEST: NineRouter Default Runtime ---');
  const runtime = LLMRuntime.createDefault();
  assert(runtime instanceof LLMRuntime, 'Runtime instance created');
  
  console.log('--- TEST: Fake Provider Isolation ---');
  const fake = new FakeLLMProvider();
  const fakeRuntime = new LLMRuntime(fake);
  const res = await fakeRuntime.executeSpecialist({
    organizationId: 'test', 
    specialist: 'MARKET_INTELLIGENCE',
    capability: 'FAST_ANALYSIS',
    context: {},
    validEvidenceIds: []
  } as any);
  assert(res.output, 'Fake execution succeeded');
  
  console.log('✓ PASS: All tests completed.');
}

runTests().catch(e => { console.error(e); process.exit(1); });
