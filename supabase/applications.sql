-- ============================================================================
-- Study Point — admission applications (the "Apply" page)
-- Run ONCE in Supabase -> SQL Editor (safe to run again). It adds:
--   1. the applications table,
--   2. admin-only access to it,
--   3. a PRIVATE storage bucket for the child's photo / birth certificate, and a public bucket for the
--      printable PDF form.
-- Needs schema.sql (the is_admin() function) to have been run before.
-- ============================================================================

-- Admission applications (the "Apply" form). Contains children's details, so only admins can read it
-- (policies.sql) and the documents live in a PRIVATE storage bucket (storage.sql).
create table if not exists public.applications (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  status          text not null default 'new' check (status in ('new', 'contacted', 'accepted', 'declined')),
  program         text not null default '',
  branch          text,
  child_name      text not null check (char_length(child_name) between 2 and 100),
  child_dob       date,
  child_gender    text,
  previous_school text,
  health_notes    text check (char_length(health_notes) <= 1000),
  parent_name     text not null check (char_length(parent_name) between 2 and 100),
  relationship    text,
  phone           text not null check (char_length(phone) between 7 and 30),
  whatsapp        text,
  email           text,
  address         text,
  emergency_name  text,
  emergency_phone text,
  how_heard       text,
  photo_path      text,  -- file in the private "applications" bucket
  birth_cert_path text,
  other_doc_path  text,
  consent         boolean not null default false,
  admin_note      text check (char_length(admin_note) <= 1000),
  ip_hash         text   -- salted hash of the sender's IP, used only for rate limiting
);
create index if not exists applications_status_created_idx on public.applications (status, created_at desc);
create index if not exists applications_ip_created_idx on public.applications (ip_hash, created_at);


-- Access: admins only.
alter table public.applications enable row level security;
drop policy if exists "admin applications" on public.applications;
create policy "admin applications" on public.applications
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
revoke all on public.applications from anon;

-- ----------------------------------------------------------------------------
-- Application documents: PRIVATE bucket (child photo, birth certificate …).
-- Nobody can open them from the internet. The website server saves them when a form is sent, and only
-- signed-in admins can read or delete them (the admin page opens them with short-lived links).
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('applications', 'applications', false, 3145728, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "applications admin read" on storage.objects;
create policy "applications admin read" on storage.objects
  for select to authenticated using (bucket_id = 'applications' and public.is_admin());

drop policy if exists "applications admin delete" on storage.objects;
create policy "applications admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'applications' and public.is_admin());

-- ----------------------------------------------------------------------------
-- Printable forms (the application form PDF the owner uploads in Admin → Applications): public bucket, PDF only.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('forms', 'forms', true, 5242880, array['application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "forms public read" on storage.objects;
create policy "forms public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'forms');

drop policy if exists "forms admin insert" on storage.objects;
create policy "forms admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'forms' and public.is_admin());

drop policy if exists "forms admin update" on storage.objects;
create policy "forms admin update" on storage.objects
  for update to authenticated using (bucket_id = 'forms' and public.is_admin()) with check (bucket_id = 'forms' and public.is_admin());

drop policy if exists "forms admin delete" on storage.objects;
create policy "forms admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'forms' and public.is_admin());

notify pgrst, 'reload schema';
