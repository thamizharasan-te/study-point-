-- ============================================================================
-- Study Point — row level security
-- Run AFTER schema.sql. Safe to re-run.
--
-- Summary
--   * Visitors (anon) can only READ published content.
--   * Visitors can NOT touch enquiries at all. The website saves enquiries
--     through a server route that checks spam rules first.
--   * Admins (emails in admin_users) can read and change everything.
-- ============================================================================

alter table public.admin_users   enable row level security;
alter table public.enquiries     enable row level security;
alter table public.gallery_items enable row level security;
alter table public.testimonials  enable row level security;
alter table public.site_stats    enable row level security;
alter table public.branches      enable row level security;
alter table public.site_content  enable row level security;
alter table public.announcements enable row level security;

-- admin_users: a signed-in user can see only their own row (used by the login check).
-- Nobody can add/remove admins from the website; use add_admin.sql in the SQL editor.
drop policy if exists "own admin row" on public.admin_users;
create policy "own admin row" on public.admin_users
  for select to authenticated
  using (email = lower(coalesce(auth.jwt() ->> 'email', '')));

-- enquiries: admins only. (No anon policy = anon has no access.)
drop policy if exists "admin enquiries" on public.enquiries;
create policy "admin enquiries" on public.enquiries
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
revoke all on public.enquiries from anon;

-- applications: admins only (children's details). No anon policy = no public access.
alter table public.applications enable row level security;
drop policy if exists "admin applications" on public.applications;
create policy "admin applications" on public.applications
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
revoke all on public.applications from anon;

-- Public read + admin write, one table at a time.
drop policy if exists "public read" on public.gallery_items;
create policy "public read" on public.gallery_items for select to anon, authenticated using (true);
drop policy if exists "admin write" on public.gallery_items;
create policy "admin write" on public.gallery_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read visible" on public.testimonials;
create policy "public read visible" on public.testimonials for select to anon, authenticated using (is_visible);
drop policy if exists "admin write" on public.testimonials;
create policy "admin write" on public.testimonials for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read" on public.site_stats;
create policy "public read" on public.site_stats for select to anon, authenticated using (true);
drop policy if exists "admin write" on public.site_stats;
create policy "admin write" on public.site_stats for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read" on public.branches;
create policy "public read" on public.branches for select to anon, authenticated using (true);
drop policy if exists "admin write" on public.branches;
create policy "admin write" on public.branches for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read" on public.site_content;
create policy "public read" on public.site_content for select to anon, authenticated using (true);
drop policy if exists "admin write" on public.site_content;
create policy "admin write" on public.site_content for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read active" on public.announcements;
create policy "public read active" on public.announcements for select to anon, authenticated using (is_active);
drop policy if exists "admin write" on public.announcements;
create policy "admin write" on public.announcements for all to authenticated using (public.is_admin()) with check (public.is_admin());
