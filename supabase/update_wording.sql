-- New wording from the client's design (home heading, Kindergarten and Classes lists, FAQ) and the word
-- "Kindergarten" instead of "Nursery". The website has these as built-in defaults. Run this ONCE in
-- Supabase -> SQL Editor so that the old text saved earlier (hero heading, kindergarten list, classes list,
-- FAQ) is cleared and the new wording shows. Safe to run again.
-- It does not touch photos, branches, numbers, parent comments or announcements.
-- You can edit all of these again afterwards in Admin -> Website Text.
delete from public.site_content where key in ('hero', 'nursery_programs', 'class_programs', 'faq');

-- Photos kept in the old "Nursery" album now belong to the "Kindergarten" album.
update public.gallery_items set album = 'Kindergarten' where album = 'Nursery';
