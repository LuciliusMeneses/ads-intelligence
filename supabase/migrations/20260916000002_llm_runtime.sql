/**
 * ADS INTELLIGENCE — Migration 02: LLM Runtime & Execution Tracking
 * Tables for LLM execution persistence, token/cost observability, and Prompt Registry.
 */

-- 1. Prompt Registry Table
create table if not exists prompt_registry (
  id uuid primary key default uuid_generate_v4(),
  prompt_id text not null,
  specialist text not null,
  version text not null,
  system_prompt text not null,
  output_schema_version text not null default 'v1',
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'DEPRECATED', 'DRAFT')),
  created_at timestamptz not null default now(),
  unique (prompt_id, version)
);

-- 2. LLM Executions Table (Observability, Tokens, Latency, Cost)
create table if not exists llm_executions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  specialist text not null,
  prompt_id text not null,
  prompt_version text not null,
  provider text not null default '9router',
  model text not null,
  request_started_at timestamptz not null,
  request_completed_at timestamptz not null,
  latency_ms integer not null,
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  estimated_cost numeric(10, 6),
  status text not null check (status in ('SUCCESS', 'FAILED', 'TIMEOUT', 'INVALID_OUTPUT')),
  error_code text,
  output_schema_version text not null default 'v1',
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table prompt_registry enable row level security;
alter table llm_executions enable row level security;

-- Policies
create policy "Public read prompt registry" on prompt_registry
  for select using (true);

create policy "Tenant isolation policy for llm_executions" on llm_executions
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
