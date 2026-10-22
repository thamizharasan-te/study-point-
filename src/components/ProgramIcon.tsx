import {
  ALargeSmall, BookOpen, MessageCircle, Palette, PenLine, Puzzle, Smile, Sprout, Star, Trophy, Users,
  type LucideIcon,
} from "lucide-react";

// Picks an icon from the programme title, so programmes added/renamed in
// /admin still get a sensible icon (falls back to a star).
const MAP: [RegExp, LucideIcon][] = [
  [/phonic/i, ALargeSmall],
  [/creative|art/i, Palette],
  [/play/i, Puzzle],
  [/social/i, Smile],
  [/confiden/i, Sprout],
  [/spoken|speak/i, MessageCircle],
  [/writing|write/i, PenLine],
  [/group/i, Users],
  [/exam/i, Trophy],
  [/english|grammar|read/i, BookOpen],
];

export function ProgramIcon({ title, className }: { title: string; className?: string }) {
  const Icon = MAP.find(([re]) => re.test(title))?.[1] ?? Star;
  return <Icon className={className} aria-hidden />;
}
