import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { localizeDigits } from "@/lib/weddingFormat";
import type { Language } from "@/lib/i18n";

const INTERVAL_MS = 4500;

interface SpotlightGalleryProps {
  photos: string[];
  language?: Language;
  /** Called when the guest taps the photo (opens the lightbox). */
  onOpen: (index: number) => void;
}

/**
 * One photo at a time, advancing on its own. The active photo is lit by a
 * blurred glow of itself, slowly zooms, and carries a counter + progress line.
 * Autoplay pauses on hover/touch and is off for reduced motion / animations-off.
 */
export const SpotlightGallery = ({ photos, language, onOpen }: SpotlightGalleryProps) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const count = photos.length;

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

  const go = useCallback(
    (to: number) => setIndex(((to % count) + count) % count),
    [count],
  );

  useEffect(() => {
    const off =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !!rootRef.current?.closest(".animations-off");
    setAutoplay(!off);
  }, []);

  // Re-armed on every change of index, so a manual move gets a full interval.
  useEffect(() => {
    if (!autoplay || !inView || paused || count < 2) return;
    const id = window.setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [autoplay, inView, paused, index, count, go]);

  if (count === 0) return null;
  const num = (n: number) => localizeDigits(String(n).padStart(2, "0"), language);
  const running = autoplay && inView && !paused && count > 1;

  return (
    <div
      ref={rootRef}
      className="sp-wrap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <div className="sp-glows" aria-hidden="true">
        {photos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className={i === index ? "sp-glow is-active" : "sp-glow"}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        ))}
      </div>

      <div className="sp-border">
      <div
        className="sp-stage"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, moved: false };
          setPaused(true);
        }}
        onPointerMove={(e) => {
          if (drag.current && Math.abs(e.clientX - drag.current.x) > 8) drag.current.moved = true;
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          if (e.pointerType !== "mouse") setPaused(false);
          if (!d) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
          else if (!d.moved) onOpen(index);
        }}
        onPointerCancel={() => {
          drag.current = null;
          setPaused(false);
        }}>
        {photos.map((src, i) => (
          <figure key={i} className={i === index ? "sp-slide is-active" : "sp-slide"} aria-hidden={i !== index}>
            <img
              src={src}
              alt={`Wedding photo ${i + 1}`}
              loading={i < 2 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
            />
          </figure>
        ))}
        <div className="sp-shade" aria-hidden="true" />

        <div className="sp-meta" aria-hidden="true">
          <span className="sp-count">
            <b>{num(index + 1)}</b>
            <i>/ {num(count)}</i>
          </span>
          {count > 1 && (
            <span className="sp-progress">
              <span
                key={`${index}-${running}`}
                className={running ? "sp-progress-fill is-running" : "sp-progress-fill"}
                style={{ animationDuration: `${INTERVAL_MS}ms` }}
              />
            </span>
          )}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              className="sp-arrow sp-prev"
              aria-label="Previous photo"
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={() => go(index - 1)}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="sp-arrow sp-next"
              aria-label="Next photo"
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={() => go(index + 1)}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      </div>
    </div>
  );
};
