import { Clock } from "lucide-react";
import type { ScheduleConfig } from "@/lib/weddingStore";
import { getTranslations, type Language, getStoredLanguage } from "@/lib/i18n";
import { formatWeddingTime, localizeDigits } from "@/lib/weddingFormat";

interface ScheduleSectionProps {
  schedule: ScheduleConfig;
  language?: Language;
}

// Renders "HH:mm" as a 12-hour time, but leaves any other free-text as-is.
const displayTime = (time: string, lang: Language): string =>
  /^\d{1,2}:\d{2}$/.test(time.trim())
    ? formatWeddingTime(time.trim(), lang)
    : localizeDigits(time, lang);

export const ScheduleSection = ({ schedule, language }: ScheduleSectionProps) => {
  const lang = language || getStoredLanguage();
  const t = getTranslations(lang);

  const items = (schedule?.items ?? []).filter(
    (item) => item.title?.trim() || item.time?.trim(),
  );

  if (!schedule?.enabled || items.length === 0) return null;

  const km = lang === "km";
  const sectionTitle = km
    ? schedule.titleKh?.trim() || t.weddingSchedule
    : schedule.title?.trim() || t.weddingSchedule;

  return (
    <section id="schedule" className="scroll-reveal py-16 px-4 bg-romantic-gradient">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
            {sectionTitle}
          </h2>
        </div>

        <ol className="schedule-timeline">
          {items.map((item, index) => {
            const itemTitle =
              km && item.titleKh?.trim() ? item.titleKh : item.title;
            const itemDesc =
              km && item.descriptionKh?.trim()
                ? item.descriptionKh
                : item.description;
            return (
              <li key={item.id || index} className="flex gap-5">
                {/* Rail: dot + connecting line */}
                <div className="flex flex-col items-center">
                  <span className="mt-1.5 w-4 h-4 rounded-full bg-primary ring-4 ring-background shrink-0" />
                  {index < items.length - 1 && (
                    <span className="w-px flex-1 bg-primary/25 my-1" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8">
                  <p className="font-serif text-lg font-semibold text-primary leading-none">
                    {displayTime(item.time, lang)}
                  </p>
                  <h3 className="font-serif text-lg font-semibold text-foreground mt-1.5">
                    {localizeDigits(itemTitle, lang)}
                  </h3>
                  {itemDesc?.trim() && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {localizeDigits(itemDesc, lang)}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
