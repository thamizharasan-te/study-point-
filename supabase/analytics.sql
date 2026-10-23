-- ============================================================================
-- Study Point — visitor statistics for /admin → Visitors
-- Run in Supabase → SQL Editor. Safe to re-run.
--
-- Privacy: no IP address and no cookie is stored. A visitor is a salted hash
-- of IP + browser + day, so it cannot be followed across days or identified.
-- Only the website server writes rows; only admins can read the summary.
-- ============================================================================

create table if not exists public.page_views (
  id        bigint generated always as identity primary key,
  viewed_at timestamptz not null default now(),
  day       date not null default ((now() at time zone 'Asia/Colombo')::date),
  path      text not null check (char_length(path) <= 200),
  visitor   text not null,  -- daily salted hash, not an identifier
  device    text not null default 'desktop' check (device in ('mobile', 'desktop')),
  source    text            -- website the visitor came from (e.g. google.com); null = direct
);
create index if not exists page_views_day_idx on public.page_views (day);

-- Nobody reads this table directly. RLS on + no policies = denied for everyone
-- except the service role (which the website server uses to add rows).
alter table public.page_views enable row level security;
revoke all on public.page_views from anon, authenticated;

-- Admin-only summary: today / 7 days / 30 days, a 30-day chart, top pages,
-- devices and sources. Runs with the owner's rights but refuses non-admins.
create or replace function public.analytics_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  today date := (now() at time zone 'Asia/Colombo')::date;
  result jsonb;
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;

  select jsonb_build_object(
    'today',  (select jsonb_build_object('views', count(*), 'visitors', count(distinct visitor)) from page_views where day = today),
    'last7',  (select jsonb_build_object('views', count(*), 'visitors', count(distinct visitor)) from page_views where day > today - 7),
    'last30', (select jsonb_build_object('views', count(*), 'visitors', count(distinct visitor)) from page_views where day > today - 30),
    'daily', coalesce((
      select jsonb_agg(jsonb_build_object('day', to_char(d::date, 'YYYY-MM-DD'), 'views', coalesce(v.views, 0), 'visitors', coalesce(v.visitors, 0)) order by d)
      from generate_series(today - 29, today, interval '1 day') d
      left join (
        select day, count(*) as views, count(distinct visitor) as visitors
        from page_views where day > today - 30 group by day
      ) v on v.day = d::date
    ), '[]'::jsonb),
    'pages', coalesce((
      select jsonb_agg(to_jsonb(x)) from (
        select path, count(*) as views from page_views where day > today - 30
        group by path order by views desc, path limit 8
      ) x
    ), '[]'::jsonb),
    'devices', coalesce((
      select jsonb_agg(to_jsonb(x)) from (
        select device, count(*) as views from page_views where day > today - 30
        group by device order by views desc
      ) x
    ), '[]'::jsonb),
    'sources', coalesce((
      select jsonb_agg(to_jsonb(x)) from (
        select coalesce(source, 'Direct / unknown') as source, count(*) as views from page_views where day > today - 30
        group by 1 order by views desc limit 6
      ) x
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on function public.analytics_summary() from public, anon;
grant execute on function public.analytics_summary() to authenticated;
