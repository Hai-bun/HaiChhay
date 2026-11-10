import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import type { WeddingData } from "@/lib/weddingStore";
import { getTranslations, type Language } from "@/lib/i18n";
import { downloadIcs, getCalendarEvent, googleCalendarUrl } from "@/lib/calendarEvent";

export const AddToCalendar = ({ weddingData, language }: { weddingData: WeddingData; language: Language }) => {
  const [open, setOpen] = useState(false);
  const t = getTranslations(language);
  const event = getCalendarEvent(weddingData);
  if (!event) return null;

  return (
    <div className="add-cal">
      <button type="button" className="add-cal-btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <CalendarPlus className="w-4 h-4" />
        <span>{t.addToCalendar}</span>
      </button>
      {open && (
        <div className="add-cal-menu">
          <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            {t.addToGoogleCalendar}
          </a>
          <button
            type="button"
            onClick={() => {
              downloadIcs(event);
              setOpen(false);
            }}
          >
            {t.addToAppleCalendar}
          </button>
        </div>
      )}
    </div>
  );
};
