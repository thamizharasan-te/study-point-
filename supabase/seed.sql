-- ============================================================================
-- Study Point — starter content (SAMPLE DATA)
-- Run AFTER schema.sql, policies.sql and storage.sql. Safe to re-run: it never
-- overwrites anything you have already edited.
--
-- IMPORTANT: rows flagged is_placeholder / is_sample are NOT real client data.
-- The website shows a "Sample — to be confirmed" tag on them until the client
-- replaces them in /admin. (Saving an item in admin removes the tag.)
-- ============================================================================

insert into public.site_content (key, value) values
  ('hero', '{"eyebrow":"Welcome to Study Point","line1":"Little Learners.","line2":"Brighter","line3":"Tomorrows.","subtitle":"A nurturing early years program and quality English education — all under one roof."}'),
  ('nursery_programs', '[
    {"title":"Phonics","description":"Letter sounds and early reading, taught step by step through songs and games."},
    {"title":"Creative Activities","description":"Drawing, colouring, crafts and music that let imagination grow."},
    {"title":"Play Based Learning","description":"Learning through blocks, puzzles and guided play, at each child''s pace."},
    {"title":"Social Skills","description":"Sharing, taking turns and making friends in a caring group."},
    {"title":"Confidence Building","description":"Speaking up, trying new things and feeling proud of small wins."}
  ]'),
  ('class_programs', '[
    {"title":"English","description":"Reading, vocabulary and comprehension for confident everyday English."},
    {"title":"Grammar","description":"Clear, practical grammar lessons with plenty of examples and practice."},
    {"title":"Phonics","description":"Sound-based reading support for children who are building early literacy."},
    {"title":"Spoken English","description":"Speaking practice that builds fluency and removes the fear of speaking."},
    {"title":"Writing Skills","description":"Sentences, paragraphs and creative writing, with friendly feedback."},
    {"title":"Small Groups","description":"Small classes so every student gets the teacher''s attention."},
    {"title":"Exam Preparation","description":"Focused revision and exam technique for school English exams."}
  ]')
on conflict (key) do nothing;

-- SAMPLE numbers — the client must confirm real figures.
insert into public.site_stats (key, label, value, sort_order, is_placeholder) values
  ('children',     'Happy Students',      '500+', 1, true),
  ('years',        'Years of Experience', '10+',  2, true),
  ('branches',     'Branches',            '2',    3, true),
  ('satisfaction', 'Parent Satisfaction', '95%',  4, true)
on conflict (key) do nothing;

-- Phone numbers come from the client's design; addresses and hours are placeholders.
insert into public.branches (id, name, address, phones, whatsapp, hours, map_url, sort_order, is_placeholder) values
  ('point-pedro', 'Point Pedro', 'Point Pedro, Northern Province, Sri Lanka (full address to be confirmed)',
    array['0767666826', '0767666827'], '0767666826', 'Mon – Fri: 8:00 AM – 5:00 PM (to be confirmed)', '', 1, true),
  ('vathiry', 'Vathiry', 'Vathiry, Northern Province, Sri Lanka (full address to be confirmed)',
    array['0767666826', '0767666827'], '0767666827', 'Mon – Fri: 8:00 AM – 5:00 PM (to be confirmed)', '', 2, true)
on conflict (id) do nothing;

-- SAMPLE parent comments — NOT real parents. Replace with genuine feedback.
insert into public.testimonials (quote, author, is_visible, is_placeholder, sort_order)
select * from (values
  ('Sample parent comment: my child enjoys every class and looks forward to going.',        'Sample Parent', true, true, 1),
  ('Sample parent comment: the teachers are caring and the environment is friendly.',       'Sample Parent', true, true, 2),
  ('Sample parent comment: we have seen real progress in confidence and English.',          'Sample Parent', true, true, 3)
) as t(quote, author, is_visible, is_placeholder, sort_order)
where not exists (select 1 from public.testimonials);

-- SAMPLE gallery — built-in illustrations, not real photos. Upload real photos in
-- /admin → Gallery, then delete these.
insert into public.gallery_items (image_url, alt, album, sort_order, is_sample)
select * from (values
  ('/placeholders/gallery-1.svg', 'Sample classes photo 1 (placeholder until real photos are uploaded)',    'Classes',    1, true),
  ('/placeholders/gallery-2.svg', 'Sample nursery photo 2 (placeholder until real photos are uploaded)',    'Nursery',    2, true),
  ('/placeholders/gallery-3.svg', 'Sample activities photo 3 (placeholder until real photos are uploaded)', 'Activities', 3, true),
  ('/placeholders/gallery-4.svg', 'Sample classes photo 4 (placeholder until real photos are uploaded)',    'Classes',    4, true),
  ('/placeholders/gallery-5.svg', 'Sample campus photo 5 (placeholder until real photos are uploaded)',     'Campus',     5, true),
  ('/placeholders/gallery-6.svg', 'Sample nursery photo 6 (placeholder until real photos are uploaded)',    'Nursery',    6, true),
  ('/placeholders/gallery-7.svg', 'Sample activities photo 7 (placeholder until real photos are uploaded)', 'Activities', 7, true),
  ('/placeholders/gallery-8.svg', 'Sample campus photo 8 (placeholder until real photos are uploaded)',     'Campus',     8, true)
) as g(image_url, alt, album, sort_order, is_sample)
where not exists (select 1 from public.gallery_items);
