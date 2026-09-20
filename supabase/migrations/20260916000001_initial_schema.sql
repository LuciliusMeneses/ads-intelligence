/**
 * ADS INTELLIGENCE — Initial PostgreSQL / Supabase Migration
 * Multi-Tenant Architecture, RLS Policies, Tables, Indexes, and Audit Triggers.
 */

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Organizations
create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Organization Members
create table if not exists organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'ANALYST' check (role in ('OWNER', 'ADMIN', 'MANAGER', 'ANALYST', 'VIEWER')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

-- 3. Brands
create table if not exists brands (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  website text,
  industry text,
  country text not null default 'BR',
  currency text not null default 'BRL',
  timezone text not null default 'America/Sao_Paulo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Ad Accounts
create table if not exists ad_accounts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  brand_id uuid not null references brands(id) on delete cascade,
  platform text not null check (platform in ('META', 'GOOGLE')),
  external_account_id text not null,
  name text not null,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Product / Service
create table if not exists product_services (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  brand_id uuid not null references brands(id) on delete cascade,
  type text not null check (type in ('PRODUCT', 'SERVICE')),
  name text not null,
  description text,
  current_price numeric(12, 2),
  currency text not null default 'BRL',
  cost numeric(12, 2),
  margin numeric(5, 2),
  average_ticket numeric(12, 2),
  target_cac numeric(12, 2),
  landing_url text,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Campaigns
create table if not exists campaigns (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  brand_id uuid not null references brands(id) on delete cascade,
  ad_account_id uuid references ad_accounts(id) on delete set null,
  product_service_id uuid references product_services(id) on delete set null,
  name text not null,
  platform text not null,
  objective text not null,
  status text not null default 'DRAFT',
  approval_state text not null default 'DRAFT' check (approval_state in (
    'DRAFT', 'ANALYZING', 'RECOMMENDED', 'WAITING_CREATIVE', 'READY_FOR_REVIEW',
    'CHANGES_REQUESTED', 'APPROVED', 'REJECTED', 'PUBLISHED', 'PAUSED', 'COMPLETED'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. Campaign Proposals (Versioned)
create table if not exists campaign_proposals (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  version integer not null default 1,
  proposal_data jsonb not null,
  confidence_score numeric(5, 2) not null,
  confidence_band text not null,
  audit_status text not null check (audit_status in ('PASS', 'PASS_WITH_WARNINGS', 'BLOCKED')),
  created_by uuid,
  created_at timestamptz not null default now(),
  unique (campaign_id, version)
);

-- 8. Hypotheses
create table if not exists hypotheses (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  specialist text not null,
  statement text not null,
  confidence numeric(5, 2) not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. Recommendations
create table if not exists recommendations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  proposal_id uuid references campaign_proposals(id) on delete cascade,
  specialist text not null,
  type text not null,
  title text not null,
  description text not null,
  priority text not null check (priority in ('HIGH', 'MEDIUM', 'LOW')),
  confidence numeric(5, 2) not null,
  expected_impact text,
  risk text,
  status text not null default 'PROPOSED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. Recommendation Evidence
create table if not exists recommendation_evidence (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  recommendation_id uuid references recommendations(id) on delete cascade,
  hypothesis_id uuid references hypotheses(id) on delete cascade,
  source_type text not null,
  source_reference text not null,
  observed_at timestamptz,
  evidence text not null,
  weight numeric(5, 2) not null default 1.0,
  confidence numeric(5, 2) not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- 11. Human Decisions (Append-Only)
create table if not exists human_decisions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  recommendation_id uuid not null references recommendations(id) on delete cascade,
  user_id uuid not null,
  decision text not null check (decision in ('ACCEPT', 'REJECT', 'MODIFY')),
  original_recommendation jsonb not null,
  modified_value jsonb,
  reason text,
  created_at timestamptz not null default now()
);

-- 12. Contradictions
create table if not exists contradictions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  specialist_a text not null,
  specialist_b text not null,
  position_a text not null,
  position_b text not null,
  impact text not null,
  resolution text not null check (resolution in ('RESOLVE', 'REQUEST_MORE_DATA', 'ESCALATE_TO_HUMAN')),
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- 13. Campaign Audits
create table if not exists campaign_audits (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  proposal_id uuid references campaign_proposals(id) on delete cascade,
  status text not null check (status in ('PASS', 'PASS_WITH_WARNINGS', 'BLOCKED')),
  blockers text[] default array[]::text[],
  warnings text[] default array[]::text[],
  observations text[] default array[]::text[],
  created_at timestamptz not null default now()
);

-- 14. Creative Directions
create table if not exists creative_directions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  proposal_id uuid references campaign_proposals(id) on delete cascade,
  format text not null,
  aspect_ratio text not null,
  duration integer,
  concept text not null,
  hook_direction text not null,
  message text not null,
  narrative_structure text not null,
  cta text not null,
  testing_variations integer not null default 1,
  reasoning text,
  confidence numeric(5, 2) not null,
  created_at timestamptz not null default now()
);

-- 15. Creative Assets (External files)
create table if not exists creative_assets (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  creative_direction_id uuid references creative_directions(id) on delete set null,
  asset_type text not null check (asset_type in ('IMAGE', 'VIDEO', 'CAROUSEL')),
  storage_reference text not null,
  filename text not null,
  mime_type text not null,
  status text not null default 'PENDING',
  uploaded_by uuid,
  created_at timestamptz not null default now()
);

-- 16. Performance Snapshots (Idempotent per campaign + timestamp)
create table if not exists performance_snapshots (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  captured_at timestamptz not null,
  spend numeric(12, 2),
  impressions bigint,
  reach bigint,
  clicks bigint,
  ctr numeric(5, 2),
  cpc numeric(10, 2),
  cpm numeric(10, 2),
  leads integer,
  conversions integer,
  cpl numeric(10, 2),
  cpa numeric(10, 2),
  revenue numeric(12, 2),
  roas numeric(6, 2),
  frequency numeric(5, 2),
  metadata jsonb,
  created_at timestamptz not null default now(),
  unique (campaign_id, captured_at)
);

-- 17. Learning Records
create table if not exists learning_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  brand_id uuid references brands(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete cascade,
  hypothesis_id uuid references hypotheses(id) on delete set null,
  recommendation_id uuid references recommendations(id) on delete set null,
  human_decision_id uuid references human_decisions(id) on delete set null,
  summary text not null,
  outcome text not null,
  metrics_before jsonb,
  metrics_after jsonb,
  lesson text not null,
  confidence numeric(5, 2) not null,
  created_at timestamptz not null default now()
);

-- 18. Research Sources
create table if not exists research_sources (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  brand_id uuid references brands(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete cascade,
  source_type text not null,
  title text not null,
  url text,
  publisher text,
  published_at timestamptz,
  observed_at timestamptz not null default now(),
  relevance text not null check (relevance in ('HIGH', 'MEDIUM', 'LOW')),
  confidence numeric(5, 2) not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- 19. Technical Audit Logs
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid,
  entity_type text not null,
  entity_id uuid not null,
  action text not null check (action in ('CREATE', 'UPDATE', 'APPROVAL', 'REJECTION', 'MODIFICATION', 'STATUS_CHANGE')),
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);


--------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) & MULTI-TENANT ISOLATION
--------------------------------------------------------------------------------

-- Helper function to check if current auth.uid() is a member of the organization
create or replace function public.is_org_member(org_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from organization_members
    where organization_id = org_id
      and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Enable RLS on all tables
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table brands enable row level security;
alter table ad_accounts enable row level security;
alter table product_services enable row level security;
alter table campaigns enable row level security;
alter table campaign_proposals enable row level security;
alter table hypotheses enable row level security;
alter table recommendations enable row level security;
alter table recommendation_evidence enable row level security;
alter table human_decisions enable row level security;
alter table contradictions enable row level security;
alter table campaign_audits enable row level security;
alter table creative_directions enable row level security;
alter table creative_assets enable row level security;
alter table performance_snapshots enable row level security;
alter table learning_records enable row level security;
alter table research_sources enable row level security;
alter table audit_logs enable row level security;

-- RLS Policies for Organizations
create policy "Users can view organizations they belong to"
  on organizations for select
  using (id in (select organization_id from organization_members where user_id = auth.uid()));

-- RLS Policies for Organization Members
create policy "Members can view organization members"
  on organization_members for select
  using (public.is_org_member(organization_id));

-- Generic macro policy creator for tenant-isolated tables
-- (Applies to all tables containing organization_id)

create policy "Tenant isolation policy for brands" on brands
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for ad_accounts" on ad_accounts
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for product_services" on product_services
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for campaigns" on campaigns
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for campaign_proposals" on campaign_proposals
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for hypotheses" on hypotheses
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for recommendations" on recommendations
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for recommendation_evidence" on recommendation_evidence
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for human_decisions" on human_decisions
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for contradictions" on contradictions
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for campaign_audits" on campaign_audits
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for creative_directions" on creative_directions
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for creative_assets" on creative_assets
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for performance_snapshots" on performance_snapshots
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for learning_records" on learning_records
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for research_sources" on research_sources
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "Tenant isolation policy for audit_logs" on audit_logs
  for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
