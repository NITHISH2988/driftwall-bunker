create table if not exists practice_problems (
  id text primary key,
  user_id text not null,
  title text not null check (length(title) between 3 and 120),
  platform text not null,
  url text not null default '',
  language text not null check (language in ('javascript', 'typescript', 'python', 'java', 'cpp', 'sql', 'html-css', 'go')),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  status text not null check (status in ('todo', 'in-progress', 'solved', 'revisited')),
  topics jsonb not null default '[]'::jsonb,
  notes text not null default '',
  time_spent_min integer not null default 0 check (time_spent_min between 0 and 1440),
  created_at timestamptz not null,
  updated_at timestamptz not null,
  solved_at timestamptz
);

create index if not exists practice_problems_user_updated_idx
  on practice_problems (user_id, updated_at desc);

alter table practice_problems enable row level security;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'grant select, insert, update, delete on practice_problems to authenticated';
    execute 'create policy practice_problems_owner on practice_problems to authenticated using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id)';
  end if;
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on practice_problems from anon';
  end if;
end
$$;
