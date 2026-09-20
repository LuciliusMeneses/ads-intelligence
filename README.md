# ADS INTELLIGENCE

Plataforma Profissional de Inteligência e Gestão de Publicidade Digital baseada em Equipa Virtual de Especialistas de IA.

---

## 1. Princípio Central

O **ADS INTELLIGENCE** não é apenas um dashboard de anúncios. Funciona como uma **equipa virtual de especialistas em publicidade** que analisa dados, pesquisa informação relevante, confronta hipóteses e apresenta campanhas e recomendações estruturadas para aprovação humana.

### O que a IA FAZ:
* Analisa campanhas e histórico de performance;
* Pesquisa mercado, concorrência e preços;
* Analisa públicos e sugere segmentações;
* Sugere orçamentos, estruturas de campanha, preços e ofertas;
* Escreve textos publicitários (copywriting);
* Sugere tipos, conceitos, formatos, hooks e abordagens de criativos;
* Identifica problemas, formula hipóteses e propõe testes;
* Prepara e audita campanhas;
* Aprende com resultados anteriores.

### O que a IA NÃO FAZ (Regra Crítica):
* **NÃO gera imagens publicitárias, vídeos publicitários ou peças gráficas finais.**
* O *Creative Strategist* apenas recomenda o tipo de criativo, conceito, formato, estrutura, mensagem, hook e abordagem. A produção final é externa.

---

## 2. Aprovação Humana Obrigatória (Approval Gate)

Nenhuma campanha pode ser publicada automaticamente. O fluxo rigoroso garante supervisão humana em pontos críticos:

```
[ANÁLISE] → [RECOMENDAÇÃO] → [CAMPANHA PROPOSTA] → [AUDITORIA] → [APROVAÇÃO HUMANA] → [PUBLICAÇÃO]
```

### Estados Mínimos da State Machine:
1. `DRAFT` — Rascunho inicial da campanha ou estratégia.
2. `ANALYZING` — Especialistas em recolha de dados e inteligência de mercado ativos.
3. `RECOMMENDED` — Recomendações consolidadas pelo Ads Orchestrator.
4. `WAITING_CREATIVE` — Aguardando produção externa de criativos baseada no spec do Creative Strategist.
5. `READY_FOR_REVIEW` — Campanha completa auditada e pronta para revisão humana.
6. `CHANGES_REQUESTED` — Alterações solicitadas pelo utilizador/revisor humano.
7. `APPROVED` — Aprovado por humano com autoridade.
8. `REJECTED` — Rejeitado com justificativa.
9. `PUBLISHED` — Ativo na plataforma de anúncios (Meta Ads / Google Ads).
10. `PAUSED` — Pausado por performance ou decisão estratégica.
11. `COMPLETED` — Ciclo concluído com análise de pós-performance.

---

## 3. Development Safety

Todas as alterações ao código ou documentação geradas por IA exigem obrigatoriamente uma revisão humana detalhada antes da integração (merge) no branch principal.

---

## 4. Arquitetura de Especialistas

### 1. Ads Orchestrator
Coordenador geral. Recebe contexto, distribui tarefas entre especialistas, recolhe análises, **detecta contradições**, **exige evidências**, consolida recomendações e produz a proposta final de campanha. Nunca aceita cegamente a primeira hipótese.

### 2. Market Intelligence
Responsável por mercado, tendências, concorrência, preços, posicionamento, procura e sazonalidade.
* **Obrigação**: Suporte para analisar pelo menos 5 referências recentes.
* **Regra de Ouro**: Nunca apresentar pesquisa simulada como pesquisa real. Cada referência guarda: `fonte`, `data`, `URL/referência`, `informação encontrada`, `relevância`, `conclusão`, `nível de confiança`.

### 3. Audience Strategist
Define localização, idade, interesses, broad targeting, remarketing, lookalikes, exclusões, intenção e estágio do funil. Toda audiência sugerida possui justificativa detalhada.

### 4. Media Strategist
Gerencia plataforma (primariamente Meta Ads, com arquitetura preparada para Google Ads), objetivo, estrutura, distribuição de orçamento, orçamento diário, duração, estratégias de aquisição/remarketing, placements e modelo de teste.

### 5. Performance Analyst
Monitoriza métricas (CTR, CPM, CPC, CPA, CPL, CVR, ROAS, frequência, spend, receita, leads, conversões), tendências e anomalias. **Nunca avalia métricas isoladamente.**

### 6. Offer Strategist
Gerencia preço, promoção, proposta de valor, ticket médio, margem, CAC máximo, break-even e posicionamento.
* **REGRA CRÍTICA DE PREÇOS**: Distingue obrigatoriamente:
  - `CURRENT_PRICE` (Preço Atual)
  - `MARKET_PRICE` (Preço de Mercado)
  - `AI_SUGGESTED_PRICE` (Preço Sugerido por IA com origem e justificativa)

### 7. Creative Strategist
Não gera criativos. Especifica: formato, duração, proporção, conceito, hook, abordagem, mensagem, estrutura narrativa, CTA e variações para testes.

---

## 5. Estrutura do Repositório

```
ads-intelligence/
├── package.json
├── README.md
├── src/
│   ├── types/
│   │   └── ads-intelligence.ts     # Tipos TypeScript do domínio
│   ├── state-machine/
│   │   └── approval-gate.ts        # Máquina de estados do Approval Gate
│   ├── orchestrator/
│   │   └── orchestrator.ts         # Orquestrador multi-agente e auditoria
│   └── experts/
│       ├── market-intelligence.ts  # Gestor de referências e mercado
│       └── offer-strategist.ts     # Gestor de preços (Current vs Market vs AI)
└── ads-intelligence-command-center.html # Dashboard interativo (Artifact)
```

© 2026 ADS INTELLIGENCE. Todos os direitos reservados.