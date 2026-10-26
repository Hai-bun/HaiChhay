import { useEffect, useRef, useState } from "react";
import { revealOnScroll } from "@/lib/revealOnScroll";
import { Clock } from "lucide-react";
import { resolveScheduleIcon } from "@/lib/scheduleIcons";
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

  // Scroll animation: each event slides in (dot pops, rail line draws down) as
  // it reaches the viewport. Progressive — items stay visible until armed.
  const listRef = useRef<HTMLOListElement>(null);
  const [armed, setArmed] = useState(false);
  const shown = !!schedule?.enabled && (schedule?.items?.length ?? 0) > 0;

  useEffect(() => {
    const list = listRef.current;
    if (!shown || !list || typeof IntersectionObserver === "undefined") return;
    const items = Array.from(list.querySelectorAll<HTMLElement>(".schedule-item"));
    setArmed(true);
    return revealOnScroll(items, "is-in", { threshold: 0.25, rootMargin: "0px 0px -8% 0px" });
  }, [shown, schedule?.items, lang]);

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

        <ol ref={listRef} className="schedule-timeline" data-anim={armed ? "on" : undefined}>
          {items.map((item, index) => {
            const itemTitle =
              km && item.titleKh?.trim() ? item.titleKh : item.title;
            const itemDesc =
              km && item.descriptionKh?.trim()
                ? item.descriptionKh
                : item.description;
            const EventIcon = resolveScheduleIcon(item.icon, `${item.title ?? ""} ${item.titleKh ?? ""}`);
            return (
              <li key={item.id || index} className="schedule-item flex gap-5">
                {/* Rail: dot + connecting line */}
                <div className="flex flex-col items-center">
                  <span className="schedule-dot w-9 h-9 rounded-full bg-primary text-primary-foreground ring-4 ring-background shrink-0 flex items-center justify-center">
                    <EventIcon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  {index < items.length - 1 && (
                    <span className="schedule-line w-px flex-1 bg-primary/25 my-1" />
                  )}
                </div>

                {/* Content */}
                <div className="schedule-content pb-8">
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
