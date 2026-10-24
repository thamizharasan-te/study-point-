/** Row shapes of the Supabase tables (see /supabase/schema.sql). */

export type EnquiryStatus = "new" | "contacted" | "joined";

export interface Enquiry {
  id: string;
  created_at: string;
  parent_name: string;
  phone: string;
  child_name: string | null;
  child_age: string | null;
  interest: string;
  branch: string | null;
  message: string | null;
  status: EnquiryStatus;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  storage_path: string | null;
  alt: string;
  album: string;
  sort_order: number;
  is_sample: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  /** Optional Tamil version of the quote. */
  quote_ta?: string;
  author: string;
  is_visible: boolean;
  is_placeholder: boolean;
  sort_order: number;
}

export interface SiteStat {
  key: "children" | "years" | "branches" | "satisfaction";
  label: string;
  label_ta?: string;
  value: string;
  sort_order: number;
  is_placeholder: boolean;
}

export interface Branch {
  id: string;
  name: string;
  /** Name shown to visitors in the current language (set by localize). */
  display_name?: string;
  address: string;
  address_ta?: string;
  phones: string[];
  whatsapp: string;
  hours: string;
  hours_ta?: string;
  map_url: string;
  sort_order: number;
  is_placeholder: boolean;
}

export interface Announcement {
  id: string;
  text: string;
  text_ta?: string;
  is_active: boolean;
  created_at: string;
}

export interface Program {
  title: string;
  description: string;
  /** Optional Tamil version, typed in /admin. */
  title_ta?: string;
  description_ta?: string;
}

export interface HeroContent {
  eyebrow: string;
  line1: string;
  line2: string;
  line3: string;
  subtitle: string;
  /** Optional Tamil version of the five fields above. */
  ta?: Partial<Omit<HeroContent, "ta">>;
}

/** The main pictures that can be replaced from /admin → Main Pictures. */
export type ImageSlot = "hero" | "nursery" | "classes" | "why" | "about" | "logo" | "logoFull";
export type SiteImages = Partial<Record<ImageSlot, string>>;

export interface Social {
  facebook: string;
  instagram: string;
  youtube: string;
}

/** Everything the public pages need, loaded in one go. */
export interface SiteData {
  hero: HeroContent;
  nurseryPrograms: Program[];
  classPrograms: Program[];
  /** FAQ entries reuse Program: title = question, description = answer. */
  faq: Program[];
  social: Social;
  images: SiteImages;
  stats: SiteStat[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  branches: Branch[];
  announcements: Announcement[];
}
