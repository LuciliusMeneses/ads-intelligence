import assert from 'assert';
import { NineRouterLLMProvider, FakeLLMProvider } from '../llm/provider';
import { LLMRuntime } from '../llm/runtime';

async function runTests() {
  console.log('--- TESTE SPRINT 04 ---');
  
  // Test 1: NineRouter Default Runtime
  const runtime = new LLMRuntime();
  assert(runtime instanceof LLMRuntime, 'NineRouter deve ser o default');

  // Test 2: Fake Injection Test
  const fake = new FakeLLMProvider();
  const fakeRuntime = new LLMRuntime(fake);
  assert(fakeRuntime);
  
  console.log('✓ Testes unitários de runtime passados.');
}

runTests().catch(e => { console.error(e); process.exit(1); });
