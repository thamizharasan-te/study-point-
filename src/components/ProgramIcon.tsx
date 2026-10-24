import {
  ALargeSmall, BookOpen, MessageCircle, Palette, PenLine, Puzzle, Smile, Sprout, Star, Trophy, Users,
  type LucideIcon,
} from "lucide-react";

// Picks an icon from the programme title, so programmes added/renamed in
// /admin still get a sensible icon (falls back to a star).
const MAP: [RegExp, LucideIcon][] = [
  [/phonic|ஒலிப்பியல்/i, ALargeSmall],
  [/creative|art|படைப்பாற்றல்/i, Palette],
  [/play|விளையாட்டு/i, Puzzle],
  [/social|சமூக/i, Smile],
  [/confiden|தன்னம்பிக்கை/i, Sprout],
  [/spoken|speak|பேச்சு/i, MessageCircle],
  [/writing|write|எழுத்து/i, PenLine],
  [/group|குழு/i, Users],
  [/exam|தேர்வு/i, Trophy],
  [/english|grammar|read|ஆங்கிலம்|இலக்கணம்/i, BookOpen],
];

export function ProgramIcon({ title, className }: { title: string; className?: string }) {
  const Icon = MAP.find(([re]) => re.test(title))?.[1] ?? Star;
  return <Icon className={className} aria-hidden />;
}
