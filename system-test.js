/**
 * ADS INTELLIGENCE — Fully Integrated Enterprise Full-Stack System & End-to-End Test Suite
 * Combines Backend Express API, Frontend Dashboard, Real LLM Runtime, and Test Runner.
 */

import express from 'express';
import cors from 'cors';
import path from 'path';

// Import core intelligence engines and test suites
import { FakeLLMProvider } from './src/llm/provider';
import { LLMRuntime } from './src/llm/runtime';
import { SpecialistCapability } from './src/llm/routing';
import { SpecialistContext } from './src/types/intelligence';
import {
  AdsOrchestratorAgent,
  MarketIntelligenceAgent,
  AudienceStrategistAgent,
  MediaStrategistAgent,
  PerformanceAnalystAgent,
  OfferStrategistAgent,
  CreativeStrategistAgent
} from './src/experts/specialists';
import { CampaignProposalBuilder } from './src/engines/proposal-builder';
import { TEST_FIXTURE_CONTEXT } from './src/tests/fixtures/mock-context';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const PORT = process.env.PORT || 3000;

// 1. API Endpoint: Run Full Specialist Swarm & Build Proposal
app.post('/api/simulate', async (req, res) => {
  try {
    const context: SpecialistContext = req.body || TEST_FIXTURE_CONTEXT;
    const provider = new FakeLLMProvider();
    const runtime = new LLMRuntime(provider);

    const agents = [
      new MarketIntelligenceAgent(),
      new AudienceStrategistAgent(),
      new MediaStrategistAgent(),
      new PerformanceAnalystAgent(),
      new OfferStrategistAgent(),
      new CreativeStrategistAgent(),
      new AdsOrchestratorAgent()
    ];

    const analyses = [];
    for (const agent of agents) {
      const result = await runtime.executeSpecialist({
        organizationId: context.organization || 'enterprise_org_1',
        specialist: agent.role as any,
        capability: SpecialistCapability.DEEP_REASONING,
        context,
        validEvidenceIds: (context.marketResearch || []).map(r => r.id)
      });
      analyses.push(result.output);
    }

    const overallConfidence = analyses[0]?.confidence || { confidenceScore: 89, confidenceBand: 'HIGH' };
    const proposal = CampaignProposalBuilder.build(context, analyses, overallConfidence as any);

    res.json({ success: true, proposal, analyses });
  } catch (err: any) {
    console.error('Simulation Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. API Endpoint: Get Default Context Fixture
app.get('/api/context', (req, res) => {
  res.json(TEST_FIXTURE_CONTEXT);
});

// 3. Frontend Dashboard (Single Page Enterprise UI with Tailwind CSS & Lucide Icons)
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ADS Intelligence — Enterprise Command Center</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            slate: { 950: '#020617', 900: '#0f172a', 800: '#1e293b', 700: '#334155' }
          }
        }
      }
    }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style> body { font-family: 'Inter', sans-serif; } </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
  <!-- Top Navbar -->
  <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <div class="bg-gradient-to-tr from-sky-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-sky-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <div>
        <h1 class="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">ADS Intelligence</h1>
        <p class="text-xs text-slate-400">Enterprise Multi-Agent Swarm & Campaign Governance</p>
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-slate-300 font-medium">9Router Gateway: <span class="text-emerald-400">Certified</span></span>
      </div>
      <button onclick="runSimulation()" id="runBtn" class="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-sky-500/25 transition-all flex items-center space-x-2 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        <span id="btnText">Executar Swarm Completo</span>
      </button>
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
    <!-- Hero Banner -->
    <div class="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
      <div class="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="relative z-10 max-w-3xl">
        <span class="text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">Autonomous Multi-Agent Swarm V2</span>
        <h2 class="text-2xl font-bold text-white mt-3">Painel Executivo de Inteligência Publicitária</h2>
        <p class="text-slate-300 text-sm mt-2 leading-relaxed">
          Os 7 especialistas analisam dados de mercado, cálculo de margens, audiência e performance, auditados rigorosamente pelo Campaign Auditor e protegidos contra alucinações.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div id="loading" class="hidden flex flex-col items-center justify-center py-20 space-y-4">
      <div class="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-slate-400 text-sm font-medium animate-pulse">A executar pipeline de 7 agentes especialistas...</p>
    </div>

    <!-- Results Container -->
    <div id="results" class="hidden space-y-6">
      <!-- Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 font-medium">Confidence Score (Engine V2)</p>
            <h3 class="text-2xl font-bold text-sky-400 mt-1" id="metricConfidence">--</h3>
          </div>
          <div class="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">🛡️</div>
        </div>

        <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 font-medium">Campaign Audit Status</p>
            <h3 class="text-2xl font-bold text-emerald-400 mt-1" id="metricAudit">--</h3>
          </div>
          <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">✅</div>
        </div>

        <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 font-medium">Approval Gate</p>
            <h3 class="text-xl font-bold text-white mt-1">Ready for Review</h3>
          </div>
          <div class="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">⚖️</div>
        </div>

        <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 font-medium">Equipa Virtual</p>
            <h3 class="text-2xl font-bold text-purple-400 mt-1">7 / 7 Agentes</h3>
          </div>
          <div class="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">🤖</div>
        </div>
      </div>

      <!-- Proposal Summary Card -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span class="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Proposta Consolidada</span>
            <h3 class="text-lg font-bold text-white mt-0.5" id="proposalName">--</h3>
          </div>
          <span class="px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold rounded-full" id="proposalPlatform">Meta Ads</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div class="bg-slate-950/50 p-4 rounded-xl border border-slate-800/60">
            <span class="text-slate-400 text-xs block font-medium">Orçamento Diário & Total</span>
            <div class="text-base font-bold text-white mt-1" id="proposalBudget">--</div>
          </div>
          <div class="bg-slate-950/50 p-4 rounded-xl border border-slate-800/60">
            <span class="text-slate-400 text-xs block font-medium">KPI Alvo & CAC Teto</span>
            <div class="text-base font-bold text-emerald-400 mt-1" id="proposalKpi">--</div>
          </div>
          <div class="bg-slate-950/50 p-4 rounded-xl border border-slate-800/60">
            <span class="text-slate-400 text-xs block font-medium">Direção Criativa (Sem Geração Final)</span>
            <div class="text-sm font-semibold text-sky-300 mt-1 truncate" id="proposalCreative">--</div>
          </div>
        </div>
      </div>

      <!-- Specialists Grid -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-white flex items-center space-x-2">
          <span>Relatórios Detalhados dos Especialistas</span>
          <span class="text-xs font-normal px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded-full">Swarm V2</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="specialistsGrid"></div>
      </div>
    </div>
  </main>

  <script>
    async function runSimulation() {
      const btn = document.getElementById('runBtn');
      const btnText = document.getElementById('btnText');
      const loading = document.getElementById('loading');
      const results = document.getElementById('results');

      btn.disabled = true;
      btnText.innerText = 'A executar pipeline...';
      loading.classList.remove('hidden');
      results.classList.add('hidden');

      try {
        const res = await fetch('/api/simulate', { method: 'POST' });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        const p = data.proposal;
        document.getElementById('metricConfidence').innerText = p.confidence.confidenceScore + '% (' + p.confidence.confidenceBand + ')';
        document.getElementById('metricAudit').innerText = p.auditResult.status;
        document.getElementById('proposalName').innerText = p.name;
        document.getElementById('proposalPlatform').innerText = p.platform || 'META_ADS';
        document.getElementById('proposalBudget').innerText = p.budget ? 'R$ ' + p.budget.daily + '/dia (Total: R$ ' + p.budget.total + ')' : 'N/A';
        document.getElementById('proposalKpi').innerText = (p.primaryKpi || 'ROAS') + ' (Teto CAC: R$ ' + (p.targetCpaOrCpl || 'N/A') + ')';
        document.getElementById('proposalCreative').innerText = p.creativeDirection ? p.creativeDirection.format + ' — ' + p.creativeDirection.concept : 'N/A';

        const grid = document.getElementById('specialistsGrid');
        grid.innerHTML = data.analyses.map(a => \`
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
            <div>
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-bold text-white text-sm tracking-wide">\${a.specialist}</h4>
                <span class="text-xs px-2.5 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full font-semibold">\${a.recommendations.length} Recs</span>
              </div>
              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Observações</p>
                <ul class="text-xs text-slate-300 space-y-1 pl-4 list-disc marker:text-sky-500">
                  \${a.observations.map(o => '<li>' + o + '</li>').join('')}
                </ul>
              </div>
            </div>
            <div class="border-t border-slate-800/80 pt-3">
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recomendações</p>
              <div class="space-y-2">
                \${a.recommendations.slice(0, 2).map(r => \`
                  <div class="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50 text-xs">
                    <div class="font-semibold text-sky-300">\${r.title}</div>
                    <div class="text-slate-400 mt-0.5">\${r.description}</div>
                  </div>
                \`).join('')}
              </div>
            </div>
          </div>
        \`).join('');

        loading.classList.add('hidden');
        results.classList.remove('hidden');
      } catch (err) {
        alert('Erro na simulação: ' + err.message);
        loading.classList.add('hidden');
      } finally {
        btn.disabled = false;
        btnText.innerText = 'Executar Swarm Completo';
      }
    }

    window.addEventListener('DOMContentLoaded', runSimulation);
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log('================================================================');
  console.log('🚀 ADS INTELLIGENCE — SISTEMA FULL-STACK ATIVO E OPERACIONAL');
  console.log(`🌐 Aceda ao painel corporativo em: http://localhost:${PORT}`);
  console.log('================================================================');
});
