import assert from 'assert';
import { FakeLLMProvider } from '../llm/provider';
import { LLMRuntime } from '../llm/runtime';

async function runTests() {
  console.log('--- Testando Runtime ---');
  const fake = new FakeLLMProvider();
  const runtime = new LLMRuntime(fake);
  assert(runtime);
  console.log('✓ PASS: Runtime init');
}

runTests().catch(process.exit);
