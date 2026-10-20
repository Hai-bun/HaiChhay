import { useEffect, useMemo } from "react";
import { Heart } from "lucide-react";
import { applyTheme, type ThemeType } from "@/lib/themeConfig";
import { readLoaderCache } from "@/lib/loaderCache";
import { getStoredLanguage, type Language } from "@/lib/i18n";

interface InvitationLoaderProps {
  language?: Language;
}

/**
 * Loading screen that already wears the invitation's theme and template (from
 * the last visit on this device), shows the couple's names when known, and
 * falls back to a neutral heart on a first visit.
 */
export const InvitationLoader = ({ language }: InvitationLoaderProps) => {
  const lang = language ?? getStoredLanguage();
  const km = lang === "km";
  const cache = useMemo(() => readLoaderCache(), []);

  // Paint the cached theme's colours and fonts right away.
  useEffect(() => {
    if (!cache) return;
    applyTheme(cache.theme as ThemeType, {
      headingFont: cache.headingFont,
      bodyFont: cache.bodyFont,
      nameFont: cache.nameFont,
    });
  }, [cache]);

  const groom = km && cache?.groomKh?.trim() ? cache.groomKh : cache?.groom;
  const bride = km && cache?.brideKh?.trim() ? cache.brideKh : cache?.bride;
  const amp = km ? "និង" : "&";

  return (
    <div
      className={`inv-loader wedding-root ${cache ? `theme-${cache.theme} template-${cache.template}` : ""}`}
      role="status"
      aria-live="polite">
      <span className="inv-loader-glow inv-loader-glow-a" aria-hidden="true" />
      <span className="inv-loader-glow inv-loader-glow-b" aria-hidden="true" />

      <div className="inv-loader-mark" aria-hidden="true">
        <span className="inv-loader-ring" />
        <span className="inv-loader-ring inv-loader-ring-2" />
        <Heart className="w-9 h-9 animate-heartbeat" fill="currentColor" />
      </div>

      {groom && bride && (
        <p className="inv-loader-names font-script">
          {groom} <span>{amp}</span> {bride}
        </p>
      )}

      <p className="inv-loader-text">{km ? "កំពុងរៀបចំការអញ្ជើញ…" : "Preparing your invitation…"}</p>
      <span className="inv-loader-bar" aria-hidden="true">
        <i />
      </span>
    </div>
  );
};
