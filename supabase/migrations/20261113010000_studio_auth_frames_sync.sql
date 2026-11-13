insert into storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
values (
    'studio-auth-frames',
    'studio-auth-frames',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.studio_auth_frames (
    slot text primary key
        check (slot in ('portrait', 'avatar', 'af02', 'stamp', 'cyber', 'phone')),
    object_path text unique,
    updated_by uuid references auth.users (id) on delete set null,
    updated_at timestamptz not null default now(),
    constraint studio_auth_frames_slot_path_check
        check (object_path is null or object_path = 'frames/' || slot)
);

revoke all on public.studio_auth_frames from anon, authenticated;
grant select on public.studio_auth_frames to anon, authenticated;
grant insert, update, delete on public.studio_auth_frames to authenticated;

alter table public.studio_auth_frames enable row level security;

drop policy if exists "Anyone can read studio auth frames"
    on public.studio_auth_frames;
create policy "Anyone can read studio auth frames"
    on public.studio_auth_frames
    for select
    to anon, authenticated
    using (true);

drop policy if exists "Admins can insert studio auth frames"
    on public.studio_auth_frames;
create policy "Admins can insert studio auth frames"
    on public.studio_auth_frames
    for insert
    to authenticated
    with check (public.is_studio_admin());

drop policy if exists "Admins can update studio auth frames"
    on public.studio_auth_frames;
create policy "Admins can update studio auth frames"
    on public.studio_auth_frames
    for update
    to authenticated
    using (public.is_studio_admin())
    with check (public.is_studio_admin());

drop policy if exists "Admins can delete studio auth frames"
    on public.studio_auth_frames;
create policy "Admins can delete studio auth frames"
    on public.studio_auth_frames
    for delete
    to authenticated
    using (public.is_studio_admin());

drop policy if exists "Anyone can read studio auth frame files"
    on storage.objects;
create policy "Anyone can read studio auth frame files"
    on storage.objects
    for select
    to anon, authenticated
    using (
        bucket_id = 'studio-auth-frames'
        and name ~ '^frames/(portrait|avatar|af02|stamp|cyber|phone)$'
    );

drop policy if exists "Admins can upload studio auth frame files"
    on storage.objects;
create policy "Admins can upload studio auth frame files"
    on storage.objects
    for insert
    to authenticated
    with check (
        bucket_id = 'studio-auth-frames'
        and name ~ '^frames/(portrait|avatar|af02|stamp|cyber|phone)$'
        and public.is_studio_admin()
    );

drop policy if exists "Admins can update studio auth frame files"
    on storage.objects;
create policy "Admins can update studio auth frame files"
    on storage.objects
    for update
    to authenticated
    using (
        bucket_id = 'studio-auth-frames'
        and name ~ '^frames/(portrait|avatar|af02|stamp|cyber|phone)$'
        and public.is_studio_admin()
    )
    with check (
        bucket_id = 'studio-auth-frames'
        and name ~ '^frames/(portrait|avatar|af02|stamp|cyber|phone)$'
        and public.is_studio_admin()
    );

drop policy if exists "Admins can delete studio auth frame files"
    on storage.objects;
create policy "Admins can delete studio auth frame files"
    on storage.objects
    for delete
    to authenticated
    using (
        bucket_id = 'studio-auth-frames'
        and name ~ '^frames/(portrait|avatar|af02|stamp|cyber|phone)$'
        and public.is_studio_admin()
    );

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
          and tablename = 'studio_auth_frames'
    ) then
        alter publication supabase_realtime
            add table public.studio_auth_frames;
    end if;
end;
$$;
