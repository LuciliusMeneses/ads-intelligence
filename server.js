/**
 * ADS INTELLIGENCE — Enterprise Full-Stack System with Financial Guard & Investment Security Center
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const PROTOTYPES_DIR = path.join(__dirname, 'dashboard_inteligente');

function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...val] = trimmed.split('=');
        process.env[key.trim()] = val.join('=').trim();
      }
    }
  }
}
loadEnv();

const SUPPORTED_CURRENCIES = {
  BRL: { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro', locale: 'pt-BR', rateToUSD: 0.18 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US', rateToUSD: 1.0 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE', rateToUSD: 1.08 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB', rateToUSD: 1.28 }
};

class CurrencyEngine {
  static format(amount, currency = 'BRL') {
    const config = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.BRL;
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  static convert(amount, from, to) {
    if (from === to) return amount;
    const fromConfig = SUPPORTED_CURRENCIES[from] || SUPPORTED_CURRENCIES.BRL;
    const toConfig = SUPPORTED_CURRENCIES[to] || SUPPORTED_CURRENCIES.BRL;
    const amountInUSD = amount * fromConfig.rateToUSD;
    return amountInUSD / toConfig.rateToUSD;
  }
}

const isSupabaseLive = process.env.SUPABASE_URL &&
  !process.env.SUPABASE_URL.includes('your-supabase-url') &&
  process.env.SUPABASE_SERVICE_ROLE_KEY &&
  !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('your-supabase');

let supabaseClient = null;
if (isSupabaseLive) {
  try {
    supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('✅ Supabase PostgreSQL Real Conectado:', process.env.SUPABASE_URL);
  } catch (e) {
    console.warn('⚠️ Falha ao inicializar Supabase live. A utilizar base de dados em memória.');
  }
}

// State & Database Store with Financial Security Guard Rules
let systemState = {
  organization: 'org_acme_corp',
  organizationName: 'Acme Growth Corp',
  currency: 'BRL',
  user: {
    name: 'Guilherme Salles',
    email: 'guilherme.salles@growthops.ai',
    role: 'Chief Marketing Officer'
  },
  productOrService: 'Software de Automação de Vendas B2B',
  businessObjective: 'Escalar receita recorrente com CAC sustentável',
  campaignObjective: 'CONVERSIONS',
  currentPrice: 197,
  margin: 65,
  averageTicket: 197,
  targetCac: 42,
  performanceMetrics: {
    spend: 18840,
    roas: 4.2,
    ctr: 1.8,
    cpc: 2.10,
    cpa: 42.00,
    cvr: 2.4,
    revenue: 79128,
    leads: 448
  },
  audiences: ['Empreendedores B2B', 'Gestores de Tráfego', 'CEOs SaaS'],
  geography: ['Brasil (Sudeste e Sul)'],
  landingDestination: 'https://acmegrowth.com/oferta',
  budgetConstraints: {
    dailyMax: 628,
    totalBudget: 18840,
    maxAllowableDailySpike: 1000,
    circuitBreakerActive: true,
    emergencyKillSwitch: false
  },
  approvalState: 'READY_FOR_REVIEW',
  marketResearch: [
    { id: 'ref_1', source: 'Meta Ads Library', foundInfo: 'Concorrente A escalou 12 criativos em vídeo 9:16 com gancho de dor direta.', conclusion: 'Formato vertical é dominante no setor.', confidenceLevel: 95 },
    { id: 'ref_2', source: 'Google Trends', foundInfo: 'Busca pelo termo "Automação de Vendas" subiu 34% em SP e RJ.', conclusion: 'Demanda aquecida no Sudeste.', confidenceLevel: 90 }
  ]
};

let db = {
  campaigns: [
    {
      id: 'camp_001',
      organizationId: 'org_acme_101',
      name: 'Campanha Q4 — Escalabilidade B2B',
      platform: 'META_ADS',
      objective: 'CONVERSIONS',
      approvalState: 'READY_FOR_REVIEW',
      status: 'ACTIVE',
      budgetDaily: 628,
      budgetTotal: 18840,
      targetCac: 42,
      roasCurrent: 4.2,
      spendCurrent: 15000,
      revenueCurrent: 63000,
      createdAt: new Date().toISOString()
    }
  ],
  financialLedger: [
    { id: 'tx_1', timestamp: '2026-09-19 10:00', type: 'SPEND', channel: 'Meta Ads', amount: 628.00, status: 'VERIFIED', roas: 4.2 },
    { id: 'tx_2', timestamp: '2026-09-19 09:00', type: 'SPEND', channel: 'Google Ads', amount: 310.00, status: 'VERIFIED', roas: 3.8 },
    { id: 'tx_3', timestamp: '2026-09-18 23:59', type: 'REVENUE', channel: 'Checkout B2B', amount: 3450.00, status: 'SETTLED', roas: 0 }
  ],
  guardAlerts: [
    { id: 'al_1', timestamp: '2026-09-19 08:30', level: 'INFO', message: 'Circuit Breaker ativo: Variação de leilão estável dentro do limite de 10%.' }
  ]
};

// Swarm Execution Engine
function runSpecialistSwarm(context) {
  const currency = context.currency || 'BRL';
  const dailyBudget = context.budgetConstraints.dailyMax;
  const roas = context.performanceMetrics.roas;

  const formattedDaily = CurrencyEngine.format(dailyBudget, currency);
  const formattedSpike = CurrencyEngine.format(context.budgetConstraints.maxAllowableDailySpike, currency);
  const formattedPrice = CurrencyEngine.format(context.currentPrice, currency);
  const formattedCac = CurrencyEngine.format(context.targetCac, currency);

  // Verificação de Segurança Financeira (Circuit Breaker)
  if (dailyBudget > context.budgetConstraints.maxAllowableDailySpike) {
    throw new Error(`[Financial Guard Violation] O orçamento diário de ${formattedDaily} excede o limite rígido de segurança financeira (${formattedSpike}). Ação bloqueada pelo Circuit Breaker.`);
  }

  const analyses = [
    {
      specialist: 'MARKET_INTELLIGENCE',
      role: 'Análise de Mercado & Concorrência',
      status: 'SUCCESS',
      observations: ['Analisadas ' + context.marketResearch.length + ' fontes de mercado validadas.', 'Dominância do formato de vídeo vertical (9:16).'],
      recommendations: [{ title: 'Monitoramento Semanal de Leilão', description: 'Rastrear novos criativos.', priority: 'HIGH' }]
    },
    {
      specialist: 'AUDIENCE_STRATEGIST',
      role: 'Estratégia de Públicos & Segmentação',
      status: 'SUCCESS',
      observations: ['Públicos-alvo ativos: ' + context.audiences.join(', ') + '.'],
      recommendations: [{ title: 'Ativar Segmentação Broad', description: 'Direcionar verba para público amplo.', priority: 'HIGH' }]
    },
    {
      specialist: 'MEDIA_STRATEGIST',
      role: 'Alocação de Mídia & Funil',
      status: 'SUCCESS',
      observations: ['Orçamento diário: ' + formattedDaily + '/dia protegido pelo Financial Guard.'],
      recommendations: [{ title: 'Distribuição Orçamentária 70/30', description: 'Separar conjuntos de aquisição e remarketing.', priority: 'HIGH' }]
    },
    {
      specialist: 'PERFORMANCE_ANALYST',
      role: 'Análise de Performance & Métricas',
      status: 'SUCCESS',
      observations: ['ROAS atual em ' + roas + 'x (acima da meta de 3.0x).'],
      recommendations: [{ title: 'Escala Controlada de Verba', description: 'Incrementar orçamento em 15% a cada 48h.', priority: 'MEDIUM' }]
    },
    {
      specialist: 'OFFER_STRATEGIST',
      role: 'Precificação, Margem & CAC',
      status: 'SUCCESS',
      observations: ['Preço de ' + formattedPrice + ' com margem de ' + context.margin + '%.', 'Teto de CAC sustentável de ' + formattedCac + '.'],
      recommendations: [{ title: 'Preservar Política de Preço', description: 'Manter preço sem descontos.', priority: 'HIGH' }]
    },
    {
      specialist: 'CREATIVE_STRATEGIST',
      role: 'Direção Criativa (Sem Geração Final)',
      status: 'SUCCESS',
      observations: ['REGRA DE GOVERNANÇA: Sem geração de imagem/vídeo por IA.'],
      recommendations: [{ title: 'Briefing Vídeo Vertical 9:16', description: 'Produzir ganchos de dor imediata.', priority: 'HIGH' }]
    },
    {
      specialist: 'ORCHESTRATOR',
      role: 'Orquestração Swarm & Governança',
      status: 'SUCCESS',
      observations: ['Swarm executado com segurança financeira garantida.', 'Confidence Score: 89% (HIGH).'],
      recommendations: [{ title: 'Submeter ao Human Approval Gate', description: 'Aprovação mandatória antes de publicar.', priority: 'HIGH' }]
    }
  ];

  const proposal = {
    id: 'prop_enterprise_' + Date.now(),
    name: 'Campanha Q4 — ' + (context.organizationName || 'Acme Growth'),
    platform: 'META_ADS',
    objective: context.campaignObjective,
    budget: { daily: context.budgetConstraints.dailyMax, total: context.budgetConstraints.totalBudget, currency },
    targetCpaOrCpl: context.targetCac,
    primaryKpi: 'ROAS / Conversões',
    approvalState: context.approvalState,
    confidence: { confidenceScore: 89, confidenceBand: 'HIGH', explanation: 'Confidence Engine V2: 8 componentes validados.' },
    auditResult: { status: 'PASS', blockers: [], warnings: [], observations: ['Financial Guard & Circuit Breaker verificados com sucesso.'] },
    creativeDirection: { format: 'VIDEO_9_16', concept: 'Dor Imediata e Quebra de Padrão em 3s' }
  };

  return { proposal, analyses };
}

// Helper para injetar links de navegação e rota financeira nos protótipos HTML
function patchHtmlForLiveRoutes(rawHtml, activePage) {
  let html = rawHtml;

  html = html.replace(/href="#overview"/g, 'href="/"');
  html = html.replace(/href="#campaigns"/g, 'href="/campaigns"');
  html = html.replace(/href="#crm"/g, 'href="/crm"');
  html = html.replace(/href="#competitors"/g, 'href="/competitors"');
  html = html.replace(/href="#automations"/g, 'href="/automations"');
  html = html.replace(/href="#settings"/g, 'href="/settings"');

  // Adicionar o item 'Área Financeira' no menu lateral se não existir
  if (!html.includes('href="/finance"')) {
    const financeNavItem = `
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant dark:text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-highest/50 transition-colors duration-150 active:scale-[0.98]" href="/finance">
        <span class="material-symbols-outlined text-[20px]" data-icon="account_balance_wallet">account_balance_wallet</span>
        <span>Área Financeira</span>
      </a>
    `;
    html = html.replace('</nav>', financeNavItem + '\n</nav>');
  }

  // Adicionar o item 'Ajuda & Manual'
  if (!html.includes('href="/help"')) {
    const helpNavItem = `
      <a class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant dark:text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-highest/50 transition-colors duration-150 active:scale-[0.98]" href="/help">
        <span class="material-symbols-outlined text-[20px]" data-icon="help_center">help</span>
        <span>Ajuda &amp; Manual</span>
      </a>
    `;
    html = html.replace('</nav>', helpNavItem + '\n</nav>');
  }

  // Adicionar seletor de moeda
  const currencySelector = `
    <div class="mt-6 px-3">
      <label class="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Moeda do Sistema</label>
      <select id="currencySelector" onchange="changeCurrency(this.value)" class="w-full mt-1 bg-surface-container-high border-slate-700 text-xs text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500">
        <option value="BRL">BRL (R$)</option>
        <option value="USD">USD ($)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
      </select>
    </div>
    <script>
      const SUPPORTED_CURRENCIES = {
        BRL: { code: 'BRL', symbol: 'R$', locale: 'pt-BR' },
        USD: { code: 'USD', symbol: '$', locale: 'en-US' },
        EUR: { code: 'EUR', symbol: '€', locale: 'de-DE' },
        GBP: { code: 'GBP', symbol: '£', locale: 'en-GB' }
      };

      window.AdsCurrency = {
        current: 'BRL',
        config: SUPPORTED_CURRENCIES['BRL'],
        format: function(amount) {
          return new Intl.NumberFormat(this.config.locale, {
            style: 'currency',
            currency: this.config.code,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }
      };

      async function changeCurrency(currency) {
        await fetch('/api/currency', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({currency}) });
        window.location.reload();
      }
      async function initCurrency() {
        const res = await fetch('/api/currency');
        const data = await res.json();
        window.AdsCurrency.current = data.currentCurrency;
        window.AdsCurrency.config = SUPPORTED_CURRENCIES[data.currentCurrency];
        if(document.getElementById('currencySelector')) document.getElementById('currencySelector').value = data.currentCurrency;
        // Trigger potential UI updates that depend on window.AdsCurrency
        document.dispatchEvent(new CustomEvent('currency-loaded', { detail: window.AdsCurrency }));
      }
      window.addEventListener('DOMContentLoaded', initCurrency);
    </script>
  `;
  html = html.replace('</nav>', '</nav>' + currencySelector);

  return html;
}

// Gerar a Página da Área Financeira & Segurança de Investimento
function renderFinancePage() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>GrowthOps AI - Área Financeira (Google Ads Style)</title>
  <link href="https://fonts.googleapis.com" rel="preconnect"/>
  <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="/google-ads-theme.js"></script>
  <script>
    tailwind.config = window.googleAdsTailwindConfig;
  </script>
</head>
<body class="bg-google-bg text-google-text font-sans antialiased min-h-screen">
  <!-- SIDE NAVIGATION (Material 3 Rail) -->
  <aside class="w-64 fixed h-screen z-40 bg-google-bg border-r border-google-outline flex flex-col p-4">
    <div class="px-2 pt-2 mb-8">
      <div class="text-lg font-bold text-google-text flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-google-primary flex items-center justify-center text-white">
          <span class="material-symbols-outlined">auto_mode</span>
        </div>
        <span>GrowthOps AI</span>
      </div>
    </div>
    <nav class="flex flex-col gap-1">
      <a class="flex items-center gap-3 px-4 py-2 rounded-full text-google-text hover:bg-google-outline/50 transition" href="/">
        <span class="material-symbols-outlined">dashboard</span><span>Visão Geral</span>
      </a>
      <a class="flex items-center gap-3 px-4 py-2 rounded-full text-google-text hover:bg-google-outline/50 transition" href="/campaigns">
        <span class="material-symbols-outlined">auto_mode</span><span>Campanhas IA</span>
      </a>
      <a class="flex items-center gap-3 px-4 py-2 rounded-full bg-google-primary/10 text-google-primary font-bold border-l-4 border-google-primary" href="/finance">
        <span class="material-symbols-outlined">account_balance_wallet</span><span>Área Financeira</span>
      </a>
      <a class="flex items-center gap-3 px-4 py-2 rounded-full text-google-text hover:bg-google-outline/50 transition" href="/help">
        <span class="material-symbols-outlined">help</span><span>Ajuda</span>
      </a>
    </nav>
  </aside>

  <!-- MAIN CANVAS -->
  <div class="pl-64 flex flex-col flex-1 w-full">
    <header class="bg-white border-b border-google-outline px-8 py-4 flex items-center justify-between">
      <h1 class="text-xl font-medium text-google-text">Área Financeira (Financial Guard V2)</h1>
      <button onclick="openBudgetModal()" class="px-4 py-2 bg-google-primary text-white rounded-full font-medium hover:bg-google-primaryHover transition">Configurar Limites</button>
    </header>

    <main class="p-8 space-y-8 max-w-7xl mx-auto">
      <!-- Top Financial Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white border border-google-outline p-6 rounded-xl shadow-sm">
          <p class="text-xs text-google-textSecondary uppercase tracking-wide">Investimento (Mês)</p>
          <h3 class="text-2xl font-bold text-google-text mt-1" id="finSpend">R$ 18.840,00</h3>
        </div>
        <div class="bg-white border border-google-outline p-6 rounded-xl shadow-sm">
          <p class="text-xs text-google-textSecondary uppercase tracking-wide">Receita</p>
          <h3 class="text-2xl font-bold text-google-success mt-1" id="finRevenue">R$ 79.128,00</h3>
        </div>
        <div class="bg-white border border-google-outline p-6 rounded-xl shadow-sm">
          <p class="text-xs text-google-textSecondary uppercase tracking-wide">Teto Diário</p>
          <h3 class="text-2xl font-bold text-google-text mt-1" id="finMaxSpike">R$ 1.000,00</h3>
        </div>
        <div class="bg-white border border-google-outline p-6 rounded-xl shadow-sm">
          <p class="text-xs text-google-textSecondary uppercase tracking-wide">Status</p>
          <h3 class="text-2xl font-bold text-google-success mt-1">PROTEGIDO</h3>
        </div>
      </div>

      <!-- Ledger Table (Material Design Style) -->
      <div class="bg-white border border-google-outline rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-bold text-google-text mb-4">Livro-Razão Financeiro</h3>
        <table class="w-full text-left">
          <thead class="border-b border-google-outline text-google-textSecondary text-xs uppercase">
            <tr><th class="p-3">Timestamp</th><th class="p-3">Tipo</th><th class="p-3">Montante</th></tr>
          </thead>
          <tbody id="ledgerTableBody" class="text-sm"></tbody>
        </table>
      </div>
    </main>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="/chart-helper.js"></script>
  <script>
    // ... (scripts to maintain functional parity)
  </script>
</body>
</html>`;
}

// HTTP Server & Router
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, 'http://localhost');
  let pathname = parsedUrl.pathname.toLowerCase();
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // APIs
  if (pathname === '/api/state' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const currency = systemState.currency || 'BRL';
    const state = JSON.parse(JSON.stringify(systemState));

    // Converter métricas para a moeda selecionada
    if (currency !== 'BRL') {
        state.performanceMetrics.spend = CurrencyEngine.convert(state.performanceMetrics.spend, 'BRL', currency);
        state.performanceMetrics.revenue = CurrencyEngine.convert(state.performanceMetrics.revenue, 'BRL', currency);
        state.budgetConstraints.dailyMax = CurrencyEngine.convert(state.budgetConstraints.dailyMax, 'BRL', currency);
        state.budgetConstraints.maxAllowableDailySpike = CurrencyEngine.convert(state.budgetConstraints.maxAllowableDailySpike, 'BRL', currency);
    }

    res.end(JSON.stringify({ systemState: state, dbSummary: { campaigns: db.campaigns.length, ledgerEntries: db.financialLedger.length } }));
    return;
  }

  if (pathname === '/api/currency' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      currentCurrency: systemState.currency || 'BRL',
      supportedCurrencies: SUPPORTED_CURRENCIES
    }));
    return;
  }

  if (pathname === '/api/currency' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        if (payload.currency && SUPPORTED_CURRENCIES[payload.currency]) {
          systemState.currency = payload.currency;
          db.guardAlerts.push({
            id: 'al_' + Date.now(),
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: `Moeda do sistema alterada para ${SUPPORTED_CURRENCIES[payload.currency].name} (${payload.currency})`
          });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, currency: systemState.currency }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Moeda não suportada.' }));
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  if (pathname === '/api/finance/ledger' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const currency = systemState.currency || 'BRL';
    const ledger = db.financialLedger.map(tx => ({
        ...tx,
        amount: CurrencyEngine.convert(tx.amount, 'BRL', currency)
    }));
    res.end(JSON.stringify(ledger));
    return;
  }

  if (pathname === '/api/finance/guard' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        if (payload.maxAllowableDailySpike) {
          systemState.budgetConstraints.maxAllowableDailySpike = Number(payload.maxAllowableDailySpike);
          db.guardAlerts.push({
            id: 'al_' + Date.now(),
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: `Circuito de segurança atualizado: Teto diário ajustado para R$ ${payload.maxAllowableDailySpike}`
          });
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, budgetConstraints: systemState.budgetConstraints }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  if (pathname === '/api/simulate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const result = runSpecialistSwarm(systemState);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, ...result, state: systemState }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ROTA DA ÁREA FINANCEIRA & SEGURANÇA DE INVESTIMENTO
  if (pathname === '/finance' || pathname === '/financeira' || pathname === '/wallet' || pathname === '/financeiro') {
    try {
      const rawHtml = fs.readFileSync(path.join(PROTOTYPES_DIR, 'finance.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(patchHtmlForLiveRoutes(rawHtml, 'Área Financeira'));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erro ao carregar Área Financeira: ' + e.message);
    }
    return;
  }

  // ROTA DO CENTRO DE AJUDA & MANUAL
  if (pathname === '/help' || pathname === '/ajuda' || pathname === '/manual') {
    try {
      const rawHtml = fs.readFileSync(path.join(PROTOTYPES_DIR, 'help.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(patchHtmlForLiveRoutes(rawHtml, 'Ajuda & Manual'));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erro ao carregar Ajuda: ' + e.message);
    }
    return;
  }

  // ROTAS DOS PROTÓTIPOS HTML
  if (pathname === '/' || pathname === '/overview' || pathname === '/vis_o_geral_do_dashboard_web.html' || pathname === '/dashboard') {
    try {
      const rawHtml = fs.readFileSync(path.join(PROTOTYPES_DIR, 'vis_o_geral_do_dashboard_web.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(patchHtmlForLiveRoutes(rawHtml, 'Visão Geral'));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erro ao carregar Visão Geral: ' + e.message);
    }
    return;
  }

  if (pathname === '/campaigns' || pathname === '/campanhas' || pathname === '/gest_o_de_campanhas_ia_web.html') {
    try {
      const rawHtml = fs.readFileSync(path.join(PROTOTYPES_DIR, 'gest_o_de_campanhas_ia_web.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(patchHtmlForLiveRoutes(rawHtml, 'Campanhas IA'));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erro ao carregar Campanhas IA: ' + e.message);
    }
    return;
  }

  if (pathname === '/crm' || pathname === '/pipeline' || pathname === '/leads' || pathname === '/crm_pipeline_de_leads_web.html') {
    try {
      const rawHtml = fs.readFileSync(path.join(PROTOTYPES_DIR, 'crm_pipeline_de_leads_web.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(patchHtmlForLiveRoutes(rawHtml, 'CRM & Pipeline'));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erro ao carregar CRM & Pipeline: ' + e.message);
    }
    return;
  }

  if (pathname === '/competitors' || pathname === '/concorrentes' || pathname === '/radar' || pathname === '/radar_de_concorrentes_web.html') {
    try {
      const rawHtml = fs.readFileSync(path.join(PROTOTYPES_DIR, 'radar_de_concorrentes_web.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(patchHtmlForLiveRoutes(rawHtml, 'Radar de Concorrentes'));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erro ao carregar Radar de Concorrentes: ' + e.message);
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Página não encontrada');
});

// Helper stub para a página de ajuda se chamada
function renderHelpPage() {
  return `<!DOCTYPE html><html class="dark" lang="pt"><head><meta charset="utf-8"/><title>Ajuda - ADS Intelligence</title><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-slate-950 text-slate-100 p-10"><h1 class="text-2xl font-bold">Centro de Ajuda & Manual</h1><p class="mt-2 text-slate-400">Consulte a documentação completa no sistema ou aceda a <a href="/" class="text-sky-400 underline">Visão Geral</a>.</p></body></html>`;
}

server.listen(PORT, '0.0.0.0', () => {
  console.log('================================================================');
  console.log('🚀 ADS INTELLIGENCE — ÁREA FINANCEIRA & FINANCIAL GUARD ATIVO');
  console.log('================================================================');
  console.log('🌐 Área Financeira (Financial Guard): http://localhost:' + PORT + '/finance');
  console.log('🌐 Visão Geral (Dashboard):          http://localhost:' + PORT + '/');
  console.log('🌐 Gestão de Campanhas IA:          http://localhost:' + PORT + '/campaigns');
  console.log('🌐 CRM & Pipeline de Leads:          http://localhost:' + PORT + '/crm');
  console.log('🌐 Radar de Concorrentes:           http://localhost:' + PORT + '/competitors');
  console.log('================================================================');
});
