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

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="countdown-box w-16 h-16 sm:w-20 sm:h-20 bg-card rounded-lg shadow-card flex items-center justify-center border border-border">
        <span className="text-2xl sm:text-3xl font-serif font-semibold text-foreground">
          {localizeDigits(value.toString().padStart(2, '0'), lang)}
        </span>
      </div>
      <span className={`mt-2 text-xs sm:text-sm text-muted-foreground ${lang === "km" ? "" : "uppercase tracking-widest"}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex justify-center gap-3 sm:gap-6">
      <TimeBlock value={timeLeft.days} label={t.days} />
      <TimeBlock value={timeLeft.hours} label={t.hours} />
      <TimeBlock value={timeLeft.minutes} label={t.minutes} />
      <TimeBlock value={timeLeft.seconds} label={t.seconds} />
    </div>
  );
};
