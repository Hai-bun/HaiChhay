import { FitText } from "@/components/ui/FitText";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FloatingPetals } from "@/components/ui/FloatingPetals";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Heart, Calendar } from "lucide-react";
import { getTemplate } from "@/lib/templateConfig";
import { applyTheme, ThemeType } from "@/lib/themeConfig";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { InvitationLoader } from "@/components/ui/InvitationLoader";
import { InvitationUnavailable } from "@/components/wedding/InvitationUnavailable";
import { saveLoaderCache } from "@/lib/loaderCache";
import { startMusic } from "@/lib/music";
import { WelcomePopup } from "@/components/wedding/WelcomePopup";
import { useWeddingData, useGuest } from "@/hooks/use-wedding-data";
import { preloadImages } from "@/lib/preloadImage";
import {
  Language,
  getStoredLanguage,
  getTranslations,
} from "@/lib/i18n";
import { getDateParts, formatWeddingTime } from "@/lib/weddingFormat";

// Hand-torn paper edge: jagged top line for the paper block (fixed, so it never shifts on re-render).
const TORN_EDGE = (() => {
  let seed = 5;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const pts: string[] = [];
  for (let i = 0; i <= 50; i += 1) pts.push(`${i * 2}% ${Math.round(4 + rnd() * 20)}px`);
  return `polygon(${pts.join(", ")}, 100% 100%, 0 100%)`;
})();

const GuestInvite = () => {
  const { guestId } = useParams<{ guestId: string }>();
  const navigate = useNavigate();
  const { data: weddingData, isLoading } = useWeddingData();
  const { data: guest, isLoading: guestLoading } = useGuest(guestId);
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

  useEffect(() => {
    if (weddingData) saveLoaderCache(weddingData);
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

  if (isLoading || !weddingData || (guestId && guestLoading)) {
    return <InvitationLoader language={language} />;
  }

  // The guest was removed in Admin: their link no longer opens the invitation.
  if (guestId && guest === null) {
    return <InvitationUnavailable language={language} />;
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
  const parts = getDateParts(weddingData.weddingDate, language);
  const displayAddress =
    language === "km" && weddingData.eventAddressKh?.trim()
      ? weddingData.eventAddressKh
      : weddingData.eventAddress;

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

      {/* Paper-card cover: photo on top, torn edge, guest + details on paper */}
      <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
        <div className="inv-card">
          <div className="inv-photo">
            {archImage ? (
              <img src={archImage} alt="" draggable={false} />
            ) : (
              <span className="inv-photo-fallback">
                <Heart className="w-14 h-14 animate-heartbeat" fill="currentColor" />
              </span>
            )}
            <span className="inv-leaf inv-leaf-tl" aria-hidden="true" />
            <span className="inv-leaf inv-leaf-tr" aria-hidden="true" />
          </div>

          <div className="inv-paper-wrap">
            <div className="inv-paper" style={{ clipPath: TORN_EDGE }}>
              <span className="inv-leaf inv-leaf-bl" aria-hidden="true" />
              <span className="inv-leaf inv-leaf-br" aria-hidden="true" />

              {guest && (
                <h1 className="inv-guest">
                  <span className="inv-guest-label">{t.dearGuest}</span>
                  {/* Long names wrap inside the card and step down in size. */}
                  <span
                    className={`inv-guest-name font-script break-words [overflow-wrap:anywhere] ${
                      guest.name.length <= 14
                        ? "text-4xl sm:text-5xl"
                        : guest.name.length <= 26
                          ? "text-3xl sm:text-4xl"
                          : "text-2xl sm:text-3xl"
                    }`}>
                    {guest.name}
                  </span>
                </h1>
              )}

              <p className="inv-invite">{t.weInviteYou}</p>

              <div className="inv-names">
                <h2 className="couple-name font-script text-4xl sm:text-5xl leading-tight">
                  <FitText>{displayGroom}</FitText>
                </h2>
                <p className="inv-amp">{amp}</p>
                <h2 className="couple-name font-script text-4xl sm:text-5xl leading-tight">
                  <FitText>{displayBride}</FitText>
                </h2>
              </div>

              <div className="inv-date">
                <p className="inv-month">{parts.month}</p>
                <div className="inv-dayrow">
                  <span className="inv-cell">{parts.weekday}</span>
                  <span className="inv-day">{parts.day}</span>
                  <span className="inv-cell">
                    {language === "km" ? "ម៉ោង " : "AT "}
                    {formatWeddingTime(weddingData.weddingTime, language)}
                  </span>
                </div>
                <p className="inv-year">{parts.year}</p>
              </div>

              {displayAddress?.trim() && <p className="inv-place">{displayAddress}</p>}

              <button
                type="button"
                className="inv-open"
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
      </div>
    </div>
  );
};

export default GuestInvite;
