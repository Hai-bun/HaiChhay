import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import type { WeddingData } from "@/lib/weddingStore";
import { getTranslations, type Language } from "@/lib/i18n";
import { downloadIcs, getCalendarEvent, googleCalendarUrl } from "@/lib/calendarEvent";

type Platform = "ios" | "android" | "other";

// iPadOS 13+ reports itself as a Mac, so a touch screen on a "Macintosh" is an iPad.
const detectPlatform = (): Platform => {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
};

export const AddToCalendar = ({ weddingData, language }: { weddingData: WeddingData; language: Language }) => {
  const [open, setOpen] = useState(false);
  const t = getTranslations(language);
  const event = getCalendarEvent(weddingData);
  if (!event) return null;

  const platform = detectPlatform();
  // On Android a same-tab link lets the Calendar app claim the URL and open the new-event screen;
  // a new tab can land on the plain month view instead. Desktop keeps the new tab.
  const google = () =>
    platform === "android"
      ? window.location.assign(googleCalendarUrl(event))
      : window.open(googleCalendarUrl(event), "_blank", "noopener,noreferrer");
  const apple = () => downloadIcs(event);

  // Phones get their own calendar straight away; desktop gets a small choice.
  if (platform !== "other") {
    return (
      <div className="add-cal">
        <button type="button" className="add-cal-btn" onClick={platform === "ios" ? apple : google}>
          <CalendarPlus className="w-4 h-4" />
          <span>{t.addToCalendar}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="add-cal">
      <button type="button" className="add-cal-btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <CalendarPlus className="w-4 h-4" />
        <span>{t.addToCalendar}</span>
      </button>
      {open && (
        <div className="add-cal-menu">
          <button
            type="button"
            onClick={() => {
              google();
              setOpen(false);
            }}
          >
            {t.addToGoogleCalendar}
          </button>
          <button
            type="button"
            onClick={() => {
              apple();
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
