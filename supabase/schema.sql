-- ============================================================================
-- Study Point — database tables
-- Run this FIRST in Supabase → SQL Editor (then policies.sql, storage.sql, seed.sql).
-- Safe to re-run: every statement is idempotent.
-- ============================================================================

-- Who may use /admin. Add rows with supabase/add_admin.sql.
create table if not exists public.admin_users (
  email      text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

-- Enquiries sent from the website form.
create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  parent_name text not null check (char_length(parent_name) between 2 and 100),
  phone       text not null check (char_length(phone) between 7 and 30),
  child_name  text,
  child_age   text,
  interest    text not null default 'Not sure yet',
  branch      text,
  message     text check (char_length(message) <= 1000),
  status      text not null default 'new' check (status in ('new', 'contacted', 'joined')),
  ip_hash     text  -- salted hash of the sender's IP, used only for rate limiting
);
create index if not exists enquiries_status_created_idx on public.enquiries (status, created_at desc);
create index if not exists enquiries_ip_created_idx on public.enquiries (ip_hash, created_at);

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

-- Gallery photos. image_url is the public URL; storage_path is the file in the
-- "gallery" bucket (null for built-in sample images).
create table if not exists public.gallery_items (
  id           uuid primary key default gen_random_uuid(),
  image_url    text not null,
  storage_path text,
  alt          text not null default '',
  album        text not null default 'General',
  sort_order   integer not null default 0,
  is_sample    boolean not null default false,  -- true = placeholder, not a real photo
  created_at   timestamptz not null default now()
);
create index if not exists gallery_items_order_idx on public.gallery_items (sort_order);

-- Parent comments.
create table if not exists public.testimonials (
  id             uuid primary key default gen_random_uuid(),
  quote          text not null,
  author         text not null default 'Parent',
  is_visible     boolean not null default true,
  is_placeholder boolean not null default false,  -- true = SAMPLE text, not a real parent
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now()
);

-- The four home-page counters.
create table if not exists public.site_stats (
  key            text primary key check (key in ('children', 'years', 'branches', 'satisfaction')),
  label          text not null,
  value          text not null,
  sort_order     integer not null default 0,
  is_placeholder boolean not null default false  -- true = SAMPLE number to be confirmed by the client
);

-- The two branches.
create table if not exists public.branches (
  id             text primary key,               -- e.g. 'point-pedro'
  name           text not null,
  address        text not null default '',
  phones         text[] not null default '{}',
  whatsapp       text not null default '',
  hours          text not null default '',
  map_url        text not null default '',
  sort_order     integer not null default 0,
  is_placeholder boolean not null default false  -- true = details to be confirmed
);

-- Editable website text (hero text, programme lists, FAQ, social links, main picture URLs), stored as JSON.
create table if not exists public.site_content (
  key   text primary key,
  value jsonb not null
);
-- Allowed keys. Dropped and re-added so re-running this file also upgrades older databases.
alter table public.site_content drop constraint if exists site_content_key_check;
alter table public.site_content add constraint site_content_key_check
  check (key in ('hero', 'nursery_programs', 'class_programs', 'faq', 'social', 'images'));

-- Short notices shown at the top of the home page.
create table if not exists public.announcements (
  id         uuid primary key default gen_random_uuid(),
  text       text not null check (char_length(text) between 1 and 200),
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- True when the signed-in user's email is in admin_users.
-- SECURITY DEFINER so policies can check the list without exposing it.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- ----------------------------------------------------------------------------
-- Tamil versions of owner-editable text (typed in /admin). Empty = the website
-- falls back to standard Tamil for default text, otherwise to the English text.
-- ----------------------------------------------------------------------------
alter table public.branches      add column if not exists address_ta text not null default '';
alter table public.branches      add column if not exists hours_ta   text not null default '';
alter table public.site_stats    add column if not exists label_ta   text not null default '';
alter table public.testimonials  add column if not exists quote_ta   text not null default '';
alter table public.announcements add column if not exists text_ta    text not null default '';

-- Make the API notice the new columns straight away.
notify pgrst, 'reload schema';
