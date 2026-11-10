import type { WeddingData } from "@/lib/weddingStore";

const EVENT_HOURS = 3;
const pad = (n: number) => String(n).padStart(2, "0");

/** UTC stamp like 20261220T100000Z. */
const stamp = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  location: string;
  description: string;
}

/** Wedding date/time is Cambodia time (UTC+7), so guests abroad still get the right hour. */
export const getCalendarEvent = (data: WeddingData): CalendarEvent | null => {
  if (!data.weddingDate) return null;
  const time = /^\d{1,2}:\d{2}/.test(data.weddingTime) ? data.weddingTime.slice(0, 5).padStart(5, "0") : "09:00";
  const start = new Date(`${data.weddingDate}T${time}:00+07:00`);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start.getTime() + EVENT_HOURS * 60 * 60 * 1000);
  return {
    title: `${data.groomName} & ${data.brideName} Wedding`,
    start,
    end,
    location: [data.eventTitle, data.eventAddress].filter(Boolean).join(", "),
    description: data.eventMapUrl ? `Map: ${data.eventMapUrl}` : "",
  };
};

export const googleCalendarUrl = (e: CalendarEvent) =>
  "https://calendar.google.com/calendar/render?" +
  new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${stamp(e.start)}/${stamp(e.end)}`,
    details: e.description,
    location: e.location,
  }).toString();

const BS = String.fromCharCode(92);
const icsEscape = (v: string) =>
  v
    .split(BS).join(BS + BS)
    .split(";").join(BS + ";")
    .split(",").join(BS + ",")
    .split(/\r?\n/).join(BS + "n");

export const downloadIcs = (e: CalendarEvent) => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Everlasting Invitations//EN",
    "BEGIN:VEVENT",
    `UID:${stamp(e.start)}-wedding@everlasting-invitations`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(e.start)}`,
    `DTEND:${stamp(e.end)}`,
    `SUMMARY:${icsEscape(e.title)}`,
    `LOCATION:${icsEscape(e.location)}`,
    `DESCRIPTION:${icsEscape(e.description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:Wedding tomorrow",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  // iPhone / iPad / Mac Safari open a calendar file straight into "Add to Calendar", so navigate to it
  // instead of forcing a download. Everything else gets a normal file download.
  const ua = navigator.userAgent;
  const isApple = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) || (/Safari/.test(ua) && /Macintosh/.test(ua) && !/Chrome|Chromium|Edg/.test(ua));
  if (isApple) {
    window.location.href = url;
  } else {
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};
