-- Historical Proximity — Supabase Schema
-- Run this in your Supabase SQL editor to set up the database.

-- Game results table
create table if not exists game_results (
  id               uuid primary key default gen_random_uuid(),
  user_session_id  text not null,
  game_date        date not null,
  scores           integer[] not null,
  final_score      integer not null check (final_score between 0 and 100),
  completed_at     timestamptz not null default now(),

  -- One attempt per session per day
  unique (user_session_id, game_date)
);

-- Index for fast percentile queries
create index if not exists idx_game_results_date on game_results (game_date);
create index if not exists idx_game_results_session on game_results (user_session_id);

-- Enable Row Level Security (optional but recommended)
alter table game_results enable row level security;

-- Allow anyone to insert and read (anonymous sessions)
create policy "Allow insert for all" on game_results
  for insert with check (true);

create policy "Allow read for all" on game_results
  for select using (true);
