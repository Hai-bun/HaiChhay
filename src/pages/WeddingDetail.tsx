import { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useWeddingData, useGuest } from "@/hooks/use-wedding-data";
import { FloatingPetals } from "@/components/ui/FloatingPetals";
import { SparkleField } from "@/components/ui/SparkleField";
import { OrnamentDivider } from "@/components/ui/OrnamentDivider";
import { CountdownTimer } from "@/components/wedding/CountdownTimer";
import { CoupleSection } from "@/components/wedding/CoupleSection";
import { MonogramSection } from "@/components/wedding/MonogramSection";
import { StorySection } from "@/components/wedding/StorySection";
import { ScheduleSection } from "@/components/wedding/ScheduleSection";
import { LocationSection } from "@/components/wedding/LocationSection";
import { PhotoGallery } from "@/components/wedding/PhotoGallery";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import { GiftSection } from "@/components/wedding/GiftSection";
import { Footer } from "@/components/wedding/Footer";
import { ReelInvitation } from "@/components/wedding/ReelInvitation";
import { RoyalInvitation } from "@/components/wedding/templates/RoyalInvitation";
import { EditorialInvitation } from "@/components/wedding/templates/EditorialInvitation";
import { BotanicalInvitation } from "@/components/wedding/templates/BotanicalInvitation";
import { SplitInvitation } from "@/components/wedding/templates/SplitInvitation";
import { ArtDecoInvitation } from "@/components/wedding/templates/ArtDecoInvitation";
import { PolaroidInvitation } from "@/components/wedding/templates/PolaroidInvitation";
import { MonoInvitation } from "@/components/wedding/templates/MonoInvitation";
import { TropicalInvitation } from "@/components/wedding/templates/TropicalInvitation";
import { GlassGardenInvitation } from "@/components/wedding/templates/GlassGardenInvitation";
import { CuteInvitation } from "@/components/wedding/templates/CuteInvitation";
import { AuroraInvitation } from "@/components/wedding/templates/AuroraInvitation";
import { CuteStickers } from "@/components/ui/CuteStickers";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { HeaderNav } from "@/components/wedding/HeaderNav";
import { Heart, Calendar } from "lucide-react";
import { applyTheme, getTheme, ThemeType, THEMES } from "@/lib/themeConfig";
import { getTemplate, TEMPLATES } from "@/lib/templateConfig";
import type { TemplateType } from "@/lib/weddingStore";
import { cn } from "@/lib/utils";
import { Language, getStoredLanguage, getTranslations } from "@/lib/i18n";
import {
  formatWeddingDate,
  formatWeddingTime,
} from "@/lib/weddingFormat";

const WeddingDetail = () => {
  const { guestId } = useParams<{ guestId: string }>();
  const [searchParams] = useSearchParams();
  const { data: weddingData } = useWeddingData();
  const { data: guest } = useGuest(guestId);
  const [language, setLanguage] = useState<Language>(getStoredLanguage());

  // Tell the browser the page language so Khmer text is shaped/styled correctly.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Optional ?template= override so any template can be previewed without
  // saving it (used by the admin Preview button).
  const previewParam = searchParams.get("template");
  const previewTemplate =
    previewParam && previewParam in TEMPLATES
      ? (previewParam as TemplateType)
      : null;

  // Optional ?theme= override, same idea as ?template= — preview any theme
  // without saving it.
  const themeParam = searchParams.get("theme");
  const previewTheme =
    themeParam && themeParam in THEMES ? (themeParam as ThemeType) : null;
  const activeThemeId = previewTheme ?? (weddingData?.theme as ThemeType);

  useEffect(() => {
    if (!weddingData) return;
    applyTheme(activeThemeId, {
      headingFont: weddingData.headingFont,
      bodyFont: weddingData.bodyFont,
      nameFont: weddingData.nameFont,
      fontFiles: weddingData.customFonts,
      colors: weddingData.textColors,
    });
  }, [weddingData, activeThemeId]);

  // Set animation speed CSS variable whenever speedMultiplier changes
  const speedMultiplier =
    weddingData?.animations?.speed === "slow"
      ? 1.6
      : weddingData?.animations?.speed === "fast"
        ? 0.6
        : 1;

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--anim-speed",
      String(speedMultiplier),
    );
  }, [speedMultiplier]);

  // Scroll-reveal: sections rise into view as the guest scrolls to them.
  // Progressive enhancement — content is visible by default and only hidden
  // once we're set up, so it never disappears if JS/observer is unavailable.
  useLayoutEffect(() => {
    if (!weddingData) return;
    const root = document.querySelector<HTMLElement>(".wedding-root");
    if (!root) return;

    const a = weddingData.animations;
    const effTemplate = previewTemplate ?? weddingData.template;
    const on =
      (a?.enabled ?? true) &&
      (a?.fadeInOnScroll ?? true) &&
      effTemplate !== "reel" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const els = Array.from(
      root.querySelectorAll<HTMLElement>(".scroll-reveal"),
    );
    if (!on) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    root.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, [weddingData, previewTemplate]);

  if (!weddingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          Loading wedding invitation...
        </div>
      </div>
    );
  }

  const t = getTranslations(language);
  const theme = getTheme(activeThemeId);
  const template = getTemplate(previewTemplate ?? weddingData.template);
  const anim = weddingData.animations ?? {
    enabled: true,
    floatingPetals: true,
    heartbeat: true,
    fadeInOnScroll: true,
    photoHoverZoom: true,
    heroFloatIndicator: true,
    speed: "normal" as const,
  };
  const animOn = anim.enabled;
  const showDecorations = template.features.showOrnaments;
  const showPetals =
    animOn && anim.floatingPetals && template.features.showPetals;
  // Ambient sparkles suit most templates; skip the clean Editorial and the
  // Reel (which has its own cinematic grain).
  const showSparkles =
    animOn &&
    !["editorial", "reel", "mono", "polaroid", "cute", "aurora"].includes(template.id);
  const showCuteStickers = animOn && template.id === "cute";
  const fadeCls = (base: string) => (animOn && anim.fadeInOnScroll ? base : "");

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
  };

  const heroMediaUrl = weddingData.backgroundImage || "";
  const isVideoBackground = /\.(mp4|webm|ogg)(\?|$)/i.test(heroMediaUrl);

  const rootClassName = cn(
    "min-h-screen bg-background wedding-root animate-fade-in",
    `theme-${activeThemeId}`,
    `template-${template.id}`,
    !animOn && "animations-off",
    (!animOn || !anim.photoHoverZoom) && "no-photo-zoom",
  );

  // These templates own their whole layout (custom hero + section chrome), so
  // they replace the shared section stack below rather than extending it.
  const SelfContainedTemplate = {
    reel: ReelInvitation,
    royal: RoyalInvitation,
    editorial: EditorialInvitation,
    botanical: BotanicalInvitation,
    split: SplitInvitation,
    artdeco: ArtDecoInvitation,
    polaroid: PolaroidInvitation,
    mono: MonoInvitation,
    tropical: TropicalInvitation,
    glassgarden: GlassGardenInvitation,
    cute: CuteInvitation,
    aurora: AuroraInvitation,
  }[template.id as string];

  if (SelfContainedTemplate) {
    return (
      <div className={rootClassName}>
        <LanguageSwitcher
          onLanguageChange={handleLanguageChange}
          currentLanguage={language}
        />
        <HeaderNav weddingData={weddingData} language={language} />
        {showSparkles && <SparkleField />}
        {showCuteStickers && <CuteStickers />}
        <SelfContainedTemplate
          weddingData={weddingData}
          guest={guest ?? null}
          language={language}
        />
      </div>
    );
  }

  return (
    <div className={rootClassName}>
      {/* Language Switcher */}
      <LanguageSwitcher
        onLanguageChange={handleLanguageChange}
        currentLanguage={language}
      />
      <HeaderNav weddingData={weddingData} language={language} />

      {showPetals && <FloatingPetals />}
      {showSparkles && <SparkleField />}

      {/* Hero Section */}
      <section
        className={cn(
          "relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--hero-gradient)]",
          template.id === "video" && "wedding-hero-video-shell",
          template.heroLayout === "minimal" && "min-h-[80vh]",
        )}>
        {template.id === "video" && (
          <div className="absolute inset-0 overflow-hidden">
            {isVideoBackground ? (
              <video
                className="w-full h-full object-cover scale-[1.15] wedding-video-bg"
                src={heroMediaUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
            ) : (
              <div
                className="w-full h-full wedding-video-bg"
                style={
                  heroMediaUrl
                    ? {
                        backgroundImage: `url(${heroMediaUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {
                        background:
                          "radial-gradient(circle at center, rgba(205,166,122,0.22), rgba(15,16,18,0.88) 48%, rgba(5,5,7,0.96))",
                      }
                }
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.18),_transparent_35%)]" />
          </div>
        )}
        <div
          className={cn(
            "relative z-10 text-center px-4 py-12",
            template.id === "video" && "wedding-hero-content max-w-5xl mx-auto",
          )}>
          {/* Welcome Text */}
          {guest && (
            <p
              className={cn(
                "text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4",
                template.id === "video" && "intro-tag",
                fadeCls("animate-fade-in-up"),
              )}>
              {t.welcomeGuest}, {guest.name}
            </p>
          )}

          <p
            className={cn(
              "font-serif text-lg text-muted-foreground mb-6",
              fadeCls("animate-fade-in-up delay-100"),
            )}>
            {t.weInviteYou}
          </p>

          {/* Couple Names */}
          <div className="mb-8">
            {/** choose names per language */}
            {(() => {
              const displayGroom =
                language === "km" && weddingData.groomNameKh
                  ? weddingData.groomNameKh
                  : weddingData.groomName;
              const displayBride =
                language === "km" && weddingData.brideNameKh
                  ? weddingData.brideNameKh
                  : weddingData.brideName;
              return (
                <>
                  <h1
                    className={cn(
                      "font-script text-5xl sm:text-7xl text-foreground mb-4",
                      fadeCls("animate-fade-in-up delay-200"),
                    )}>
                    {displayGroom}
                  </h1>
                  <div
                    className={cn(
                      "flex items-center justify-center gap-4",
                      fadeCls("animate-fade-in-up delay-300"),
                    )}>
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
                    <Heart
                      className={cn(
                        "w-6 h-6 text-primary",
                        animOn && anim.heartbeat && "animate-heartbeat",
                      )}
                      fill="currentColor"
                    />
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
                  </div>
                  <h1
                    className={cn(
                      "font-script text-5xl sm:text-7xl text-foreground mt-4",
                      fadeCls("animate-fade-in-up delay-300"),
                    )}>
                    {displayBride}
                  </h1>
                </>
              );
            })()}
          </div>

          {showDecorations && (
            <OrnamentDivider
              className={fadeCls("animate-fade-in-up delay-500")}
            />
          )}

          {/* Date */}
          <div
            className={cn(
              "flex items-center justify-center gap-2 text-muted-foreground mb-4",
              fadeCls("animate-fade-in-up delay-500"),
            )}>
            <Calendar className="w-5 h-5" />
            <p className="font-serif text-lg">
              {formatWeddingDate(weddingData.weddingDate, language)} at{" "}
              {formatWeddingTime(weddingData.weddingTime)}
            </p>
          </div>

          {/* Countdown */}
          {weddingData.showCountdown && (
            <div
              className={cn("mt-12", fadeCls("animate-fade-in-up delay-700"))}>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">
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

        {/* Scroll Indicator */}
        {animOn && anim.heroFloatIndicator && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-fade-in" />
            </div>
          </div>
        )}
      </section>

      {/* Wedding monogram / crest (if uploaded) */}
      <MonogramSection image={weddingData.monogramImage} language={language} />

      {/* Couple & Family Section */}
      <CoupleSection
        groomName={weddingData.groomName}
        brideName={weddingData.brideName}
        groomParents={weddingData.groomParents}
        brideParents={weddingData.brideParents}
        groomNameKh={weddingData.groomNameKh}
        brideNameKh={weddingData.brideNameKh}
        groomParentsKh={weddingData.groomParentsKh}
        brideParentsKh={weddingData.brideParentsKh}
        language={language}
      />

      {/* Our Story Section */}
      <StorySection story={weddingData.story} language={language} />

      {/* Location Section */}
      <LocationSection
        eventTitle={weddingData.eventTitle}
        eventAddress={weddingData.eventAddress}
        eventTitleKh={weddingData.eventTitleKh}
        eventAddressKh={weddingData.eventAddressKh}
        eventMapUrl={weddingData.eventMapUrl}
        language={language}
      />

      {/* Wedding Day Schedule */}
      <ScheduleSection schedule={weddingData.schedule} language={language} />

      {/* Photo Gallery */}
      <PhotoGallery photos={weddingData.photos} language={language} layout={weddingData.galleryLayout} />

      {/* Gift Section */}
      <GiftSection
        khqrImage={weddingData.khqrImage}
        enabled={weddingData.giftEnabled}
        language={language}
      />

      {/* RSVP Section */}
      <RSVPSection
        guestId={guest?.id}
        guestName={guest?.name}
        language={language}
      />

      {/* Footer with Social Links */}
      <Footer
        groomName={weddingData.groomName}
        brideName={weddingData.brideName}
        groomNameKh={weddingData.groomNameKh}
        brideNameKh={weddingData.brideNameKh}
        socialLinks={weddingData.socialLinks}
        language={language}
      />
    </div>
  );
};

export default WeddingDetail;
