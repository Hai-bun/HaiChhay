import { useEffect, useState } from "react";
import { localizeDigits } from "@/lib/weddingFormat";
import { getTranslations, Language, getStoredLanguage } from "@/lib/i18n";

interface CountdownTimerProps {
  targetDate: string;
  targetTime: string;
  language?: Language;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Soft pill: tall rounded capsule with a theme-colour gradient; number and label sit inside.
const TimeBlock = ({ value, label, lang }: { value: number; label: string; lang: Language }) => {
  const text = localizeDigits(value.toString().padStart(2, "0"), lang);
  return (
    <div
      className="countdown-box flex flex-col items-center justify-center w-[4.25rem] h-28 sm:w-28 sm:h-40 rounded-full border border-primary/30 shadow-card"
      style={{ background: "linear-gradient(160deg, hsl(var(--primary) / 0.22), hsl(var(--primary) / 0.06) 60%, hsl(var(--card)))" }}
    >
      <span className="text-3xl sm:text-5xl leading-none font-serif font-semibold text-foreground tabular-nums">{text}</span>
      <span className="my-2 sm:my-3 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
      <span className={`text-[0.65rem] sm:text-sm text-muted-foreground ${lang === "km" ? "" : "uppercase tracking-widest"}`}>
        {label}
      </span>
    </div>
  );
};

export const CountdownTimer = ({ targetDate, targetTime, language }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const lang = language || getStoredLanguage();
  const t = getTranslations(lang);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(`${targetDate}T${targetTime}`);
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  return (
    <div className="flex justify-center gap-2 sm:gap-5">
      <TimeBlock value={timeLeft.days} label={t.days} lang={lang} />
      <TimeBlock value={timeLeft.hours} label={t.hours} lang={lang} />
      <TimeBlock value={timeLeft.minutes} label={t.minutes} lang={lang} />
      <TimeBlock value={timeLeft.seconds} label={t.seconds} lang={lang} />
    </div>
  );
};
