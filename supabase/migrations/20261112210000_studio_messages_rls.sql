alter table public.studio_messages enable row level security;
alter table public.studio_messages force row level security;

revoke all on public.studio_messages from anon, authenticated;
grant select, insert on public.studio_messages to authenticated;

do $$
declare
    existing_policy record;
begin
    for existing_policy in
        select policyname
        from pg_policies
        where schemaname = 'public'
          and tablename = 'studio_messages'
    loop
        execute format(
            'drop policy %I on public.studio_messages',
            existing_policy.policyname
        );
    end loop;
end;
$$;

create policy "Studio members can read chat messages"
    on public.studio_messages
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

create policy "Studio members can insert their own chat messages"
    on public.studio_messages
    for insert
    to authenticated
    with check (
        author_id::text = auth.uid()::text
        and exists (
            select 1
            from public.studio_members as member
            where member.id = auth.uid()
              and member.role in ('admin', 'senior', 'tech', 'data', 'finance')
              and member.name = studio_messages.author
              and member.label = studio_messages.role
        )
    );
