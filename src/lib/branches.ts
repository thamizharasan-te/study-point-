/**
 * The two branches, in one place: the details used when the database has none (and the source for
 * supabase/update_branches.sql). The LIVE website reads the saved details from the database, which the owner edits in
 * Admin → Branches. If you change a value here, run supabase/update_branches.sql so the database matches.
 *
 * Fill in every TODO(owner) below when the real details are known. Public text must not contain "TODO".
 */
export interface BranchConfig {
  id: string;
  name: string;
  /** English address, as shown on the Contact page, footer and in search-engine data. */
  address: string;
  /** Tamil address (same place, written in Tamil). */
  address_ta: string;
  /** One or more phone numbers for THIS branch. */
  phones: string[];
  whatsapp: string;
  /** Class timings in English / Tamil. */
  hours: string;
  hours_ta: string;
  /** Google Maps "Embed a map" link (https://www.google.com/maps/embed?…) or a normal Maps link; empty = search by address. */
  map_url: string;
  sort_order: number;
  /** false = the site shows "Details to be confirmed" on this branch. Set true once everything here is real. */
  confirmed: boolean;
}

/** Shown until the real timings are given. */
const CALL_FOR_TIMINGS = "Please call us for class timings";
const CALL_FOR_TIMINGS_TA = "வகுப்பு நேரங்களுக்கு எங்களை அழையுங்கள்";

export const BRANCHES: BranchConfig[] = [
  {
    id: "point-pedro",
    name: "Point Pedro",
    // TODO(owner): full street address of the Point Pedro branch (street, landmark, postal code).
    address: "Point Pedro, Northern Province, Sri Lanka",
    address_ta: "பருத்தித்துறை, வட மாகாணம், இலங்கை", // TODO(owner): Tamil version of the street address
    // TODO(owner): this branch's own phone number(s). At the moment both branches share the same two numbers.
    phones: ["0767666826", "0767666827"],
    whatsapp: "0767666826",
    // TODO(owner): real class timings, e.g. "Mon–Fri 3:00 pm – 6:00 pm · Sat 9:00 am – 12:00 pm"
    hours: CALL_FOR_TIMINGS,
    hours_ta: CALL_FOR_TIMINGS_TA, // TODO(owner): Tamil version of the timings
    map_url: "", // TODO(owner): Google "Embed a map" link for this branch
    sort_order: 1,
    confirmed: false,
  },
  {
    id: "vathiry",
    name: "Vathiry",
    address: "M.M.V. Road, Nelliady, Point Pedro 40000",
    address_ta: "எம்.எம்.வி. வீதி, நெல்லியடி, பருத்தித்துறை 40000",
    // TODO(owner): this branch's own phone number(s). At the moment both branches share the same two numbers.
    phones: ["0767666826", "0767666827"],
    whatsapp: "0767666827",
    // TODO(owner): real class timings for the Vathiry branch.
    hours: CALL_FOR_TIMINGS,
    hours_ta: CALL_FOR_TIMINGS_TA, // TODO(owner): Tamil version of the timings
    map_url: "", // TODO(owner): Google "Embed a map" link for this branch
    sort_order: 2,
    confirmed: false,
  },
];
