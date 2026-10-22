-- ============================================================================
-- Study Point — photo storage bucket
-- Run AFTER schema.sql. Safe to re-run.
-- ============================================================================

-- Public bucket (so photos load fast for visitors), 5 MB per file, images only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery', 'gallery', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Anyone can VIEW photos; only admins can upload, replace or delete them.
drop policy if exists "gallery public read" on storage.objects;
create policy "gallery public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'gallery');

drop policy if exists "gallery admin insert" on storage.objects;
create policy "gallery admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "gallery admin update" on storage.objects;
create policy "gallery admin update" on storage.objects
  for update to authenticated using (bucket_id = 'gallery' and public.is_admin()) with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "gallery admin delete" on storage.objects;
create policy "gallery admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'gallery' and public.is_admin());
