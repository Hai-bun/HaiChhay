import { useEffect, useRef, useState } from "react";
import { localizeDigits } from "@/lib/weddingFormat";
import type { Language } from "@/lib/i18n";

const INTERVAL_MS = 3800;
/** How many photos show at once: the top one plus two peeking out underneath. */
const DEPTH = 3;

interface PolaroidStackProps {
  photos: string[];
  language?: Language;
}

/**
 * A pile of polaroids. The top one is flicked away on its own every few
 * seconds, the next slides forward and a new one joins the back of the pile.
 * Tap to flick manually; hover pauses. Static for reduced motion / animations-off.
 */
export const PolaroidStack = ({ photos, language }: PolaroidStackProps) => {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const rootRef = useRef<HTMLElement>(null);
  const n = photos.length;

  // Start rotating only once the guest scrolls it into view (and pause off-screen).
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const off =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !!rootRef.current?.closest(".animations-off, .mo-static");
    setAutoplay(!off);
  }, []);

  useEffect(() => {
    if (!autoplay || !inView || paused || n < 2) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [autoplay, inView, paused, n, step]);

  // Warm the next photo that is about to join the pile.
  useEffect(() => {
    if (n < 2) return;
    const img = new Image();
    img.src = photos[(step + DEPTH) % n];
  }, [step, n, photos]);

  if (n === 0) return null;

  // Offsets -1 (leaving) .. DEPTH-1 (back of the pile). Keyed by absolute step so
  // each card keeps its DOM node and the CSS transition animates it forward.
  const cards: Array<{ key: number; offset: number; src: string }> = [];
  for (let o = n > 1 ? -1 : 0; o < Math.min(DEPTH, n); o += 1) {
    cards.push({ key: step + o, offset: o, src: photos[(((step + o) % n) + n) % n] });
  }
  const current = ((step % n) + n) % n;
  const num = (v: number) => localizeDigits(String(v).padStart(2, "0"), language);

  return (
    <figure
      ref={rootRef}
      className="mo-polaroid mo-reveal pstack-wrap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <div
        className="pstack"
        role={n > 1 ? "button" : undefined}
        tabIndex={n > 1 ? 0 : undefined}
        aria-label={n > 1 ? "Next photo" : undefined}
        onClick={() => n > 1 && setStep((s) => s + 1)}
        onKeyDown={(e) => {
          if (n > 1 && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setStep((s) => s + 1);
          }
        }}>
        {cards.map((c) => (
          <div key={c.key} className="pcard" data-o={c.offset}>
            <img src={c.src} alt="" loading={c.offset <= 0 ? "eager" : "lazy"} decoding="async" draggable={false} />
            {c.offset === 0 && n > 1 && (
              <span className="pcard-count">
                {num(current + 1)} / {num(n)}
              </span>
            )}
          </div>
        ))}
      </div>
      {n > 1 && (
        <div className="pstack-dots" aria-hidden="true">
          {photos.map((_, i) => (
            <span key={i} className={i === current ? "is-on" : undefined} />
          ))}
        </div>
      )}
    </figure>
  );
};
