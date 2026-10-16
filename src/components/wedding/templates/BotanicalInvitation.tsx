import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Guest, WeddingData } from "@/lib/weddingStore";
import { getTranslations, type Language } from "@/lib/i18n";
import { formatWeddingDate, formatWeddingTime } from "@/lib/weddingFormat";
import { CountdownTimer } from "../CountdownTimer";
import { FloatingPetals } from "@/components/ui/FloatingPetals";
import { TemplateSections, getCoupleDisplay } from "./TemplateSections";
import { getTemplate } from "@/lib/templateConfig";

interface TemplateProps {
  weddingData: WeddingData;
  guest: Guest | null;
  language: Language;
}

// A leafy sprig; mirrored on each side of the couple names to form an arch.
const LeafSprig = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 80 160"
    className={cn("botanical-sprig", className)}
    fill="none"
    aria-hidden="true">
    <path
      d="M40 160C40 120 40 40 40 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const y = 20 + i * 22;
      return (
        <g key={i}>
          <path
            d={`M40 ${y}C24 ${y - 6} 14 ${y + 4} 8 ${y + 16}C26 ${y + 12} 36 ${y + 6} 40 ${y}Z`}
            fill="currentColor"
            opacity="0.55"
          />
          <path
            d={`M40 ${y + 10}C56 ${y + 4} 66 ${y + 14} 72 ${y + 26}C54 ${y + 22} 44 ${y + 16} 40 ${y + 10}Z`}
            fill="currentColor"
            opacity="0.4"
          />
        </g>
      );
    })}
  </svg>
);

export const BotanicalInvitation = ({
  weddingData,
  guest,
  language,
}: TemplateProps) => {
  const t = getTranslations(language);
  const { groom, bride, amp } = getCoupleDisplay(weddingData, language);
  const anim = weddingData.animations;
  const animOn = anim?.enabled ?? true;
  const fade = (c: string) => (animOn ? c : "");
  const order = getTemplate("botanical").sectionOrder.filter(
    (k) => k !== "hero",
  ) as ("couple" | "story" | "schedule" | "location" | "gallery" | "gift" | "rsvp" | "footer")[];

  return (
    <>
      {animOn && anim?.floatingPetals && <FloatingPetals />}
      <section className="botanical-hero relative flex items-center justify-center min-h-screen px-4 py-20 overflow-hidden">
        <div className="botanical-content relative text-center max-w-xl mx-auto">
          <LeafSprig className="botanical-sprig-left" />
          <LeafSprig className="botanical-sprig-right" />

          {guest && (
            <p className={cn("botanical-tag mb-5", fade("animate-fade-in-up"))}>
              {t.welcomeGuest}, {guest.name}
            </p>
          )}

          <p
            className={cn(
              "botanical-kicker mb-8",
              fade("animate-fade-in-up delay-100"),
            )}>
            {t.weInviteYou}
          </p>

          <h1
            className={cn(
              "botanical-name font-script",
              fade("animate-fade-in-up delay-200"),
            )}>
            {groom}
          </h1>
          <div
            className={cn(
              "botanical-amp my-2",
              fade("animate-fade-in-up delay-300"),
            )}>
            {amp}
          </div>
          <h1
            className={cn(
              "botanical-name font-script",
              fade("animate-fade-in-up delay-300"),
            )}>
            {bride}
          </h1>

          <div
            className={cn(
              "botanical-date mt-8 inline-flex items-center gap-2",
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
              <p className="botanical-countdown-label mb-5">
                {t.countingDown}
              </p>
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
