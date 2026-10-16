import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Guest, WeddingData } from "@/lib/weddingStore";
import { getTranslations, type Language } from "@/lib/i18n";
import { formatWeddingDate, formatWeddingTime } from "@/lib/weddingFormat";
import { CountdownTimer } from "../CountdownTimer";
import { TemplateSections, getCoupleDisplay } from "./TemplateSections";
import { getTemplate } from "@/lib/templateConfig";

interface TemplateProps {
  weddingData: WeddingData;
  guest: Guest | null;
  language: Language;
}

// A gold flourish used in each corner of the ceremonial frame.
const CornerFlourish = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 60 60"
    className={cn("royal-corner", className)}
    fill="none"
    aria-hidden="true">
    <path
      d="M2 2h20M2 2v20M2 2c14 0 26 12 26 26"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10 10c9 0 16 7 16 16"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.7"
    />
    <circle cx="6" cy="6" r="2.2" fill="currentColor" />
  </svg>
);

export const RoyalInvitation = ({
  weddingData,
  guest,
  language,
}: TemplateProps) => {
  const t = getTranslations(language);
  const { groom, bride, amp } = getCoupleDisplay(weddingData, language);
  const animOn = weddingData.animations?.enabled ?? true;
  const fade = (c: string) => (animOn ? c : "");
  const order = getTemplate("royal").sectionOrder.filter(
    (k) => k !== "hero",
  ) as ("couple" | "story" | "schedule" | "location" | "gallery" | "gift" | "rsvp" | "footer")[];

  return (
    <>
      <section className="royal-hero relative flex items-center justify-center min-h-screen px-4 py-16 overflow-hidden">
        <div className="royal-frame relative w-full max-w-2xl mx-auto text-center px-6 py-14 sm:px-12 sm:py-16">
          <CornerFlourish className="royal-corner-tl" />
          <CornerFlourish className="royal-corner-tr" />
          <CornerFlourish className="royal-corner-bl" />
          <CornerFlourish className="royal-corner-br" />

          {guest && (
            <p className={cn("royal-tag mb-6", fade("animate-fade-in-up"))}>
              {t.welcomeGuest}, {guest.name}
            </p>
          )}

          <p
            className={cn(
              "royal-kicker mb-8",
              fade("animate-fade-in-up delay-100"),
            )}>
            {t.weInviteYou}
          </p>

          <h1
            className={cn(
              "royal-name font-script",
              fade("animate-fade-in-up delay-200"),
            )}>
            {groom}
          </h1>

          <div
            className={cn(
              "royal-amp my-3",
              fade("animate-fade-in-up delay-300"),
            )}>
            {amp}
          </div>

          <h1
            className={cn(
              "royal-name font-script",
              fade("animate-fade-in-up delay-300"),
            )}>
            {bride}
          </h1>

          <div
            className={cn(
              "royal-date mt-10 inline-flex items-center gap-2",
              fade("animate-fade-in-up delay-500"),
            )}>
            <Calendar className="w-4 h-4" />
            <span>
              {formatWeddingDate(weddingData.weddingDate, language)}
              {" · "}
              {formatWeddingTime(weddingData.weddingTime, language)}
            </span>
          </div>

          {weddingData.showCountdown && (
            <div
              className={cn(
                "mt-10",
                fade("animate-fade-in-up delay-700"),
              )}>
              <p className="royal-countdown-label mb-5">{t.countingDown}</p>
              <CountdownTimer
                targetDate={weddingData.weddingDate}
                targetTime={weddingData.weddingTime}
                language={language}
              />
            </div>
          )}
        </div>
      </section>

      <TemplateSections
        weddingData={weddingData}
        guest={guest}
        language={language}
        order={order}
      />
    </>
  );
};
