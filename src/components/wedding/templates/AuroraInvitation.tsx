import { useEffect, useRef, type CSSProperties } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Guest, WeddingData } from "@/lib/weddingStore";
import { getTranslations, type Language } from "@/lib/i18n";
import { formatWeddingDate, formatWeddingTime, localizeDigits } from "@/lib/weddingFormat";
import { CountdownTimer } from "../CountdownTimer";
import { PhotoGallery } from "../PhotoGallery";
import { TemplateSections, getCoupleDisplay, type SectionKey } from "./TemplateSections";
import { getTemplate } from "@/lib/templateConfig";

interface TemplateProps {
  weddingData: WeddingData;
  guest: Guest | null;
  language: Language;
}

// Khmer letters stack into clusters (base + vowel/sign marks), so splitting by
// code point tears them apart. Khmer words animate whole; other scripts split
// by grapheme cluster.
const KHMER = /[\u1780-\u17FF]/;
type Segmenter = { segment: (s: string) => Iterable<{ segment: string }> };
const segmenter: Segmenter | null =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new (Intl as unknown as { Segmenter: new (l?: string, o?: object) => Segmenter }).Segmenter(undefined, { granularity: "grapheme" })
    : null;
const splitUnits = (word: string): string[] => {
  if (KHMER.test(word)) return [word];
  return segmenter
    ? Array.from(segmenter.segment(word), (s) => s.segment)
    : Array.from(word);
};

// Words stay unbroken (so names wrap only at spaces); letters blur/rise in.
const SplitName = ({ text, start, on }: { text: string; start: number; on: boolean }) => {
  let n = start;
  return (
    <span className="mo-split" aria-label={text}>
      {text.split(" ").map((word, w) => (
        <span key={w} className="mo-word" aria-hidden="true">
          {splitUnits(word).map((ch, i) => (
            <span
              key={i}
              className={cn("mo-char", on && "mo-char-in")}
              style={{ "--i": n++ } as CSSProperties}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
};


// Fixed positions (not random) so server/client renders match and the field is stable.
const SPARKLES: Array<{ x: string; y: string; s: number; d: string }> = [
  { x: "4%", y: "8%", s: 14, d: "0s" },
  { x: "12%", y: "72%", s: 22, d: "0.6s" },
  { x: "22%", y: "20%", s: 10, d: "1.2s" },
  { x: "33%", y: "88%", s: 16, d: "0.3s" },
  { x: "47%", y: "6%", s: 12, d: "1.5s" },
  { x: "58%", y: "30%", s: 26, d: "0.9s" },
  { x: "66%", y: "82%", s: 14, d: "0.2s" },
  { x: "74%", y: "12%", s: 18, d: "1.1s" },
  { x: "82%", y: "52%", s: 12, d: "1.8s" },
  { x: "90%", y: "20%", s: 20, d: "0.5s" },
  { x: "94%", y: "78%", s: 14, d: "1.4s" },
  { x: "40%", y: "50%", s: 10, d: "2s" },
];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const AuroraInvitation = ({ weddingData, guest, language }: TemplateProps) => {
  const t = getTranslations(language);
  const { groom, bride, amp } = getCoupleDisplay(weddingData, language);
  const animOn = weddingData.animations?.enabled ?? true;
  const fade = (c: string) => (animOn ? c : "");
  const order = getTemplate("aurora").sectionOrder.filter(
    (k) => k !== "hero" && k !== "gallery",
  ) as SectionKey[];
  const photos = weddingData.photos ?? [];
  // An admin-chosen gallery layout replaces the signature pinned gallery.
  const customLayout = !!weddingData.galleryLayout && weddingData.galleryLayout !== "default";
  // Photos picked in Admin win; a pick is ignored if that image has since been
  // removed from the gallery / settings, so a deleted photo never shows broken.
  const picks = weddingData.sectionImages ?? {};
  const known = new Set([...photos, weddingData.backgroundImage, weddingData.monogramImage]);
  const picked = (url?: string) => (url && known.has(url) ? url : "");
  const heroImg = picked(picks.hero) || weddingData.backgroundImage || photos[0] || "";
  const heroIsVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(heroImg);
  const dateText = formatWeddingDate(weddingData.weddingDate, language);
  // Polaroid photo: prefer one that is not already the hero image.
  const saveImg =
    picked(picks.polaroid) ||
    photos.find((p) => p !== heroImg) ||
    photos.find((p) => p !== heroImg) ||
    photos[0] ||
    "";

  const shellRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Keep each full name on a single line: shrink the heading just enough that
  // the widest name fits the available width (re-run on resize / font load).
  const nameRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const h1 = nameRef.current;
    if (!h1) return;
    const fit = () => {
      h1.style.setProperty("--fit", "1");
      const avail = h1.clientWidth;
      const widest = Math.max(
        0,
        ...Array.from(h1.querySelectorAll<HTMLElement>(".mo-split")).map((s) => s.offsetWidth),
      );
      if (avail > 0 && widest > avail) {
        h1.style.setProperty("--fit", String(Math.floor((avail / widest) * 100) / 100));
      }
    };
    fit();
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit);
    document.fonts?.addEventListener?.("loadingdone", fit);
    return () => {
      window.removeEventListener("resize", fit);
      document.fonts?.removeEventListener?.("loadingdone", fit);
    };
  }, [groom, bride, language]);

  // One rAF loop writes CSS vars / transforms directly: hero parallax, scroll
  // progress bar, and the pinned horizontal photo gallery with per-photo
  // parallax. React never re-renders on scroll.
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!animOn || reduced) {
      shell.classList.add("mo-static");
      shell.querySelectorAll(".mo-reveal").forEach((n) => n.classList.add("is-in"));
      return;
    }
    shell.classList.remove("mo-static");

    const gallery = galleryRef.current;
    const track = trackRef.current;
    const cards = track ? Array.from(track.querySelectorAll<HTMLElement>(".mo-card")) : [];
    const progress = shell.querySelector<HTMLElement>(".mo-progress");
    const heroInner = shell.querySelector<HTMLElement>(".mo-hero-inner");
    const bar = shell.querySelector<HTMLElement>(".mo-gallery-bar span");
    const imgs = cards.map((c) => c.querySelector<HTMLElement>(".mo-card-frame img"));
    let shift = 0;
    let raf = 0;
    // Geometry is measured once (not every frame) so scrolling never forces
    // layout. Everything below writes transforms straight to the elements:
    // custom properties set on the shell would restyle the whole page per frame.
    let docMax = 0;
    let galleryTop = 0;
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let cardX: number[] = []; // each card's centre in track space
    let tx = 0;

    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      if (gallery && track) {
        shift = Math.max(0, track.scrollWidth - vw);
        gallery.style.height = `${shift + vh}px`;
        galleryTop = gallery.getBoundingClientRect().top + window.scrollY;
        const base = track.getBoundingClientRect().left + tx;
        cardX = cards.map((c) => {
          const r = c.getBoundingClientRect();
          return r.left + r.width / 2 - base;
        });
      }
      docMax = document.documentElement.scrollHeight - vh;
    };

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (progress) progress.style.transform = `scaleX(${docMax > 0 ? clamp01(y / docMax) : 0})`;

      // Hero text drifts up and fades only while the hero is on screen.
      if (heroInner && y < vh * 1.1) {
        heroInner.style.transform = `translate3d(0,${y * 0.3}px,0)`;
        heroInner.style.opacity = String(Math.max(0, 1 - y / 650));
      }

      if (gallery && track) {
        const p = shift > 0 ? clamp01((y - galleryTop) / shift) : 0;
        tx = -p * shift;
        track.style.transform = `translate3d(${tx}px,0,0)`;
        if (bar) bar.style.transform = `scaleX(${p})`;
        for (let i = 0; i < cards.length; i++) {
          const off = (cardX[i] + tx - vw / 2) / vw; // -1..1 around centre
          const img = imgs[i];
          if (img && off > -1.3 && off < 1.3) {
            img.style.transform = `translate3d(${(off * -60).toFixed(1)}px,0,0) scale(1.3)`;
          }
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // Ignore the mobile URL-bar show/hide (height-only resize) so the pinned
    // gallery doesn't jump while scrolling.
    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastW && "ontouchstart" in window) return;
      lastW = window.innerWidth;
      measure();
      onScroll();
    };
    const onImgLoad = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Images change the track width as they load.
    track?.querySelectorAll("img").forEach((img) => img.addEventListener("load", onImgLoad));
    // Fonts / late content shift the page; re-measure once everything settled.
    window.addEventListener("load", onImgLoad);
    document.fonts?.ready.then(onImgLoad);

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    shell.querySelectorAll(".mo-reveal").forEach((n) => io.observe(n));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onImgLoad);
      track?.querySelectorAll("img").forEach((img) => img.removeEventListener("load", onImgLoad));
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (gallery) gallery.style.height = "";
    };
  }, [animOn, photos.length, customLayout]);


  return (
    <div ref={shellRef} className={cn("mo-shell", language === "km" && "mo-km")}>
      <div className="mo-progress" aria-hidden="true" />

      {/* ---------- Hero: full-bleed photo, Ken Burns, curtain reveal ---------- */}
      <section className="mo-hero" style={!heroIsVideo && heroImg ? ({ "--hero-img": `url("${heroImg}")` } as CSSProperties) : undefined}>
        <div className={cn("mo-hero-media", animOn && "mo-hero-media-open")} aria-hidden="true">
          {heroImg ? (
            heroIsVideo ? (
              <video className="mo-hero-img" src={heroImg} autoPlay loop muted playsInline />
            ) : (
              <img className="mo-hero-img" src={heroImg} alt="" />
            )
          ) : (
            <div className="mo-hero-fallback" />
          )}
          <div className="mo-hero-shade" />
        </div>

        <div className="mo-hero-inner">
          {guest && (
            <p className={cn("mo-pill", fade("animate-fade-in-up delay-700"))}>
              {t.welcomeGuest}, {guest.name}
            </p>
          )}
          <p className={cn("mo-kicker", fade("animate-fade-in-up delay-700"))}>{t.weInviteYou}</p>

          <h1 ref={nameRef} className="mo-name">
            <SplitName text={groom} start={4} on={animOn} />
            <span className={cn("mo-amp", fade("animate-fade-in-up delay-1000"))}>{amp}</span>
            <SplitName text={bride} start={groom.length + 10} on={animOn} />
          </h1>
        </div>

        <ChevronDown className="mo-scroll-cue w-6 h-6" aria-hidden="true" />
      </section>

      {/* ---------- Save the Date: tilted polaroid + date + countdown ---------- */}
      <section className="mo-save">
        <div className="mo-sparkles" aria-hidden="true">
          {SPARKLES.map((s, i) => (
            <svg
              key={i}
              viewBox="0 0 24 24"
              className="mo-sparkle"
              style={{ left: s.x, top: s.y, width: s.s, height: s.s, animationDelay: s.d } as CSSProperties}>
              <path d="M12 0c.6 6.5 5 11.4 12 12-7 .6-11.4 5.5-12 12-.6-6.5-5-11.4-12-12C7 11.4 11.4 6.5 12 0z" fill="currentColor" />
            </svg>
          ))}
        </div>

        <div className="mo-save-inner">
          {saveImg && (
            <figure className="mo-polaroid mo-reveal">
              <div className="mo-polaroid-photo">
                <img src={saveImg} alt="" loading="lazy" draggable={false} />
              </div>
            </figure>
          )}

          <div className="mo-save-text mo-reveal">
            <p className="mo-save-eyebrow">{t.markYourCalendar}</p>
            <h2 className="mo-save-title">{t.saveTheDate}</h2>
            <p className="mo-save-sub">{t.saveTheDateText}</p>

            <div className="mo-date">
              <Calendar className="w-4 h-4" />
              <span>
                {dateText}
                {" · "}
                {formatWeddingTime(weddingData.weddingTime, language)}
              </span>
            </div>

            {weddingData.showCountdown && (
              <div className="mo-save-countdown">
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

      {/* ---------- Content sections (flat editorial cards, no glass) ---------- */}
      <TemplateSections
        weddingData={weddingData}
        guest={guest}
        language={language}
        order={order.filter((k) => ["couple", "story", "location", "schedule"].includes(k))}
      />

      {customLayout && (
        <PhotoGallery photos={photos} language={language} layout={weddingData.galleryLayout} />
      )}
      {/* ---------- Pinned horizontal gallery with per-photo parallax ---------- */}
      {photos.length > 0 && !customLayout && (
        <section id="gallery" ref={galleryRef} className="mo-gallery" aria-label={t.photoGallery}>
          <div className="mo-gallery-pin">
            <h2 className="mo-gallery-title">{t.photoGallery}</h2>
            <div ref={trackRef} className="mo-track">
              {photos.map((src, i) => (
                <figure
                  key={i}
                  className={cn("mo-card mo-reveal", i % 2 ? "mo-card-b" : "mo-card-a")}>
                  <div className="mo-card-frame">
                    <img src={src} alt="" decoding="async" loading="lazy" draggable={false} />
                  </div>
                  <figcaption>{localizeDigits(String(i + 1).padStart(2, "0"), language)}</figcaption>
                </figure>
              ))}
            </div>
            <div className="mo-gallery-bar" aria-hidden="true">
              <span />
            </div>
          </div>
        </section>
      )}

      <TemplateSections
        weddingData={weddingData}
        guest={guest}
        language={language}
        showMonogram={false}
        order={order.filter((k) => !["couple", "story", "location", "schedule"].includes(k))}
      />
    </div>
  );
};
