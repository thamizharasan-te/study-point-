-- ============================================================================
-- Allow someone to sign in to /admin.
-- 1. First create their user: Supabase → Authentication → Users → Add user
--    (enter the same email + a password, tick "Auto Confirm User").
-- 2. Put the SAME email below (lower-case) and run this in the SQL Editor.
-- To remove an admin:  delete from public.admin_users where email = '...';
-- ============================================================================
insert into public.admin_users (email)
values ('owner@example.com')   -- <-- change this to the real email
on conflict (email) do nothing;
