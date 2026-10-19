import { FitText } from "@/components/ui/FitText";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FloatingPetals } from "@/components/ui/FloatingPetals";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Heart, Calendar } from "lucide-react";
import { getTemplate } from "@/lib/templateConfig";
import { applyTheme, ThemeType } from "@/lib/themeConfig";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { startMusic } from "@/lib/music";
import { WelcomePopup } from "@/components/wedding/WelcomePopup";
import { useWeddingData, useGuest } from "@/hooks/use-wedding-data";
import { preloadImages } from "@/lib/preloadImage";
import {
  Language,
  getStoredLanguage,
  getTranslations,
} from "@/lib/i18n";
import { formatWeddingDate, formatWeddingTime } from "@/lib/weddingFormat";

const GuestInvite = () => {
  const { guestId } = useParams<{ guestId: string }>();
  const navigate = useNavigate();
  const { data: weddingData, isLoading } = useWeddingData();
  const { data: guest } = useGuest(guestId);
  const [language, setLanguage] = useState<Language>(getStoredLanguage());

  // Tell the browser the page language so Khmer text is shaped/styled correctly.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Match the couple's chosen theme + custom fonts on this cover too.
  useEffect(() => {
    if (!weddingData) return;
    applyTheme(weddingData.theme as ThemeType, {
      headingFont: weddingData.headingFont,
      bodyFont: weddingData.bodyFont,
      nameFont: weddingData.nameFont,
      fontFiles: weddingData.customFonts,
      colors: weddingData.textColors,
    });
  }, [weddingData]);

  // Warm the cache for the heavy media on the full invitation while the guest
  // is still looking at the envelope, so it's ready the moment they open it.
  useEffect(() => {
    if (!weddingData) return;
    preloadImages([
      weddingData.backgroundImage,
      weddingData.khqrImage,
      ...weddingData.photos.slice(0, 6),
    ]);
  }, [weddingData]);

  if (isLoading || !weddingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-romantic-gradient">
        <div className="animate-pulse">
          <Heart className="w-12 h-12 text-primary animate-heartbeat" />
        </div>
      </div>
    );
  }

  const t = getTranslations(language);
  const template = getTemplate(weddingData.template);

  const displayGroom =
    language === "km" && weddingData.groomNameKh
      ? weddingData.groomNameKh
      : weddingData.groomName;
  const displayBride =
    language === "km" && weddingData.brideNameKh
      ? weddingData.brideNameKh
      : weddingData.brideName;
  const amp = language === "km" ? "និង" : "&";

  // Seal photo picked in Admin; ignored if it is no longer one of the uploaded images.
  const sealPick = weddingData.sectionImages?.seal;
  const sealImage =
    sealPick &&
    [...(weddingData.photos ?? []), weddingData.backgroundImage, weddingData.monogramImage].includes(sealPick)
      ? sealPick
      : "";

  const bgMedia = weddingData.backgroundImage || weddingData.photos[0] || "";
  const isVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(bgMedia);
  // The arch shows the seal photo picked in Admin, else the cover photo / first gallery photo.
  const archImage = sealImage || (isVideo ? weddingData.photos[0] || "" : bgMedia);

  return (
    <div className={`guest-invite wedding-root theme-${weddingData.theme} template-${template.id} min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12`}>
      {/* Background media */}
      {isVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={bgMedia}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : bgMedia ? (
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${bgMedia})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-[var(--hero-gradient)]" />
      )}
      {/* Readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/60" />

      {template.features.showPetals && <FloatingPetals />}

      <LanguageSwitcher
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
      <MusicToggle url={weddingData.musicUrl} language={language} />

      <WelcomePopup
        guestName={guest?.name}
        groomName={weddingData.groomName}
        brideName={weddingData.brideName}
        message={weddingData.welcomePopupMessage}
        enabled={weddingData.welcomePopupEnabled}
        language={language}
      />

      {/* Arch-photo cover: no card, the couple's photo is the focus */}
      <div className="relative z-10 w-full max-w-md text-center text-white animate-fade-in-up">
        <div className="inv-arch-wrap">
          <div className="inv-arch">
            {archImage ? (
              <img src={archImage} alt="" draggable={false} />
            ) : (
              <span className="inv-arch-fallback">
                <Heart className="w-14 h-14 animate-heartbeat" fill="currentColor" />
              </span>
            )}
            <span className="inv-arch-shade" aria-hidden="true" />
          </div>
          <span className="inv-badge" aria-hidden="true">
            <Heart className="w-5 h-5" fill="currentColor" />
          </span>
        </div>

        <p className="inv-kicker animate-fade-in-up delay-100">{t.welcomeTitle}</p>

        {guest && (
          <h1 className="inv-guest animate-fade-in-up delay-200">
            <span className="inv-guest-label">{t.dearGuest}</span>
            {/* Long names wrap inside the column and step down in size. */}
            <span
              className={`inv-guest-name font-script break-words [overflow-wrap:anywhere] ${
                guest.name.length <= 14
                  ? "text-5xl sm:text-6xl"
                  : guest.name.length <= 26
                    ? "text-4xl sm:text-5xl"
                    : "text-3xl sm:text-4xl"
              }`}>
              {guest.name}
            </span>
          </h1>
        )}

        <p className="inv-invite animate-fade-in-up delay-300">{t.weInviteYou}</p>

        <div className="inv-names animate-fade-in-up delay-500">
          <h2 className="couple-name font-script text-4xl sm:text-5xl leading-tight">
            <FitText>{displayGroom}</FitText>
          </h2>
          <p className="inv-amp">
            <span aria-hidden="true" />
            <b>{amp}</b>
            <span aria-hidden="true" />
          </p>
          <h2 className="couple-name font-script text-4xl sm:text-5xl leading-tight">
            <FitText>{displayBride}</FitText>
          </h2>
        </div>

        <div className="inv-date animate-fade-in-up delay-700">
          <Calendar className="w-4 h-4" />
          <span>
            {formatWeddingDate(weddingData.weddingDate, language)}
            {" · "}
            {formatWeddingTime(weddingData.weddingTime, language)}
          </span>
        </div>

        <div>
          <button
            type="button"
            className="inv-open animate-fade-in-up delay-700"
            onClick={() => {
              // A tap is the gesture that lets the song start; it keeps playing on the next page.
              startMusic(weddingData.musicUrl);
              navigate(`/wedding/${guestId || ""}`);
            }}>
            <Heart className="w-4 h-4" fill="currentColor" />
            <span>{t.openInvitation}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestInvite;
