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

export const SplitInvitation = ({
  weddingData,
  guest,
  language,
}: TemplateProps) => {
  const t = getTranslations(language);
  const { groom, bride, amp } = getCoupleDisplay(weddingData, language);
  const animOn = weddingData.animations?.enabled ?? true;
  const fade = (c: string) => (animOn ? c : "");
  const heroMedia = weddingData.backgroundImage || weddingData.photos[0];
  const isVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(heroMedia || "");
  const order = getTemplate("split").sectionOrder.filter(
    (k) => k !== "hero",
  ) as ("couple" | "story" | "schedule" | "location" | "gallery" | "gift" | "rsvp" | "footer")[];

  return (
    <>
      <section className="split-hero grid lg:grid-cols-2 min-h-screen">
        {/* Media panel */}
        <div className="split-media relative">
          {heroMedia ? (
            isVideo ? (
              <video
                className="split-media-el"
                src={heroMedia}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                className="split-media-el"
                src={heroMedia}
                alt={`${groom} & ${bride}`}
                loading="eager"
              />
            )
          ) : (
            <div className="split-media-fallback" />
          )}
          <div className="split-media-overlay" />
        </div>

        {/* Text panel */}
        <div className="split-panel flex items-center justify-center px-8 py-16 sm:px-14">
          <div className="w-full max-w-md text-center">
            {guest && (
              <p className={cn("split-guest mb-6", fade("animate-fade-in-up"))}>
                {t.welcomeGuest}, {guest.name}
              </p>
            )}
            <p
              className={cn(
                "split-kicker mb-8",
                fade("animate-fade-in-up delay-100"),
              )}>
              {t.weInviteYou}
            </p>

            <h1
              className={cn(
                "split-name font-script",
                fade("animate-fade-in-up delay-200"),
              )}>
              {groom}
            </h1>
            <div
              className={cn(
                "split-rule",
                fade("animate-fade-in-up delay-300"),
              )}>
              <span>{amp}</span>
            </div>
            <h1
              className={cn(
                "split-name font-script",
                fade("animate-fade-in-up delay-300"),
              )}>
              {bride}
            </h1>

            <div
              className={cn(
                "split-date mt-10 inline-flex items-center gap-2",
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
                <p className="split-countdown-label mb-4">{t.countingDown}</p>
                <CountdownTimer
                  targetDate={weddingData.weddingDate}
                  targetTime={weddingData.weddingTime}
                  language={language}
                />
              </div>
            )}
          </div>
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
