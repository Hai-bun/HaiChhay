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

export const PolaroidInvitation = ({
  weddingData,
  guest,
  language,
}: TemplateProps) => {
  const t = getTranslations(language);
  const { groom, bride, amp } = getCoupleDisplay(weddingData, language);
  const animOn = weddingData.animations?.enabled ?? true;
  const fade = (c: string) => (animOn ? c : "");
  const heroPhoto = weddingData.photos[0] || weddingData.backgroundImage;
  const order = getTemplate("polaroid").sectionOrder.filter(
    (k) => k !== "hero",
  ) as SectionKey[];

  return (
    <>
      <section className="polaroid-hero relative flex items-center justify-center min-h-screen px-4 py-20 overflow-hidden">
        <div className="polaroid-content relative text-center max-w-xl mx-auto">
          {guest && (
            <p className={cn("polaroid-tag mb-4", fade("animate-fade-in-up"))}>
              {t.welcomeGuest}, {guest.name}
            </p>
          )}

          {heroPhoto && (
            <div
              className={cn(
                "polaroid-photo mx-auto mb-6",
                fade("animate-fade-in-up delay-100"),
              )}>
              <span className="polaroid-tape" />
              <img src={heroPhoto} alt={`${groom} & ${bride}`} loading="eager" />
              <span className="polaroid-caption">{t.weInviteYou}</span>
            </div>
          )}

          <h1
            className={cn(
              "polaroid-name font-script",
              fade("animate-fade-in-up delay-200"),
            )}>
            {groom}
            <span className="polaroid-amp"> {amp} </span>
            {bride}
          </h1>

          <div
            className={cn(
              "polaroid-date mt-6 inline-flex items-center gap-2",
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
              <p className="polaroid-countdown-label mb-4">{t.countingDown}</p>
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
