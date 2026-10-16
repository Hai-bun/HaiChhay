import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/i18n";
import { localizeDigits } from "@/lib/weddingFormat";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS_KH = ["ច", "អ", "ព", "ព្រ", "សុ", "ស", "អា"];
const MONTHS_KH = [
  "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
  "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
];

// A small month view of the wedding month with the wedding day highlighted.
// Takes a plain "YYYY-MM-DD" string and does no timezone math.
export const MonthCalendar = ({
  dateStr,
  language,
}: {
  dateStr: string;
  language?: Language;
}) => {
  const km = language === "km";
  const parts = (dateStr || "").split("-").map(Number);
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [year, month, day] = parts; // month is 1-12

  const firstWeekday = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const lead = (firstWeekday + 6) % 7; // Monday-first offset
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < lead; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="month-calendar">
      <p className="month-calendar-title">
        {km ? MONTHS_KH[month - 1] : MONTHS[month - 1]} {localizeDigits(year, language)}
      </p>
      <div className="month-calendar-grid">
        {(km ? WEEKDAYS_KH : WEEKDAYS).map((w) => (
          <span key={w} className="month-calendar-wd">
            {w}
          </span>
        ))}
        {cells.map((c, i) => (
          <span
            key={i}
            className={cn(
              "month-calendar-day",
              c === day && "is-wedding",
            )}>
            {c === day ? (
              <Heart className="w-4 h-4" fill="currentColor" />
            ) : (
              c === null ? "" : localizeDigits(c, language)
            )}
          </span>
        ))}
      </div>
    </div>
  );
};
