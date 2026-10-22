import type { Branch, GalleryItem, HeroContent, Program, SiteStat, Testimonial } from "./types";

/**
 * Fallback content. It is used when Supabase is not configured yet, or a
 * table is empty, so the site always renders. The same values are seeded
 * into the database by /supabase/seed.sql.
 *
 * Anything flagged `is_placeholder` / `is_sample` is NOT real client data:
 * the client must confirm or replace it from the admin page.
 */

export const DEFAULT_HERO: HeroContent = {
  eyebrow: "Welcome to Study Point",
  line1: "Little Learners.",
  line2: "Brighter",
  line3: "Tomorrows.",
  subtitle:
    "A nurturing early years program and quality English education — all under one roof.",
};

export const DEFAULT_NURSERY_PROGRAMS: Program[] = [
  { title: "Phonics", description: "Letter sounds and early reading, taught step by step through songs and games." },
  { title: "Creative Activities", description: "Drawing, colouring, crafts and music that let imagination grow." },
  { title: "Play Based Learning", description: "Learning through blocks, puzzles and guided play, at each child's pace." },
  { title: "Social Skills", description: "Sharing, taking turns and making friends in a caring group." },
  { title: "Confidence Building", description: "Speaking up, trying new things and feeling proud of small wins." },
];

export const DEFAULT_CLASS_PROGRAMS: Program[] = [
  { title: "English", description: "Reading, vocabulary and comprehension for confident everyday English." },
  { title: "Grammar", description: "Clear, practical grammar lessons with plenty of examples and practice." },
  { title: "Phonics", description: "Sound-based reading support for children who are building early literacy." },
  { title: "Spoken English", description: "Speaking practice that builds fluency and removes the fear of speaking." },
  { title: "Writing Skills", description: "Sentences, paragraphs and creative writing, with friendly feedback." },
  { title: "Small Groups", description: "Small classes so every student gets the teacher's attention." },
  { title: "Exam Preparation", description: "Focused revision and exam technique for school English exams." },
];

/** PLACEHOLDER numbers — the client must confirm real figures in admin. */
export const DEFAULT_STATS: SiteStat[] = [
  { key: "children", label: "Happy Students", value: "500+", sort_order: 1, is_placeholder: true },
  { key: "years", label: "Years of Experience", value: "10+", sort_order: 2, is_placeholder: true },
  { key: "branches", label: "Branches", value: "2", sort_order: 3, is_placeholder: true },
  { key: "satisfaction", label: "Parent Satisfaction", value: "95%", sort_order: 4, is_placeholder: true },
];

/** PLACEHOLDER quotes — NOT real parents. Replace with genuine feedback. */
export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: "sample-1", quote: "Sample parent comment: my child enjoys every class and looks forward to going.", author: "Sample Parent", is_visible: true, is_placeholder: true, sort_order: 1 },
  { id: "sample-2", quote: "Sample parent comment: the teachers are caring and the environment is friendly.", author: "Sample Parent", is_visible: true, is_placeholder: true, sort_order: 2 },
  { id: "sample-3", quote: "Sample parent comment: we have seen real progress in confidence and English.", author: "Sample Parent", is_visible: true, is_placeholder: true, sort_order: 3 },
];

/** Phone numbers come from the client's design; addresses/hours are placeholders. */
export const DEFAULT_BRANCHES: Branch[] = [
  {
    id: "point-pedro",
    name: "Point Pedro",
    address: "Point Pedro, Northern Province, Sri Lanka (full address to be confirmed)",
    phones: ["0767666826", "0767666827"],
    whatsapp: "0767666826",
    hours: "Mon – Fri: 8:00 AM – 5:00 PM (to be confirmed)",
    map_url: "",
    sort_order: 1,
    is_placeholder: true,
  },
  {
    id: "vathiry",
    name: "Vathiry",
    address: "Vathiry, Northern Province, Sri Lanka (full address to be confirmed)",
    phones: ["0767666826", "0767666827"],
    whatsapp: "0767666827",
    hours: "Mon – Fri: 8:00 AM – 5:00 PM (to be confirmed)",
    map_url: "",
    sort_order: 2,
    is_placeholder: true,
  },
];

export const GALLERY_ALBUMS = ["Nursery", "Classes", "Activities", "Events", "Campus"];

const albumFor = ["Classes", "Nursery", "Activities", "Classes", "Campus", "Nursery", "Activities", "Campus"];
export const DEFAULT_GALLERY: GalleryItem[] = albumFor.map((album, i) => ({
  id: `sample-${i + 1}`,
  image_url: `/placeholders/gallery-${i + 1}.svg`,
  storage_path: null,
  alt: `Sample ${album.toLowerCase()} photo ${i + 1} (placeholder until real photos are uploaded)`,
  album,
  sort_order: i + 1,
  is_sample: true,
}));
