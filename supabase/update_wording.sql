-- New wording from the client's design (home heading, Early Years and Classes lists).
-- The website now has these as built-in defaults. Run this ONCE in Supabase -> SQL Editor so that the
-- old text saved earlier (hero heading, nursery list, classes list) is cleared and the new wording shows.
-- Safe to run again. It only removes those three text blocks; nothing else (photos, branches, numbers) is touched.
-- You can edit all three again afterwards in Admin -> Website Text.
delete from public.site_content where key in ('hero', 'nursery_programs', 'class_programs');
