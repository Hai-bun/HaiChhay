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

// A palm frond; mirrored in the hero corners.
const PalmLeaf = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 200" className={cn("tropical-palm", className)} fill="none" aria-hidden="true">
    <path d="M60 200C60 150 58 70 78 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => {
      const y = 24 + i * 24;
      return (
        <g key={i}>
          <path d={`M${62 - i} ${y}C40 ${y - 10} 20 ${y - 4} 4 ${y + 10}C28 ${y + 8} 48 ${y + 4} ${62 - i} ${y}Z`} fill="currentColor" opacity="0.5" />
          <path d={`M${64 + i} ${y + 8}C86 ${y - 2} 106 ${y + 4} 118 ${y + 20}C96 ${y + 16} 78 ${y + 12} ${64 + i} ${y + 8}Z`} fill="currentColor" opacity="0.4" />
        </g>
      );
    })}
  </svg>
);

export const TropicalInvitation = ({
  weddingData,
  guest,
  language,
}: TemplateProps) => {
  const t = getTranslations(language);
  const { groom, bride, amp } = getCoupleDisplay(weddingData, language);
  const animOn = weddingData.animations?.enabled ?? true;
  const fade = (c: string) => (animOn ? c : "");
  const heroMedia = weddingData.backgroundImage || weddingData.photos[0];
  const order = getTemplate("tropical").sectionOrder.filter(
    (k) => k !== "hero",
  ) as SectionKey[];

  return (
    <>
      <section className="tropical-hero relative flex items-center justify-center min-h-screen px-4 py-20 overflow-hidden">
        {heroMedia && (
          <div
            className="tropical-hero-media"
            style={{ backgroundImage: `url(${heroMedia})` }}
          />
        )}
        <div className="tropical-hero-overlay" />
        <PalmLeaf className="tropical-palm-tl" />
        <PalmLeaf className="tropical-palm-tr" />

        <div className="tropical-content relative text-center max-w-xl mx-auto">
          {guest && (
            <p className={cn("tropical-tag mb-5", fade("animate-fade-in-up"))}>
              {t.welcomeGuest}, {guest.name}
            </p>
          )}
          <p
            className={cn(
              "tropical-kicker mb-6",
              fade("animate-fade-in-up delay-100"),
            )}>
            {t.weInviteYou}
          </p>

          <h1
            className={cn(
              "tropical-name font-script",
              fade("animate-fade-in-up delay-200"),
            )}>
            {groom}
          </h1>
          <div
            className={cn(
              "tropical-amp my-1",
              fade("animate-fade-in-up delay-300"),
            )}>
            {amp}
          </div>
          <h1
            className={cn(
              "tropical-name font-script",
              fade("animate-fade-in-up delay-300"),
            )}>
            {bride}
          </h1>

          <div
            className={cn(
              "tropical-date mt-8 inline-flex items-center gap-2",
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
              <p className="tropical-countdown-label mb-4">{t.countingDown}</p>
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
