import { Language } from "./i18n";

const KHMER_WEEKDAYS = [
  "អាទិត្យ",
  "ច័ន្ទ",
  "អង្គារ",
  "ពុធ",
  "ព្រហស្បតិ៍",
  "សុក្រ",
  "សៅរ៍",
];

const KHMER_MONTHS = [
  "មករា",
  "កុម្ភៈ",
  "មីនា",
  "មេសា",
  "ឧសភា",
  "មិថុនា",
  "កក្កដា",
  "សីហា",
  "កញ្ញា",
  "តុលា",
  "វិច្ឆិកា",
  "ធ្នូ",
];

const KHMER_DIGITS = "០១២៣៤៥៦៧៨៩";

/** Replaces every 0-9 in a string/number with the Khmer numeral. */
export const toKhmerDigits = (value: string | number): string =>
  String(value).replace(/\d/g, (d) => KHMER_DIGITS[Number(d)]);

/** Khmer numerals when the guest chose Khmer, otherwise the text unchanged. */
export const localizeDigits = (
  value: string | number,
  language?: Language,
): string => (language === "km" ? toKhmerDigits(value) : String(value));

/** Long-form wedding date, localised to the guest's chosen language. */
export const formatWeddingDate = (
  dateStr: string,
  language: Language,
): string => {
  // Parse as local midnight so the displayed day never drifts to the previous
  // day for guests in negative-UTC timezones (plain "YYYY-MM-DD" parses as UTC).
  const date = new Date(`${dateStr}T00:00:00`);

  if (language === "km") {
    // Built by hand: Intl's km-KH data is often missing, which left the month
    // in English next to Khmer digits.
    return toKhmerDigits(
      `${KHMER_WEEKDAYS[date.getDay()]} ${date.getDate()} ${
        KHMER_MONTHS[date.getMonth()]
      } ${date.getFullYear()}`,
    );
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/** Weekday / day / month / year as separate strings (for stacked date layouts). */
export const getDateParts = (
  dateStr: string,
  language: Language,
): { weekday: string; day: string; month: string; year: string } => {
  const date = new Date(`${dateStr}T00:00:00`);
  if (language === "km") {
    return {
      weekday: KHMER_WEEKDAYS[date.getDay()],
      day: toKhmerDigits(String(date.getDate()).padStart(2, "0")),
      month: KHMER_MONTHS[date.getMonth()],
      year: toKhmerDigits(date.getFullYear()),
    };
  }
  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "long" }),
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleDateString("en-US", { month: "long" }),
    year: String(date.getFullYear()),
  };
};

/** Turns a stored "HH:mm" value into a 12-hour display time. */
export const formatWeddingTime = (
  timeStr: string,
  language?: Language,
): string => {
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours);
  const hour12 = hour % 12 || 12;
  if (language === "km") {
    // ព្រឹក = morning, រសៀល = afternoon, ល្ងាច = evening/night
    const period = hour < 12 ? "ព្រឹក" : hour < 18 ? "រសៀល" : "ល្ងាច";
    return `${toKhmerDigits(`${hour12}:${minutes}`)} ${period}`;
  }
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour12}:${minutes} ${ampm}`;
};
