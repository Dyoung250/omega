-- FORGIA Ω — Supabase Schema
-- Run this in the Supabase SQL Editor or via `supabase db push`

-- ============================================================
-- EXTENSIONS
-- ============================================================
extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  display_name text,
  company text,
  role text not null default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'User profiles extending Supabase Auth';

-- Trigger: auto-create profile on signup
-- See handle_new_user() function below

-- ============================================================
-- PROJECTS
-- ============================================================
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  thumbnail_url text,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.projects is 'Metalwork projects created by users';

-- ============================================================
-- SCENES
-- ============================================================
create table if not exists public.scenes (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null default 'Nuova Scena',
  hdri_preset text default 'studio',
  view_mode text default 'solid',
  camera_state jsonb default '{}',
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.scenes is '3D scenes within a project';

-- ============================================================
-- SCENE_OBJECTS
-- ============================================================
create table if not exists public.scene_objects (
  id uuid primary key default uuid_generate_v4(),
  scene_id uuid not null references public.scenes(id) on delete cascade,
  def_id text not null,
  name text not null,
  params jsonb not null default '{}',
  transform jsonb not null default '{"position":[0,0,0],"rotation":[0,0,0],"scale":[1,1,1]}',
  material text not null default 'ferro-battuto',
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.scene_objects is 'Parametric objects inside a scene';

-- ============================================================
-- MATERIALS (user custom materials)
-- ============================================================
create table if not exists public.materials (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null default 'pbr',
  properties jsonb not null default '{}',
  texture_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.materials is 'Custom materials defined by users';

-- ============================================================
-- AI SCANS
-- ============================================================
create table if not exists public.ai_scans (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  original_name text,
  thumbnail_url text,
  processed_image_url text,
  svg_url text,
  estimated_dimensions jsonb default '{}',
  estimated_weight numeric(10,2),
  structural_analysis jsonb default '{}',
  library_match jsonb default '{}',
  confidence numeric(5,2) default 0,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

comment on table public.ai_scans is 'AI scan results from rembg / OpenCV / Claude Vision';

-- ============================================================
-- SHARED_PROJECTS (collaboration)
-- ============================================================
create table if not exists public.shared_projects (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'viewer' check (role in ('viewer', 'editor', 'owner')),
  invited_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (project_id, user_id)
);

comment on table public.shared_projects is 'Project sharing / collaboration records';

-- ============================================================
-- PROJECT_VERSIONS (history)
-- ============================================================
create table if not exists public.project_versions (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  version_number int not null,
  label text,
  snapshot_json jsonb not null default '{}',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

comment on table public.project_versions is 'Versioned snapshots of projects';

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
-- -----------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply to all tables with updated_at
create trigger if not exists trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger if not exists trg_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger if not exists trg_scenes_updated_at
  before update on public.scenes
  for each row execute function public.set_updated_at();

create trigger if not exists trg_scene_objects_updated_at
  before update on public.scene_objects
  for each row execute function public.set_updated_at();

create trigger if not exists trg_materials_updated_at
  before update on public.materials
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
-- -----------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger if not exists trg_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- RLS ENABLE
-- ============================================================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.scenes enable row level security;
alter table public.scene_objects enable row level security;
alter table public.materials enable row level security;
alter table public.ai_scans enable row level security;
alter table public.shared_projects enable row level security;
alter table public.project_versions enable row level security;

-- ============================================================
-- RLS POLICIES: PROFILES
-- ============================================================
create policy if not exists "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy if not exists "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid());

-- Allow public read for shared project lookups
create policy if not exists "Profiles readable by authenticated"
  on public.profiles for select
  to authenticated
  using (true);

-- ============================================================
-- RLS POLICIES: PROJECTS
-- ============================================================
create policy if not exists "Users can read own projects"
  on public.projects for select
  to authenticated
  using (owner_id = auth.uid());

create policy if not exists "Users can read shared projects"
  on public.projects for select
  to authenticated
  using (
    id in (
      select project_id from public.shared_projects where user_id = auth.uid()
    )
  );

create policy if not exists "Users can insert own projects"
  on public.projects for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy if not exists "Owners can update own projects"
  on public.projects for update
  to authenticated
  using (owner_id = auth.uid());

create policy if not exists "Editors can update shared projects"
  on public.projects for update
  to authenticated
  using (
    id in (
      select project_id from public.shared_projects
      where user_id = auth.uid() and role in ('editor', 'owner')
    )
  );

create policy if not exists "Owners can delete own projects"
  on public.projects for delete
  to authenticated
  using (owner_id = auth.uid());

-- ============================================================
-- RLS POLICIES: SCENES
-- ============================================================
create policy if not exists "Users can read scenes of own/shared projects"
  on public.scenes for select
  to authenticated
  using (
    project_id in (
      select id from public.projects where owner_id = auth.uid()
      union
      select project_id from public.shared_projects where user_id = auth.uid()
    )
  );

create policy if not exists "Users can insert scenes for own projects"
  on public.scenes for insert
  to authenticated
  with check (
    project_id in (select id from public.projects where owner_id = auth.uid())
  );

create policy if not exists "Editors can insert scenes for shared projects"
  on public.scenes for insert
  to authenticated
  with check (
    project_id in (
      select project_id from public.shared_projects
      where user_id = auth.uid() and role in ('editor', 'owner')
    )
  );

create policy if not exists "Users can update scenes of own projects"
  on public.scenes for update
  to authenticated
  using (
    project_id in (select id from public.projects where owner_id = auth.uid())
  );

create policy if not exists "Editors can update scenes of shared projects"
  on public.scenes for update
  to authenticated
  using (
    project_id in (
      select project_id from public.shared_projects
      where user_id = auth.uid() and role in ('editor', 'owner')
    )
  );

create policy if not exists "Users can delete scenes of own projects"
  on public.scenes for delete
  to authenticated
  using (
    project_id in (select id from public.projects where owner_id = auth.uid())
  );

-- ============================================================
-- RLS POLICIES: SCENE_OBJECTS
-- ============================================================
create policy if not exists "Users can read objects of accessible scenes"
  on public.scene_objects for select
  to authenticated
  using (
    scene_id in (
      select s.id from public.scenes s
      join public.projects p on s.project_id = p.id
      where p.owner_id = auth.uid()
      union
      select s.id from public.scenes s
      join public.shared_projects sp on s.project_id = sp.project_id
      where sp.user_id = auth.uid()
    )
  );

create policy if not exists "Users can insert objects for own scenes"
  on public.scene_objects for insert
  to authenticated
  with check (
    scene_id in (
      select s.id from public.scenes s
      join public.projects p on s.project_id = p.id
      where p.owner_id = auth.uid()
    )
  );

create policy if not exists "Editors can insert objects for shared scenes"
  on public.scene_objects for insert
  to authenticated
  with check (
    scene_id in (
      select s.id from public.scenes s
      join public.shared_projects sp on s.project_id = sp.project_id
      where sp.user_id = auth.uid() and sp.role in ('editor', 'owner')
    )
  );

create policy if not exists "Users can update objects of own scenes"
  on public.scene_objects for update
  to authenticated
  using (
    scene_id in (
      select s.id from public.scenes s
      join public.projects p on s.project_id = p.id
      where p.owner_id = auth.uid()
    )
  );

create policy if not exists "Editors can update objects of shared scenes"
  on public.scene_objects for update
  to authenticated
  using (
    scene_id in (
      select s.id from public.scenes s
      join public.shared_projects sp on s.project_id = sp.project_id
      where sp.user_id = auth.uid() and sp.role in ('editor', 'owner')
    )
  );

create policy if not exists "Users can delete objects of own scenes"
  on public.scene_objects for delete
  to authenticated
  using (
    scene_id in (
      select s.id from public.scenes s
      join public.projects p on s.project_id = p.id
      where p.owner_id = auth.uid()
    )
  );

-- ============================================================
-- RLS POLICIES: MATERIALS
-- ============================================================
create policy if not exists "Users can read own materials"
  on public.materials for select
  to authenticated
  using (owner_id = auth.uid());

create policy if not exists "Users can insert own materials"
  on public.materials for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy if not exists "Users can update own materials"
  on public.materials for update
  to authenticated
  using (owner_id = auth.uid());

create policy if not exists "Users can delete own materials"
  on public.materials for delete
  to authenticated
  using (owner_id = auth.uid());

-- ============================================================
-- RLS POLICIES: AI SCANS
-- ============================================================
create policy if not exists "Users can read own scans"
  on public.ai_scans for select
  to authenticated
  using (owner_id = auth.uid());

create policy if not exists "Users can insert own scans"
  on public.ai_scans for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy if not exists "Users can update own scans"
  on public.ai_scans for update
  to authenticated
  using (owner_id = auth.uid());

create policy if not exists "Users can delete own scans"
  on public.ai_scans for delete
  to authenticated
  using (owner_id = auth.uid());

-- ============================================================
-- RLS POLICIES: SHARED_PROJECTS
-- ============================================================
create policy if not exists "Users can read own shares"
  on public.shared_projects for select
  to authenticated
  using (user_id = auth.uid() or invited_by = auth.uid());

create policy if not exists "Project owners can insert shares"
  on public.shared_projects for insert
  to authenticated
  with check (
    project_id in (select id from public.projects where owner_id = auth.uid())
  );

create policy if not exists "Project owners can update shares"
  on public.shared_projects for update
  to authenticated
  using (
    project_id in (select id from public.projects where owner_id = auth.uid())
  );

create policy if not exists "Project owners can delete shares"
  on public.shared_projects for delete
  to authenticated
  using (
    project_id in (select id from public.projects where owner_id = auth.uid())
  );

-- ============================================================
-- RLS POLICIES: PROJECT_VERSIONS
-- ============================================================
create policy if not exists "Users can read versions of accessible projects"
  on public.project_versions for select
  to authenticated
  using (
    project_id in (
      select id from public.projects where owner_id = auth.uid()
      union
      select project_id from public.shared_projects where user_id = auth.uid()
    )
  );

create policy if not exists "Users can insert versions for own projects"
  on public.project_versions for insert
  to authenticated
  with check (
    project_id in (select id from public.projects where owner_id = auth.uid())
  );

create policy if not exists "Editors can insert versions for shared projects"
  on public.project_versions for insert
  to authenticated
  with check (
    project_id in (
      select project_id from public.shared_projects
      where user_id = auth.uid() and role in ('editor', 'owner')
    )
  );

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_projects_owner on public.projects(owner_id);
create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_scenes_project on public.scenes(project_id);
create index if not exists idx_scene_objects_scene on public.scene_objects(scene_id);
create index if not exists idx_materials_owner on public.materials(owner_id);
create index if not exists idx_ai_scans_owner on public.ai_scans(owner_id);
create index if not exists idx_shared_projects_project on public.shared_projects(project_id);
create index if not exists idx_shared_projects_user on public.shared_projects(user_id);
create index if not exists idx_project_versions_project on public.project_versions(project_id);

-- ============================================================
-- TABLE: PROJECT_PREVIEWS (public shareable lightweight scenes)
-- ============================================================
create table if not exists public.project_previews (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete set null,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  scene_data jsonb not null,
  thumbnail_url text,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.project_previews is 'Lightweight exported scene snapshots for public web preview sharing.';

-- ============================================================
-- RLS POLICIES: PROJECT_PREVIEWS
-- ============================================================
alter table public.project_previews enable row level security;

create policy if not exists "Anyone can read public previews"
  on public.project_previews for select
  to anon, authenticated
  using (true);

create policy if not exists "Users can insert own previews"
  on public.project_previews for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy if not exists "Users can delete own previews"
  on public.project_previews for delete
  to authenticated
  using (owner_id = auth.uid());

create index if not exists idx_project_previews_project on public.project_previews(project_id);
create index if not exists idx_project_previews_owner on public.project_previews(owner_id);

-- ============================================================
-- TABLE: LICENSES
-- ============================================================
create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  status text not null default 'trial' check (status in ('trial','active','expired','cancelled')),
  plan text not null default 'free' check (plan in ('free','pro','enterprise')),
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.licenses is 'User subscription licenses managed via Stripe Billing.';

-- ============================================================
-- RLS POLICIES: LICENSES
-- ============================================================
alter table public.licenses enable row level security;

create policy if not exists "Users can read own license"
  on public.licenses for select
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists "Users can update own license"
  on public.licenses for update
  to authenticated
  using (auth.uid() = user_id);

-- Service role / webhook insert (disable insert for users)
create policy if not exists "No user insert on licenses"
  on public.licenses for insert
  to authenticated
  with check (false);

create index if not exists idx_licenses_user on public.licenses(user_id);
