import { cn } from "@/lib/utils";
import { toKhmerDigits } from "@/lib/weddingFormat";

const pad = (n: number): string => {
  const text = String(n).padStart(2, "0");
  return typeof document !== "undefined" && document.documentElement.lang === "km"
    ? toKhmerDigits(text)
    : text;
};

interface ReelFrameProps {
  /** Chapter titles, in running order — drives the rail labels. */
  chapters: string[];
  activeIndex: number;
  onJump: (index: number) => void;
  navLabel: string;
  children: React.ReactNode;
}

/**
 * Wraps the invitation in a cinema frame: fixed letterbox bars, an animated film
 * grain layer and a chapter rail down the left edge.
 */
export const ReelFrame = ({
  chapters,
  activeIndex,
  onJump,
  navLabel,
  children,
}: ReelFrameProps) => (
  <>
    <div className="reel-letterbox reel-letterbox-top" aria-hidden />
    <div className="reel-letterbox reel-letterbox-bottom" aria-hidden />
    <div className="reel-grain" aria-hidden />

    <nav className="reel-rail" aria-label={navLabel}>
      {chapters.map((title, index) => (
        <button
          key={title + index}
          type="button"
          onClick={() => onJump(index)}
          title={title}
          aria-label={`${pad(index + 1)} — ${title}`}
          aria-current={index === activeIndex ? "true" : undefined}
          className={cn(
            "reel-rail-dot",
            index === activeIndex && "reel-rail-dot-active",
          )}>
          <span className="reel-rail-tick" />
          <span className="reel-rail-title">{title}</span>
        </button>
      ))}
    </nav>

    {children}
  </>
);

interface ReelChapterProps {
  index: number;
  total: number;
  label: string;
  /** Localised word for "Chapter". */
  chapterWord: string;
  innerRef?: (el: HTMLElement | null) => void;
  className?: string;
  children: React.ReactNode;
}

/** One full-viewport story beat, slugged with its chapter number. */
export const ReelChapter = ({
  index,
  total,
  label,
  chapterWord,
  innerRef,
  className,
  children,
}: ReelChapterProps) => (
  <section
    ref={innerRef}
    className={cn("reel-chapter", className)}
    aria-label={`${chapterWord} ${pad(index + 1)} — ${label}`}>
    <div className="reel-slug" aria-hidden>
      <span className="reel-slug-word">{chapterWord}</span>
      <span className="reel-slug-number">
        {pad(index + 1)} <span className="reel-slug-total">/ {pad(total)}</span>
      </span>
      <span className="reel-slug-title">{label}</span>
    </div>
    <div className="reel-chapter-body">{children}</div>
  </section>
);
