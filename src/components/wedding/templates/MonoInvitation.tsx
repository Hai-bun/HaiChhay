import { cn } from "@/lib/utils";
import type { Guest, WeddingData } from "@/lib/weddingStore";
import { getTranslations, type Language } from "@/lib/i18n";
import { formatWeddingDate, formatWeddingTime } from "@/lib/weddingFormat";
import { CountdownTimer } from "../CountdownTimer";
import { TemplateSections, getCoupleDisplay, type SectionKey } from "./TemplateSections";
import { getTemplate } from "@/lib/templateConfig";

interface TemplateProps {
  weddingData: WeddingData;
  guest: Guest | null;
  language: Language;
}

export const MonoInvitation = ({
  weddingData,
  guest,
  language,
}: TemplateProps) => {
  const t = getTranslations(language);
  const { groom, bride } = getCoupleDisplay(weddingData, language);
  const animOn = weddingData.animations?.enabled ?? true;
  const fade = (c: string) => (animOn ? c : "");
  const order = getTemplate("mono").sectionOrder.filter(
    (k) => k !== "hero",
  ) as SectionKey[];

  return (
    <>
      <section className="mono-hero flex flex-col justify-center min-h-screen px-6 sm:px-14 py-20">
        <div className="max-w-4xl mx-auto w-full">
          <div className="mono-top">
            <span>{t.weInviteYou}</span>
            <span>{formatWeddingTime(weddingData.weddingTime, language)}</span>
          </div>
          <div className="mono-rule" />

          {guest && (
            <p className={cn("mono-guest mt-8", fade("animate-fade-in-up"))}>
              {t.welcomeGuest}, {guest.name}
            </p>
          )}

          <h1
            className={cn(
              "mono-name mt-6",
              fade("animate-fade-in-up delay-200"),
            )}>
            {groom}
          </h1>
          <h1
            className={cn(
              "mono-name",
              fade("animate-fade-in-up delay-300"),
            )}>
            {bride}
          </h1>

          <div className="mono-rule mt-10" />
          <div
            className={cn(
              "mono-bottom",
              fade("animate-fade-in-up delay-500"),
            )}>
            <span>{formatWeddingDate(weddingData.weddingDate, language)}</span>
            <span>{weddingData.eventTitle}</span>
          </div>

          {weddingData.showCountdown && (
            <div
              className={cn(
                "mt-14",
                fade("animate-fade-in-up delay-700"),
              )}>
              <p className="mono-countdown-label mb-5">{t.countingDown}</p>
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
