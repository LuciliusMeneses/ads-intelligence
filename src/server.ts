import express from 'express';
import cors from 'cors';
import { LLMRuntime } from './llm/runtime';
import { FakeLLMProvider } from './llm/provider';
import { SpecialistCapability } from './llm/routing';
import { SpecialistContext, SpecialistAnalysis, ConfidenceResult } from './types/intelligence';
import { SpecialistLLMOutput } from './llm/validator';
import { AdsOrchestratorAgent, MarketIntelligenceAgent, AudienceStrategistAgent, MediaStrategistAgent, PerformanceAnalystAgent, OfferStrategistAgent, CreativeStrategistAgent } from './experts/specialists';
import { CampaignProposalBuilder } from './engines/proposal-builder';
import { TEST_FIXTURE_CONTEXT } from './tests/fixtures/mock-context';
import { ConfidenceEngine } from './engines/confidence-engine';
import { ExpertRole } from './types/ads-intelligence';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ADS Intelligence — Command Center & Enterprise Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
  <!-- Header -->
  <header class="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <div class="bg-gradient-to-tr from-sky-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-sky-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </div>
      <div>
        <h1 class="text-xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">ADS Intelligence</h1>
        <p class="text-xs text-slate-400">Enterprise AI Swarm & Campaign Governance Engine</p>
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-slate-300 font-medium">9Router Gateway: <span class="text-emerald-400">Connected</span></span>
      </div>
      <button onclick="runSimulation()" id="runBtn" class="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-sky-500/25 transition-all flex items-center space-x-2 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span id="btnText">Executar Swarm de Especialistas</span>
      </button>
    </div>
  </header>

  <!-- Main Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
      <div class="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="relative z-10 max-w-3xl">
        <span class="text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">Autonomous Multi-Agent Swarm V2</span>
        <h2 class="text-2xl font-bold text-white mt-3">Inteligência Estratégica em Tempo Real</h2>
        <p class="text-slate-300 text-sm mt-2 leading-relaxed">
          O sistema combina regras determinísticas estritas, isolamento multi-tenant (RLS) e raciocínio de LLM via 9Router para auditar, estruturar e propor campanhas de alta performance sem alucinações de dados ou geração autônoma de ativos.
        </p>
      </div>
    </div>

    <!-- Empty State / Loading / Results -->
    <div id="loading" class="hidden flex flex-col items-center justify-center py-20 space-y-4">
      <div class="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-slate-400 text-sm font-medium animate-pulse" id="loadingStatus">A inicializar contexto e disparar especialistas...</p>
    </div>

    <div id="results" class="hidden space-y-6">
      <!-- Top Metrics Bar -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 font-medium">Confidence Score</p>
            <h3 class="text-2xl font-bold text-white mt-1" id="metricConfidence">--</h3>
          </div>
          <div class="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 font-medium">Campaign Audit</p>
            <h3 class="text-2xl font-bold text-white mt-1" id="metricAudit">--</h3>
          </div>
          <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400" id="auditIconContainer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 font-medium">Orchestrator Status</p>
            <h3 class="text-2xl font-bold text-white mt-1">Ready for Review</h3>
          </div>
          <div class="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 font-medium">Especialistas Ativos</p>
            <h3 class="text-2xl font-bold text-white mt-1">7 / 7 Swarm</h3>
          </div>
          <div class="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </div>
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
            <span class="text-slate-400 text-xs block font-medium">Orçamento Planeado</span>
            <div class="text-lg font-bold text-white mt-1" id="proposalBudget">--</div>
          </div>
          <div class="bg-slate-950/50 p-4 rounded-xl border border-slate-800/60">
            <span class="text-slate-400 text-xs block font-medium">KPI Principal & Alvo</span>
            <div class="text-lg font-bold text-emerald-400 mt-1" id="proposalKpi">--</div>
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
          <span class="text-xs font-normal px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded-full">7 Agentes</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="specialistsGrid">
          <!-- Dinâmico via JS -->
        </div>
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
      btnText.innerText = 'A processar swarm...';
      loading.classList.remove('hidden');
      results.classList.add('hidden');

      try {
        const contextRes = await fetch('/context');
        const context = await contextRes.json();

        const res = await fetch('/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(context)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro no servidor');

        // Preencher Métricas
        const p = data.proposal;
        document.getElementById('metricConfidence.innerHTML').innerHTML = ''; // safe
        document.getElementById('metricConfidence').innerText = p.confidence.confidenceScore + '% (' + p.confidence.confidenceBand + ')';
        document.getElementById('metricAudit').innerText = p.auditResult.status;

        const auditBadge = document.getElementById('metricAudit');
        if (p.auditResult.status === 'PASS') {
          auditBadge.className = 'text-2xl font-bold text-emerald-400 mt-1';
        } else {
          auditBadge.className = 'text-2xl font-bold text-amber-400 mt-1';
        }

        document.getElementById('proposalName').innerText = p.name;
        document.getElementById('proposalPlatform').innerText = p.platform || 'META_ADS';
        document.getElementById('proposalBudget').innerText = p.budget ? 'R$ ' + p.budget.daily + ' / dia (Total: R$ ' + p.budget.total + ')' : 'Não definido';
        document.getElementById('proposalKpi').innerText = (p.primaryKpi || 'ROAS') + ' (Teto CPA: R$ ' + (p.targetCpaOrCpl || 'N/A') + ')';
        document.getElementById('proposalCreative').innerText = p.creativeDirection ? p.creativeDirection.format + ' — ' + p.creativeDirection.concept : 'N/A';

        // Renderizar Especialistas
        const grid = document.getElementById('specialistsGrid');
        grid.innerHTML = data.analyses.map(a => \`
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
            <div>
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-bold text-white text-base">\${a.specialist}</h4>
                <span class="text-xs font-semibold px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">\${a.recommendations.length} Recs</span>
              </div>
              <div class="space-y-2">
                <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Observações</p>
                <ul class="text-xs text-slate-300 space-y-1 pl-4 list-disc marker:text-sky-500">
                  \${a.observations.map(o => '<li>' + o + '</li>').join('')}
                </ul>
              </div>
            </div>

            <div class="border-t border-slate-800/80 pt-3">
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recomendações Principais</p>
              <div class="space-y-2">
                \${a.recommendations.slice(0, 2).map(r => \`
                  <div class="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50 text-xs">
                    <div class="font-semibold text-sky-300">\${r.title}</div>
                    <div class="text-slate-400 mt-0.5 line-clamp-2">\${r.description}</div>
                  </div>
                \`).join('')}
              </div>
            </div>
          </div>
        \`).join('');

        loading.classList.add('hidden');
        results.classList.remove('hidden');

      } catch (err) {
        alert('Erro ao executar simulação: ' + err.message);
        loading.classList.add('hidden');
      } finally {
        btn.disabled = false;
        btnText.innerText = 'Executar Swarm de Especialistas';
      }
    }

    // Auto-run on load for immediate delight
    window.addEventListener('DOMContentLoaded', () => {
      runSimulation();
    });
  </script>
</body>
</html>`);
});

app.get('/context', (req, res) => {
  res.json(TEST_FIXTURE_CONTEXT);
});

app.post('/demo', async (req, res) => {
  try {
    const context: SpecialistContext = req.body;
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

    const analyses: SpecialistAnalysis[] = [];
    for (const agent of agents) {
      const result = await runtime.executeSpecialist({
        organizationId: context.organization || 'demo-org',
        specialist: agent.getRole() as any,
        capability: 'FAST_ANALYSIS',
        context,
        validEvidenceIds: (context.marketResearch || []).map(r => r.id)
      });
      // Convert SpecialistLLMOutput to SpecialistAnalysis domain model safely
      const llmOut: SpecialistLLMOutput = result.output;
      const specialistReport: SpecialistAnalysis = {
        specialist: agent.getRole(),
        observations: [...llmOut.facts, ...llmOut.inferences],
        evidence: llmOut.evidenceIds,
        structuredEvidence: [],
        hypotheses: [],
        recommendations: llmOut.recommendations.map((r, idx) => ({
          id: `rec_${Date.now()}_${idx}`,
          type: (r.type.toUpperCase() as any) || 'BUDGET',
          title: r.title,
          description: r.description,
          specialist: agent.getRole(),
          priority: r.priority,
          evidence: llmOut.evidenceIds,
          hypothesisIds: [],
          confidence: 85,
          expectedImpact: r.expectedImpact,
          risk: r.risk,
          status: 'PROPOSED',
          createdAt: new Date().toISOString(),
          classification: r.classification
        })),
        risks: llmOut.risks,
        contradictions: [],
        confidence: ConfidenceEngine.calculateConfidence(context, false, llmOut.evidenceIds.length, 0),
        dataQuality: {
          grade: 'GOOD',
          availableData: Object.keys(context),
          missingData: llmOut.missingData,
          potentiallyOutdatedData: [],
          conflictingSources: []
        },
        missingData: llmOut.missingData,
        createdAt: new Date().toISOString()
      };
      analyses.push(specialistReport);
    }

    const overallConfidence = ConfidenceEngine.calculateConfidence(context, false, analyses.reduce((acc, a) => acc + a.evidence.length, 0), 0);
    const proposal = CampaignProposalBuilder.build(context, analyses, overallConfidence);

    res.json({ proposal, analyses });
  } catch (e: any) {
    console.error('Dashboard error:', e);
    res.status(500).json({ error: e.message || 'Internal error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ADS Intelligence Dashboard enterprise ativo em: http://localhost:${PORT}`);
});
