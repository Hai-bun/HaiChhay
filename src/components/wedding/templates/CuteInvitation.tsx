import type { CSSProperties } from "react";
import { Calendar, Heart } from "lucide-react";
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

// Stickers that ring the hero card. `pos` places them on the card border,
// `anim` picks a wiggle/bounce/spin keyframe, `d` staggers the timing.
const BORDER_STICKERS: Array<{
  e: string;
  pos: CSSProperties;
  anim: string;
  d: string;
}> = [
  { e: "🎀", pos: { top: "-20px", left: "8%" }, anim: "cute-wiggle", d: "0s" },
  { e: "🌸", pos: { top: "-22px", left: "34%" }, anim: "cute-bounce", d: "0.4s" },
  { e: "💕", pos: { top: "-22px", left: "62%" }, anim: "cute-wiggle", d: "0.8s" },
  { e: "⭐", pos: { top: "-20px", right: "6%" }, anim: "cute-spin", d: "0.2s" },
  { e: "🦋", pos: { top: "32%", left: "-20px" }, anim: "cute-float", d: "0.6s" },
  { e: "🍓", pos: { top: "64%", left: "-20px" }, anim: "cute-bounce", d: "1.1s" },
  { e: "🌷", pos: { top: "30%", right: "-20px" }, anim: "cute-wiggle", d: "0.3s" },
  { e: "🧸", pos: { top: "62%", right: "-20px" }, anim: "cute-float", d: "0.9s" },
  { e: "💗", pos: { bottom: "-20px", left: "10%" }, anim: "cute-bounce", d: "0.5s" },
  { e: "🌈", pos: { bottom: "-22px", left: "40%" }, anim: "cute-wiggle", d: "1.0s" },
  { e: "🍰", pos: { bottom: "-22px", left: "66%" }, anim: "cute-float", d: "0.7s" },
  { e: "⭐", pos: { bottom: "-20px", right: "8%" }, anim: "cute-spin", d: "1.3s" },
];

export const CuteInvitation = ({
  weddingData,
  guest,
  language,
}: TemplateProps) => {
  const t = getTranslations(language);
  const { groom, bride } = getCoupleDisplay(weddingData, language);
  const animOn = weddingData.animations?.enabled ?? true;
  const fade = (c: string) => (animOn ? c : "");
  const order = getTemplate("cute").sectionOrder.filter(
    (k) => k !== "hero",
  ) as SectionKey[];

  return (
    <>
      <section className="cute-hero relative flex items-center justify-center min-h-screen px-4 py-16 overflow-hidden">
        <div className="cute-card relative w-full max-w-md mx-auto text-center px-7 py-14">
          {/* Animated stickers around the border */}
          {BORDER_STICKERS.map((s, i) => (
            <span
              key={i}
              className={cn("cute-border-sticker", animOn && s.anim)}
              style={{ ...s.pos, animationDelay: s.d } as CSSProperties}
              aria-hidden="true">
              {s.e}
            </span>
          ))}

          {guest && (
            <p className={cn("cute-tag mb-3", fade("animate-fade-in-up"))}>
              💌 {t.welcomeGuest}, {guest.name}
            </p>
          )}
          <p
            className={cn(
              "cute-kicker mb-5",
              fade("animate-fade-in-up delay-100"),
            )}>
            {t.weInviteYou}
          </p>

          <h1
            className={cn("cute-name", fade("animate-fade-in-up delay-200"))}>
            {groom}
          </h1>
          <div
            className={cn(
              "cute-heart my-1",
              fade("animate-fade-in-up delay-300"),
            )}>
            <Heart
              className={cn("w-8 h-8", animOn && "cute-heart-beat")}
              fill="currentColor"
            />
          </div>
          <h1
            className={cn("cute-name", fade("animate-fade-in-up delay-300"))}>
            {bride}
          </h1>

          <div
            className={cn(
              "cute-date mt-6 inline-flex items-center gap-2",
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

      <TemplateSections
        weddingData={weddingData}
        guest={guest}
        language={language}
        order={order}
      />
    </>
  );
};
