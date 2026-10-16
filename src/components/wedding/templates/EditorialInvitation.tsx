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

export const EditorialInvitation = ({
  weddingData,
  guest,
  language,
}: TemplateProps) => {
  const t = getTranslations(language);
  const { groom, bride, amp } = getCoupleDisplay(weddingData, language);
  const animOn = weddingData.animations?.enabled ?? true;
  const fade = (c: string) => (animOn ? c : "");
  const heroPhoto = weddingData.photos[0] || weddingData.backgroundImage;
  const order = getTemplate("editorial").sectionOrder.filter(
    (k) => k !== "hero",
  ) as ("couple" | "story" | "schedule" | "location" | "gallery" | "gift" | "rsvp" | "footer")[];

  return (
    <>
      <section className="editorial-hero px-6 sm:px-10 lg:px-16 pt-16 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="editorial-masthead">
            <span>{t.weInviteYou}</span>
            <span className="editorial-issue">
              {formatWeddingDate(weddingData.weddingDate, language)}
            </span>
          </div>
          <div className="editorial-rule" />

          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-end mt-10">
            <div>
              {guest && (
                <p
                  className={cn(
                    "editorial-guest mb-6",
                    fade("animate-fade-in-up"),
                  )}>
                  {t.welcomeGuest}, {guest.name}
                </p>
              )}
              <p
                className={cn(
                  "editorial-label mb-4",
                  fade("animate-fade-in-up delay-100"),
                )}>
                {t.theCouple}
              </p>
              <h1
                className={cn(
                  "editorial-name",
                  fade("animate-fade-in-up delay-200"),
                )}>
                {groom}
              </h1>
              <span
                className={cn(
                  "editorial-amp",
                  fade("animate-fade-in-up delay-300"),
                )}>
                {amp}
              </span>
              <h1
                className={cn(
                  "editorial-name",
                  fade("animate-fade-in-up delay-300"),
                )}>
                {bride}
              </h1>

              <p
                className={cn(
                  "editorial-time mt-8",
                  fade("animate-fade-in-up delay-500"),
                )}>
                {formatWeddingTime(weddingData.weddingTime, language)} &middot;{" "}
                {weddingData.eventTitle}
              </p>
            </div>

            {heroPhoto && (
              <div
                className={cn(
                  "editorial-photo",
                  fade("animate-fade-in-up delay-500"),
                )}>
                <img src={heroPhoto} alt={`${groom} & ${bride}`} loading="eager" />
              </div>
            )}
          </div>

          {weddingData.showCountdown && (
            <div
              className={cn(
                "editorial-countdown mt-12",
                fade("animate-fade-in-up delay-700"),
              )}>
              <span className="editorial-label">{t.countingDown}</span>
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
