create table if not exists public.studio_messages (
    id text primary key,
    author_id text not null,
    author text not null,
    role text not null,
    text text not null default '',
    time text not null,
    file jsonb,
    created_at timestamptz not null default now()
);

do $$
begin
    if exists (
        select required.column_name
        from (
            values
                ('id'),
                ('author_id'),
                ('author'),
                ('role'),
                ('text'),
                ('time'),
                ('file'),
                ('created_at')
        ) as required(column_name)
        where not exists (
            select 1
            from information_schema.columns as actual
            where actual.table_schema = 'public'
              and actual.table_name = 'studio_messages'
              and actual.column_name = required.column_name
        )
    ) then
        raise exception 'public.studio_messages exists but does not match the columns used by StudioWorkspace. Reconcile its schema before applying the chat RLS migration.';
    end if;
end;
$$;

create index if not exists studio_messages_created_at_idx
    on public.studio_messages (created_at);

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
          and tablename = 'studio_messages'
    ) then
        alter publication supabase_realtime
            add table public.studio_messages;
    end if;
end;
$$;
