-- Migration to add 'peach' (main center card background) and 'backdrop' (modal outer background) to studio_auth_frames
alter table public.studio_auth_frames
    drop constraint if exists studio_auth_frames_slot_check;

alter table public.studio_auth_frames
    add constraint studio_auth_frames_slot_check
        check (slot in ('portrait', 'avatar', 'af02', 'stamp', 'cyber', 'phone', 'peach', 'backdrop'));

alter table public.studio_auth_frames
    drop constraint if exists studio_auth_frames_slot_path_check;

alter table public.studio_auth_frames
    add constraint studio_auth_frames_slot_path_check
        check (object_path is null or object_path = 'frames/' || slot);

-- Update storage object policy regex to include peach and backdrop
drop policy if exists "Anyone can read studio auth frame files"
    on storage.objects;
create policy "Anyone can read studio auth frame files"
    on storage.objects
    for select
    to anon, authenticated
    using (
        bucket_id = 'studio-auth-frames'
        and name ~ '^frames/(portrait|avatar|af02|stamp|cyber|phone|peach|backdrop)$'
    );

drop policy if exists "Admins can upload studio auth frame files"
    on storage.objects;
create policy "Admins can upload studio auth frame files"
    on storage.objects
    for insert
    to authenticated
    with check (
        bucket_id = 'studio-auth-frames'
        and name ~ '^frames/(portrait|avatar|af02|stamp|cyber|phone|peach|backdrop)$'
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
        and name ~ '^frames/(portrait|avatar|af02|stamp|cyber|phone|peach|backdrop)$'
        and public.is_studio_admin()
    )
    with check (
        bucket_id = 'studio-auth-frames'
        and name ~ '^frames/(portrait|avatar|af02|stamp|cyber|phone|peach|backdrop)$'
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
        and name ~ '^frames/(portrait|avatar|af02|stamp|cyber|phone|peach|backdrop)$'
        and public.is_studio_admin()
    );
