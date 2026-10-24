-- Marks the four home-page numbers as confirmed so they show on the website.
-- Run once in Supabase -> SQL Editor (safe to run again). You can also tick
-- "Confirmed" for each number in Admin -> Stats instead.
update public.site_stats
set is_placeholder = false
where key in ('children', 'years', 'branches', 'satisfaction');
