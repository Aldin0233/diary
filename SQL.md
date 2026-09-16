-- ============================================================
-- Project Context Tool
-- MVP Database Schema
--
-- Safe to run:
-- - Does NOT DROP tables
-- - Does NOT DELETE data
-- - Does NOT insert example data
-- - Creates tables only when they do not already exist
-- - Enables RLS and creates owner-only policies
-- ============================================================


-- ============================================================
-- 1. PROJECTS
-- ============================================================

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  name text not null,
  description text,

  status text not null default '진행 중'
    check (status in ('진행 중', '잠시 멈춤', '완료')),

  current_status text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint projects_name_not_empty
    check (length(trim(name)) > 0)
);


-- ============================================================
-- 2. THOUGHTS
-- ============================================================

create table if not exists public.thoughts (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  project_id uuid not null
    references public.projects(id)
    on delete cascade,

  content text not null,

  type text
    check (
      type is null
      or type in ('아이디어', '문제', '결정', 'TODO')
    ),

  -- 기록 당시의 프로젝트 맥락
  -- 나중에 프로젝트의 current_status가 바뀌어도
  -- 당시 상황을 확인할 수 있도록 저장
  context_snapshot text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint thoughts_content_not_empty
    check (length(trim(content)) > 0)
);


-- ============================================================
-- 3. NEXT ACTIONS
-- ============================================================

create table if not exists public.next_actions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  project_id uuid not null
    references public.projects(id)
    on delete cascade,

  title text not null,

  completed boolean not null default false,

  position integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint next_actions_title_not_empty
    check (length(trim(title)) > 0)
);


-- ============================================================
-- 4. UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


drop trigger if exists projects_set_updated_at
on public.projects;

create trigger projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();


drop trigger if exists thoughts_set_updated_at
on public.thoughts;

create trigger thoughts_set_updated_at
before update on public.thoughts
for each row
execute function public.set_updated_at();


drop trigger if exists next_actions_set_updated_at
on public.next_actions;

create trigger next_actions_set_updated_at
before update on public.next_actions
for each row
execute function public.set_updated_at();


-- ============================================================
-- 5. INDEXES
-- ============================================================

create index if not exists projects_user_id_idx
on public.projects(user_id);

create index if not exists projects_updated_at_idx
on public.projects(updated_at desc);


create index if not exists thoughts_user_id_idx
on public.thoughts(user_id);

create index if not exists thoughts_project_id_idx
on public.thoughts(project_id);

create index if not exists thoughts_created_at_idx
on public.thoughts(created_at desc);


create index if not exists next_actions_user_id_idx
on public.next_actions(user_id);

create index if not exists next_actions_project_id_idx
on public.next_actions(project_id);

create index if not exists next_actions_position_idx
on public.next_actions(project_id, position);


-- ============================================================
-- 6. ENABLE RLS
-- ============================================================

alter table public.projects
enable row level security;

alter table public.thoughts
enable row level security;

alter table public.next_actions
enable row level security;


-- ============================================================
-- 7. GRANTS
--
-- Anonymous users get no access.
-- Authenticated users get table-level privileges,
-- but RLS limits them to their own rows.
-- ============================================================

revoke all on table public.projects from anon;
revoke all on table public.thoughts from anon;
revoke all on table public.next_actions from anon;

grant select, insert, update, delete
on table public.projects
to authenticated;

grant select, insert, update, delete
on table public.thoughts
to authenticated;

grant select, insert, update, delete
on table public.next_actions
to authenticated;


-- ============================================================
-- 8. PROJECT RLS POLICIES
-- ============================================================

do $$
begin

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'projects_select_own'
  ) then

    create policy "projects_select_own"
    on public.projects
    for select
    to authenticated
    using (
      user_id = (select auth.uid())
    );

  end if;


  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'projects_insert_own'
  ) then

    create policy "projects_insert_own"
    on public.projects
    for insert
    to authenticated
    with check (
      user_id = (select auth.uid())
    );

  end if;


  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'projects_update_own'
  ) then

    create policy "projects_update_own"
    on public.projects
    for update
    to authenticated
    using (
      user_id = (select auth.uid())
    )
    with check (
      user_id = (select auth.uid())
    );

  end if;


  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'projects_delete_own'
  ) then

    create policy "projects_delete_own"
    on public.projects
    for delete
    to authenticated
    using (
      user_id = (select auth.uid())
    );

  end if;

end
$$;


-- ============================================================
-- 9. THOUGHT RLS POLICIES
-- ============================================================

do $$
begin

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'thoughts'
      and policyname = 'thoughts_select_own'
  ) then

    create policy "thoughts_select_own"
    on public.thoughts
    for select
    to authenticated
    using (
      user_id = (select auth.uid())
    );

  end if;


  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'thoughts'
      and policyname = 'thoughts_insert_own'
  ) then

    create policy "thoughts_insert_own"
    on public.thoughts
    for insert
    to authenticated
    with check (
      user_id = (select auth.uid())
      and exists (
        select 1
        from public.projects p
        where p.id = project_id
          and p.user_id = (select auth.uid())
      )
    );

  end if;


  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'thoughts'
      and policyname = 'thoughts_update_own'
  ) then

    create policy "thoughts_update_own"
    on public.thoughts
    for update
    to authenticated
    using (
      user_id = (select auth.uid())
    )
    with check (
      user_id = (select auth.uid())
      and exists (
        select 1
        from public.projects p
        where p.id = project_id
          and p.user_id = (select auth.uid())
      )
    );

  end if;


  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'thoughts'
      and policyname = 'thoughts_delete_own'
  ) then

    create policy "thoughts_delete_own"
    on public.thoughts
    for delete
    to authenticated
    using (
      user_id = (select auth.uid())
    );

  end if;

end
$$;


-- ============================================================
-- 10. NEXT ACTIONS RLS POLICIES
-- ============================================================

do $$
begin

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'next_actions'
      and policyname = 'next_actions_select_own'
  ) then

    create policy "next_actions_select_own"
    on public.next_actions
    for select
    to authenticated
    using (
      user_id = (select auth.uid())
    );

  end if;


  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'next_actions'
      and policyname = 'next_actions_insert_own'
  ) then

    create policy "next_actions_insert_own"
    on public.next_actions
    for insert
    to authenticated
    with check (
      user_id = (select auth.uid())
      and exists (
        select 1
        from public.projects p
        where p.id = project_id
          and p.user_id = (select auth.uid())
      )
    );

  end if;


  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'next_actions'
      and policyname = 'next_actions_update_own'
  ) then

    create policy "next_actions_update_own"
    on public.next_actions
    for update
    to authenticated
    using (
      user_id = (select auth.uid())
    )
    with check (
      user_id = (select auth.uid())
      and exists (
        select 1
        from public.projects p
        where p.id = project_id
          and p.user_id = (select auth.uid())
      )
    );

  end if;


  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'next_actions'
      and policyname = 'next_actions_delete_own'
  ) then

    create policy "next_actions_delete_own"
    on public.next_actions
    for delete
    to authenticated
    using (
      user_id = (select auth.uid())
    );

  end if;

end
$$;


-- ============================================================
-- 11. VERIFY
-- ============================================================

select
  table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'projects',
    'thoughts',
    'next_actions'
  )
order by table_name;
