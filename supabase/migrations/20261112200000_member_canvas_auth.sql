create table if not exists public.studio_members (
    id uuid primary key references auth.users (id) on delete cascade,
    member_code text not null unique,
    name text not null,
    role text not null check (role in ('admin', 'senior', 'tech', 'data', 'finance')),
    label text not null,
    initials text not null,
    room text not null,
    subtitle text not null,
    color text not null,
    access text[] not null default '{}'
);

revoke all on public.studio_members from anon, authenticated;
grant select on public.studio_members to authenticated;

alter table public.studio_members enable row level security;

create policy "Members can read their own profile"
    on public.studio_members
    for select
    to authenticated
    using (auth.uid() = id);

create table if not exists public.studio_canvases (
    owner_id uuid not null references auth.users (id) on delete cascade,
    board_id integer not null check (board_id between 1 and 25),
    strokes jsonb not null default '[]'::jsonb
        check (jsonb_typeof(strokes) = 'array'),
    updated_at timestamptz not null default now(),
    primary key (owner_id, board_id)
);

revoke all on public.studio_canvases from anon, authenticated;
grant select, insert, update, delete on public.studio_canvases to authenticated;

alter table public.studio_canvases enable row level security;

create policy "Members can manage their own canvases"
    on public.studio_canvases
    for all
    to authenticated
    using (auth.uid() = owner_id)
    with check (auth.uid() = owner_id);

create or replace function public.set_studio_canvas_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger set_studio_canvas_updated_at
    before update on public.studio_canvases
    for each row
    execute function public.set_studio_canvas_updated_at();
