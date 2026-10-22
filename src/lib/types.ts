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
  author: string;
  is_visible: boolean;
  is_placeholder: boolean;
  sort_order: number;
}

export interface SiteStat {
  key: "children" | "years" | "branches" | "satisfaction";
  label: string;
  value: string;
  sort_order: number;
  is_placeholder: boolean;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phones: string[];
  whatsapp: string;
  hours: string;
  map_url: string;
  sort_order: number;
  is_placeholder: boolean;
}

export interface Announcement {
  id: string;
  text: string;
  is_active: boolean;
  created_at: string;
}

export interface Program {
  title: string;
  description: string;
}

export interface HeroContent {
  eyebrow: string;
  line1: string;
  line2: string;
  line3: string;
  subtitle: string;
}

/** Everything the public pages need, loaded in one go. */
export interface SiteData {
  hero: HeroContent;
  nurseryPrograms: Program[];
  classPrograms: Program[];
  stats: SiteStat[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  branches: Branch[];
  announcements: Announcement[];
}
