import { Calendar } from "lucide-react";
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

export const ArtDecoInvitation = ({
  weddingData,
  guest,
  language,
}: TemplateProps) => {
  const t = getTranslations(language);
  const { groom, bride, amp } = getCoupleDisplay(weddingData, language);
  const animOn = weddingData.animations?.enabled ?? true;
  const fade = (c: string) => (animOn ? c : "");
  const order = getTemplate("artdeco").sectionOrder.filter(
    (k) => k !== "hero",
  ) as SectionKey[];

  return (
    <>
      <section className="artdeco-hero relative flex items-center justify-center min-h-screen px-4 py-16 overflow-hidden">
        <div className="artdeco-frame relative w-full max-w-2xl mx-auto text-center px-6 py-16 sm:px-14">
          <span className="artdeco-fan artdeco-fan-top" />
          <span className="artdeco-fan artdeco-fan-bottom" />

          {guest && (
            <p className={cn("artdeco-tag mb-6", fade("animate-fade-in-up"))}>
              {t.welcomeGuest}, {guest.name}
            </p>
          )}
          <p
            className={cn(
              "artdeco-kicker mb-8",
              fade("animate-fade-in-up delay-100"),
            )}>
            {t.weInviteYou}
          </p>

          <h1
            className={cn(
              "artdeco-name",
              fade("animate-fade-in-up delay-200"),
            )}>
            {groom}
          </h1>
          <div
            className={cn(
              "artdeco-divider",
              fade("animate-fade-in-up delay-300"),
            )}>
            <span>{amp}</span>
          </div>
          <h1
            className={cn("artdeco-name", fade("animate-fade-in-up delay-300"))}>
            {bride}
          </h1>

          <div
            className={cn(
              "artdeco-date mt-10 inline-flex items-center gap-2",
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
            <div className={cn("mt-10", fade("animate-fade-in-up delay-700"))}>
              <p className="artdeco-countdown-label mb-5">{t.countingDown}</p>
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
