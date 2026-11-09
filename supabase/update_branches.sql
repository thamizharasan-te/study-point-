-- Branch details, matching src/lib/branches.ts. Run this ONCE in Supabase -> SQL Editor (safe to run again):
-- open this file on GitHub, "Copy raw file", paste the CONTENTS, press Run.
-- You can also type the same details in Admin -> Branches; this file is just a quicker way to set them exactly.
-- It only changes the lines below, nothing else (photos, applications and enquiries are not touched).

-- The Tamil columns exist once supabase/schema.sql has been run; this makes sure of it.
alter table public.branches add column if not exists address_ta text not null default '';
alter table public.branches add column if not exists hours_ta   text not null default '';

-- Vathiry: correct address (comma + space after "Nelliady", no dot before the postal code).
update public.branches
   set address    = 'M.M.V. Road, Nelliady, Point Pedro 40000',
       address_ta = 'எம்.எம்.வி. வீதி, நெல்லியடி, பருத்தித்துறை 40000'
 where id = 'vathiry';

-- TODO(owner): remove the two dashes in front of a block and fill in the real details when you have them.
--
-- update public.branches
--    set address    = 'TODO street address, Point Pedro',
--        address_ta = 'TODO Tamil address',
--        phones     = array['07XXXXXXXX'],          -- this branch's own number(s)
--        whatsapp   = '07XXXXXXXX',
--        hours      = 'TODO class timings',
--        hours_ta   = 'TODO Tamil timings',
--        is_placeholder = false                      -- removes "Details to be confirmed"
--  where id = 'point-pedro';
--
-- update public.branches
--    set phones = array['07XXXXXXXX'], whatsapp = '07XXXXXXXX',
--        hours = 'TODO class timings', hours_ta = 'TODO Tamil timings', is_placeholder = false
--  where id = 'vathiry';
