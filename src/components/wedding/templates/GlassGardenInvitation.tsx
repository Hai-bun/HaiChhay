import { Calendar, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Guest, WeddingData } from "@/lib/weddingStore";
import { getTranslations, type Language } from "@/lib/i18n";
import { formatWeddingDate, formatWeddingTime } from "@/lib/weddingFormat";
import { CountdownTimer } from "../CountdownTimer";
import { MonthCalendar } from "../MonthCalendar";
import { CoverflowGallery } from "../CoverflowGallery";
import { PhotoGallery } from "../PhotoGallery";
import { TemplateSections, getCoupleDisplay, type SectionKey } from "./TemplateSections";
import { getTemplate } from "@/lib/templateConfig";

interface TemplateProps {
  weddingData: WeddingData;
  guest: Guest | null;
  language: Language;
}

// A leafy sprig tucked into the glass-card corners for the garden feel.
const LeafAccent = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 60 60" className={cn("glass-leaf", className)} fill="none" aria-hidden="true">
    {[0, 1, 2, 3].map((i) => {
      const t = 8 + i * 12;
      return (
        <path
          key={i}
          d={`M8 52C${20 + t / 3} ${44 - t} ${30 + t / 2} ${34 - t} ${52 - i * 2} ${12 + i * 3}`}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity={0.5 - i * 0.08}
        />
      );
    })}
    {[0, 1, 2, 3, 4].map((i) => (
      <ellipse
        key={`l${i}`}
        cx={14 + i * 8}
        cy={46 - i * 8}
        rx="5"
        ry="2.6"
        fill="currentColor"
        opacity="0.5"
        transform={`rotate(${-40 - i * 4} ${14 + i * 8} ${46 - i * 8})`}
      />
    ))}
  </svg>
);

export const GlassGardenInvitation = ({
  weddingData,
  guest,
  language,
}: TemplateProps) => {
  const t = getTranslations(language);
  const { groom, bride, amp } = getCoupleDisplay(weddingData, language);
  const animOn = weddingData.animations?.enabled ?? true;
  const fade = (c: string) => (animOn ? c : "");
  const order = getTemplate("glassgarden").sectionOrder.filter(
    (k) => k !== "hero",
  ) as SectionKey[];

  return (
    <>
      <section className="glass-hero relative flex items-center justify-center min-h-screen px-4 py-16">
        <div className="glass-card relative w-full max-w-md mx-auto text-center px-7 py-14">
          <LeafAccent className="glass-leaf-tl" />
          <LeafAccent className="glass-leaf-br" />

          <span className="glass-heart">
            <Heart className="w-5 h-5" fill="currentColor" />
          </span>

          {guest && (
            <p className={cn("glass-tag mt-2 mb-4", fade("animate-fade-in-up"))}>
              {t.welcomeGuest}, {guest.name}
            </p>
          )}

          <h1
            className={cn(
              "glass-name font-script",
              fade("animate-fade-in-up delay-200"),
            )}>
            {groom}
          </h1>
          <div
            className={cn("glass-amp", fade("animate-fade-in-up delay-300"))}>
            {amp}
          </div>
          <h1
            className={cn(
              "glass-name font-script",
              fade("animate-fade-in-up delay-300"),
            )}>
            {bride}
          </h1>

          <div
            className={cn(
              "glass-date mt-6 inline-flex items-center gap-2",
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
            <div className={cn("mt-8", fade("animate-fade-in-up delay-700"))}>
              <CountdownTimer
                targetDate={weddingData.weddingDate}
                targetTime={weddingData.weddingTime}
                language={language}
              />
            </div>
          )}
        </div>
      </section>

      {/* Save-the-date calendar in a glass panel */}
      <section className="glass-cal-section scroll-reveal py-16 px-4">
        <div className="glass-card glass-card-flat max-w-sm mx-auto text-center px-6 py-10">
          <p className="glass-tag mb-1">{t.countingDown}</p>
          <MonthCalendar dateStr={weddingData.weddingDate} language={language} />
        </div>
      </section>

      {weddingData.galleryLayout && weddingData.galleryLayout !== "default" ? (
        <PhotoGallery photos={weddingData.photos} language={language} layout={weddingData.galleryLayout} />
      ) : (
        <CoverflowGallery photos={weddingData.photos} language={language} />
      )}

      <TemplateSections
        weddingData={weddingData}
        guest={guest}
        language={language}
        order={order}
      />
    </>
  );
};
