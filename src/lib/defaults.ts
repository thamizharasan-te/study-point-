import type { Branch, GalleryItem, HeroContent, ImageSlot, Program, Social, SiteStat, Testimonial } from "./types";

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
  line1: "Little Steps.",
  line2: "Big Dreams.",
  line3: "Bright Futures.",
  subtitle: "A nurturing place for young minds to learn, grow and achieve more.",
};

export const DEFAULT_NURSERY_PROGRAMS: Program[] = [
  { title: "Phonics & Early Reading", description: "Letter sounds and early reading, taught step by step through songs and games." },
  { title: "Creative Activities", description: "Drawing, colouring, crafts and music that let imagination grow." },
  { title: "Play-Based Learning", description: "Learning through blocks, puzzles and guided play, at each child's pace." },
  { title: "Social & Emotional Skills", description: "Sharing, taking turns, understanding feelings and making friends in a caring group." },
];

export const DEFAULT_CLASS_PROGRAMS: Program[] = [
  { title: "Spoken English", description: "Speaking practice that builds fluency and removes the fear of speaking." },
  { title: "English & Grammar", description: "Reading, vocabulary, clear grammar and writing, with focused help for school exams." },
  { title: "Small Group Classes", description: "Small classes so every student gets the teacher's attention." },
  { title: "Confidence & Communication", description: "Speaking up, sharing ideas and communicating clearly at school and beyond." },
];

/** Safe, general answers only — no fees, timings or promises. Editable in /admin → Website Text. */
export const DEFAULT_FAQ: Program[] = [
  { title: "What age group is the Nursery for?", description: "Our Nursery is for children aged 3 to 5 years, with phonics, creative activities, play based learning, social skills and confidence building." },
  { title: "What do Study Point Classes teach?", description: "English, grammar, phonics, spoken English, writing skills and exam preparation, taught in small groups." },
  { title: "Are the groups small?", description: "Yes. We keep groups small so that teachers can give every child proper attention." },
  { title: "Where are your branches?", description: "We have two branches, in Point Pedro and Vathiry. Addresses, phone numbers and maps are on the Contact page." },
  { title: "How can I enquire or enrol my child?", description: "Press Enquire Now, call us or send a WhatsApp message. We will get back to you and answer your questions." },
  { title: "What about fees, timings and available places?", description: "These can differ by branch and class, so please contact your nearest branch and we will be happy to help." },
];

export const DEFAULT_SOCIAL: Social = { facebook: "", instagram: "", youtube: "", tiktok: "" };

/** Figures confirmed by the owner (500+ students, 10+ years, 2 branches, 95% satisfaction); editable in admin → Stats. */
export const DEFAULT_STATS: SiteStat[] = [
  { key: "children", label: "Happy Students", value: "500+", sort_order: 1, is_placeholder: false },
  { key: "years", label: "Years of Experience", value: "10+", sort_order: 2, is_placeholder: false },
  { key: "branches", label: "Branches", value: "2", sort_order: 3, is_placeholder: false },
  { key: "satisfaction", label: "Parent Satisfaction", value: "95%", sort_order: 4, is_placeholder: false },
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
    address: "Point Pedro, Northern Province, Sri Lanka",
    phones: ["0767666826", "0767666827"],
    whatsapp: "0767666826",
    hours: "Please call us for class timings",
    map_url: "",
    sort_order: 1,
    is_placeholder: true,
  },
  {
    id: "vathiry",
    name: "Vathiry",
    address: "Vathiry, Northern Province, Sri Lanka",
    phones: ["0767666826", "0767666827"],
    whatsapp: "0767666827",
    hours: "Please call us for class timings",
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

/**
 * The main pictures of the site. `fallback` is the built-in illustration used
 * until a real photo is uploaded in /admin → Main Pictures.
 */
export const IMAGE_SLOTS: Record<ImageSlot, { label: string; where: string; fallback: string; alt: string; width: number; height: number }> = {
  hero: { label: "Home page — main picture", where: "Top of the home page", fallback: "/placeholders/hero.svg", alt: "Smiling Study Point children learning together", width: 1100, height: 800 },
  nursery: { label: "Nursery picture", where: "Home page Nursery card and the Nursery page", fallback: "/placeholders/nursery.svg", alt: "A Study Point nursery child at play", width: 800, height: 700 },
  classes: { label: "Classes picture", where: "Home page Classes card and the Classes page", fallback: "/placeholders/classes.svg", alt: "A Study Point student learning in class", width: 800, height: 700 },
  why: { label: "“Why Study Point” picture", where: "Home page, beside “More Than Just Classes”", fallback: "/placeholders/why.svg", alt: "A Study Point child reading a book", width: 800, height: 700 },
  logo: { label: "Logo — icon only", where: "Header and footer, next to the “Study Point” name (the name text stays). Square or round picture, transparent background works best.", fallback: "/placeholders/logo.svg", alt: "Study Point logo", width: 160, height: 160 },
  logoFull: { label: "Logo — full (includes the name)", where: "Header and footer. Use this if your logo already has the name written in it; it replaces the icon AND the name text. Wide picture, transparent background works best.", fallback: "/placeholders/logo.svg", alt: "Study Point logo", width: 480, height: 160 },
  about: { label: "About Us picture", where: "About Us page", fallback: "/placeholders/about.svg", alt: "Study Point students in the classroom", width: 1000, height: 760 },
};
