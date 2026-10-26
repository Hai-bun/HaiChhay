import {
  Cake,
  Camera,
  Gift,
  Heart,
  Music,
  Scissors,
  Sparkles,
  Users,
  Utensils,
  Wine,
  type LucideIcon,
} from "lucide-react";

// Icons an event can use. The key is what gets stored on the schedule item.
export const SCHEDULE_ICONS: Record<string, { label: string; Icon: LucideIcon }> = {
  users: { label: "Gathering", Icon: Users },
  music: { label: "Music / Procession", Icon: Music },
  scissors: { label: "Hair cutting", Icon: Scissors },
  utensils: { label: "Meal", Icon: Utensils },
  cake: { label: "Cake", Icon: Cake },
  wine: { label: "Toast / Drinks", Icon: Wine },
  camera: { label: "Photos", Icon: Camera },
  gift: { label: "Gifts", Icon: Gift },
  sparkles: { label: "Ceremony", Icon: Sparkles },
  heart: { label: "Heart", Icon: Heart },
};

// Fallback when no icon is chosen: guess from keywords in the title (English + Khmer).
const ICON_RULES: [RegExp, string][] = [
  [/hair|cut|សក់/i, "scissors"],
  [/lunch|dinner|breakfast|meal|food|reception|eat|អាហារ|ពិសា|ភោជន/i, "utensils"],
  [/cake|នំ/i, "cake"],
  [/toast|drink|cocktail|wine|ស្រា/i, "wine"],
  [/photo|picture|ថត|រូប/i, "camera"],
  [/dance|music|band|party|procession|parade|ហែ|ចម្រៀង|ភ្លេង|រាំ/i, "music"],
  [/gift|envelope|ស្បៀង|អំណោយ|ចងដៃ/i, "gift"],
  [/gather|meet|arriv|welcome|guest|family|ជួប|ទទួល|ភ្ញៀវ/i, "users"],
  [/ceremony|vow|ring|ពិធី|ភ្ជាប់|អាពាហ៍/i, "sparkles"],
];

export const resolveScheduleIcon = (icon: string | undefined, title: string): LucideIcon => {
  if (icon && SCHEDULE_ICONS[icon]) return SCHEDULE_ICONS[icon].Icon;
  const guess = ICON_RULES.find(([re]) => re.test(title))?.[1] ?? "heart";
  return SCHEDULE_ICONS[guess].Icon;
};
