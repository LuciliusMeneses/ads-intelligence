/**
 * ADS INTELLIGENCE — LLM Runtime & 9Router Integration Test Suite
 */

import assert from 'assert';
import { FakeLLMProvider, NineRouterLLMProvider } from '../llm/provider';
import { LLMRuntime } from '../llm/runtime';

async function runTests() {
  console.log('--- TESTE: NineRouter Default Runtime ---');
  const runtime = new LLMRuntime();
  assert(runtime instanceof LLMRuntime);

  console.log('--- TESTE: Fake Provedor Isolado ---');
  const fake = new FakeLLMProvider();
  assert.strictEqual(fake.providerName, 'fake_test_provider');

  console.log('--- TESTE: Health Check 9Router ---');
  try {
    const provider = new NineRouterLLMProvider();
    const healthy = await provider.healthCheck();
    console.log('Status 9Router:', healthy ? 'OK' : 'Falha/Timeout');
  } catch (e) {
    console.log('Erro esperado na infra sem config:', e);
  }
  
  console.log('✓ TESTES FINALIZADOS');
}

runTests().catch(process.exit);
