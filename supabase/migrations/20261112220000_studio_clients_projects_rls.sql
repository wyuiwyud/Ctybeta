create table if not exists public.studio_clients (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    contact_info text,
    created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.studio_projects (
    id uuid primary key default gen_random_uuid(),
    client_id uuid references public.studio_clients(id) on delete cascade,
    title text not null,
    description text,
    progress integer default 0 check (progress >= 0 and progress <= 100),
    status text default 'active'
        check (status in ('active', 'completed', 'on_hold')),
    assigned_to uuid references public.studio_members(id) on delete set null,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

create or replace function public.set_studio_projects_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_studio_projects_updated_at
    on public.studio_projects;
create trigger set_studio_projects_updated_at
    before update on public.studio_projects
    for each row
    execute function public.set_studio_projects_updated_at();

revoke all on public.studio_clients, public.studio_projects
    from anon, authenticated;
grant select, insert, update, delete
    on public.studio_clients, public.studio_projects
    to authenticated;

alter table public.studio_clients enable row level security;
alter table public.studio_clients force row level security;
alter table public.studio_projects enable row level security;
alter table public.studio_projects force row level security;

do $$
declare
    existing_policy record;
begin
    for existing_policy in
        select tablename, policyname
        from pg_policies
        where schemaname = 'public'
          and tablename in ('studio_clients', 'studio_projects')
    loop
        execute format(
            'drop policy %I on public.%I',
            existing_policy.policyname,
            existing_policy.tablename
        );
    end loop;
end;
$$;

create policy "Studio members can read clients"
    on public.studio_clients
    for select
    to authenticated
    using (
        exists (
            select 1
            from public.studio_members as member
            where member.id = auth.uid()
              and member.role in ('admin', 'senior', 'tech', 'data', 'finance')
        )
    );

create policy "Studio members can add clients"
    on public.studio_clients
    for insert
    to authenticated
    with check (
        exists (
            select 1
            from public.studio_members as member
            where member.id = auth.uid()
              and member.role in ('admin', 'senior', 'tech', 'data', 'finance')
        )
    );

create policy "Studio members can update clients"
    on public.studio_clients
    for update
    to authenticated
    using (
        exists (
            select 1
            from public.studio_members as member
            where member.id = auth.uid()
              and member.role in ('admin', 'senior', 'tech', 'data', 'finance')
        )
    )
    with check (
        exists (
            select 1
            from public.studio_members as member
            where member.id = auth.uid()
              and member.role in ('admin', 'senior', 'tech', 'data', 'finance')
        )
    );

create policy "Studio admins can delete clients"
    on public.studio_clients
    for delete
    to authenticated
    using (
        exists (
            select 1
            from public.studio_members as member
            where member.id = auth.uid()
              and member.role = 'admin'
        )
    );

create policy "Studio members can read projects"
    on public.studio_projects
    for select
    to authenticated
    using (
        exists (
            select 1
            from public.studio_members as member
            where member.id = auth.uid()
              and member.role in ('admin', 'senior', 'tech', 'data', 'finance')
              and (
                  member.role <> 'tech'
                  or studio_projects.assigned_to = auth.uid()
              )
        )
    );

create policy "Studio members can add projects"
    on public.studio_projects
    for insert
    to authenticated
    with check (
        exists (
            select 1
            from public.studio_members as member
            where member.id = auth.uid()
              and member.role in ('admin', 'senior', 'tech', 'data', 'finance')
        )
    );

create policy "Studio members can update projects"
    on public.studio_projects
    for update
    to authenticated
    using (
        exists (
            select 1
            from public.studio_members as member
            where member.id = auth.uid()
              and member.role in ('admin', 'senior', 'tech', 'data', 'finance')
              and (
                  member.role <> 'tech'
                  or studio_projects.assigned_to = auth.uid()
              )
        )
    )
    with check (
        exists (
            select 1
            from public.studio_members as member
            where member.id = auth.uid()
              and member.role in ('admin', 'senior', 'tech', 'data', 'finance')
              and (
                  member.role <> 'tech'
                  or studio_projects.assigned_to = auth.uid()
              )
        )
    );

create policy "Studio admins can delete projects"
    on public.studio_projects
    for delete
    to authenticated
    using (
        exists (
            select 1
            from public.studio_members as member
            where member.id = auth.uid()
              and member.role = 'admin'
        )
    );
