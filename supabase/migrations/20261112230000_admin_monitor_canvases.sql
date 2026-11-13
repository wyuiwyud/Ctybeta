create or replace function public.is_studio_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.studio_members as member
        where member.id = auth.uid()
          and member.role = 'admin'
    );
$$;

revoke all on function public.is_studio_admin()
    from public, anon, authenticated;
grant execute on function public.is_studio_admin()
    to authenticated;

drop policy if exists "Admins can view all member profiles"
    on public.studio_members;
drop policy if exists "Admins can read team member profiles"
    on public.studio_members;
create policy "Admins can read team member profiles"
    on public.studio_members
    for select
    to authenticated
    using (public.is_studio_admin());

drop policy if exists "Admins can view all member canvases"
    on public.studio_canvases;
drop policy if exists "Admins can read team canvases"
    on public.studio_canvases;
create policy "Admins can read team canvases"
    on public.studio_canvases
    for select
    to authenticated
    using (public.is_studio_admin());

do $$
begin
    if exists (
        select 1
        from pg_publication
        where pubname = 'supabase_realtime'
    ) and not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'studio_canvases'
    ) then
        alter publication supabase_realtime
            add table public.studio_canvases;
    end if;
end;
$$;

