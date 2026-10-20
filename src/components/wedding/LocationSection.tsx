import { MapPin, ExternalLink, Heart, Home, Navigation } from "lucide-react";
import type { LocationStyle } from "@/lib/weddingStore";
import { getTranslations, Language, getStoredLanguage } from "@/lib/i18n";

interface LocationSectionProps {
  eventTitle: string;
  eventAddress: string;
  eventMapUrl: string;
  eventTitleKh?: string;
  eventAddressKh?: string;
  /** Optional photo shown beside the map. */
  image?: string;
  /** Layout: soft card (default), two framed cards, or a full map backdrop. */
  variant?: LocationStyle;
  language?: Language;
}

// Extract embed URL from Google Maps URL
const getEmbedUrl = (url: string, address: string): string => {
  if (!url) {
    // Fallback to address-based embed
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  }
  
  // If already an embed URL, use as-is
  if (url.includes('/embed')) {
    return url;
  }
  
  // Try to extract place/coordinates from Google Maps URL
  try {
    // Handle various Google Maps URL formats
    if (url.includes('place/')) {
      // Extract place name from URL like maps/place/PlaceName/...
      const placeMatch = url.match(/place\/([^/]+)/);
      if (placeMatch) {
        const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
        return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`;
      }
    }
    
    // Handle @lat,lng format
    const coordMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed`;
    }
    
    // Handle ?q= parameter
    const urlObj = new URL(url);
    const query = urlObj.searchParams.get('q');
    if (query) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    }
  } catch {
    // URL parsing failed
  }
  
  // Fallback to address
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
};

export const LocationSection = ({ eventTitle, eventAddress, eventMapUrl, eventTitleKh, eventAddressKh, image, variant = "card", language }: LocationSectionProps) => {
  const lang = language || getStoredLanguage();
  const t = getTranslations(lang);
  const displayTitle =
    lang === "km" && eventTitleKh?.trim() ? eventTitleKh : eventTitle;
  const displayAddress =
    lang === "km" && eventAddressKh?.trim() ? eventAddressKh : eventAddress;
  const embedUrl = getEmbedUrl(eventMapUrl, eventAddress);
  
  // Use the Google Maps URL directly for directions (not address-based)
  const directionsUrl = eventMapUrl && !eventMapUrl.includes('/embed') 
    ? eventMapUrl 
    : `https://maps.google.com/maps?q=${encodeURIComponent(eventAddress)}`;

  const softCard = (
    <section id="location" className="location-section scroll-reveal py-16 px-4 bg-card">
      <div className="loc-card">
        <span className="loc-watermark" aria-hidden="true" />

        <header className="loc-head">
          <div className="loc-orn" aria-hidden="true">
            <span />
            <i />
            <span />
          </div>
          <h2 className="loc-title">{displayTitle}</h2>
          <p className="loc-tagline">{t.locationTagline}</p>
          <div className="loc-heart" aria-hidden="true">
            <span />
            <Heart className="w-4 h-4" fill="currentColor" />
            <span />
          </div>
        </header>

        <div className={image ? "loc-layout has-photo" : "loc-layout"}>
          {image && (
            <div className="loc-photo">
              <img src={image} alt="" loading="lazy" decoding="async" draggable={false} />
              <span className="loc-sprig" aria-hidden="true" />
            </div>
          )}

          <div className="loc-mapcard">
            <div className="loc-info">
              <div className="loc-info-row">
                <span className="loc-info-icon" aria-hidden="true">
                  <MapPin className="w-5 h-5" />
                </span>
                <p className="loc-info-text">{displayAddress}</p>
              </div>
              <button type="button" className="loc-btn" onClick={() => window.open(directionsUrl, "_blank")}>
                <span>{t.getDirections}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="loc-map">
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Wedding Location Map"
              />
              <span className="loc-pin-mark" aria-hidden="true">
                <MapPin className="w-7 h-7" fill="currentColor" />
              </span>
            </div>
            <span className="loc-sprig loc-sprig-r" aria-hidden="true" />
          </div>
        </div>

        <p className="loc-foot">
          <Heart className="w-3.5 h-3.5" fill="currentColor" />
          <span>{t.locationFooter}</span>
          <Heart className="w-3.5 h-3.5" fill="currentColor" />
        </p>
      </div>
    </section>
  );

  const mapFrame = (
    <iframe
      src={embedUrl}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Wedding Location Map"
    />
  );
  const openMaps = () => window.open(directionsUrl, "_blank");

  // Style 2: photo and map each in their own framed card, botanical corners.
  const framed = (
    <section id="location" className="location-section loc-variant-framed scroll-reveal py-16 px-4 bg-card">
      <div className="lf-wrap">
        <span className="lf-flower lf-flower-tl" aria-hidden="true" />
        <span className="lf-flower lf-flower-br" aria-hidden="true" />

        <header className="loc-head">
          <div className="loc-orn" aria-hidden="true">
            <span />
            <i />
            <span />
          </div>
          <h2 className="loc-title lf-title">{t.locationHeading}</h2>
          <p className="loc-tagline">{t.locationTagline2}</p>
          <div className="loc-heart" aria-hidden="true">
            <span />
            <Heart className="w-4 h-4" fill="currentColor" />
            <span />
          </div>
        </header>

        <div className={image ? "lf-grid has-photo" : "lf-grid"}>
          {image && (
            <div className="lf-frame">
              <div className="lf-photo">
                <img src={image} alt="" loading="lazy" decoding="async" draggable={false} />
              </div>
              <span className="loc-sprig" aria-hidden="true" />
            </div>
          )}

          <div className="lf-frame lf-right">
            <div className="lf-info">
              <span className="lf-icon" aria-hidden="true">
                <Home className="w-7 h-7" />
              </span>
              <div className="lf-info-text">
                <p className="lf-name">{displayTitle}</p>
                <p className="lf-addr">{displayAddress}</p>
              </div>
              <div className="lf-heart" aria-hidden="true">
                <span />
                <Heart className="w-3.5 h-3.5" fill="currentColor" />
                <span />
              </div>
            </div>

            <div className="lf-map">
              {mapFrame}
              <span className="lf-pin" aria-hidden="true">
                <MapPin className="w-12 h-12" fill="currentColor" />
                <Home className="lf-pin-home w-4 h-4" />
              </span>
            </div>

            <button type="button" className="lf-btn" onClick={openMaps}>
              <MapPin className="w-5 h-5" />
              <span>{t.getDirections}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  // Style 3: soft map as the backdrop, one cream card in the middle.
  const mapCard = (
    <section id="location" className="location-section loc-variant-mapcard scroll-reveal bg-card">
      <div className="lm-stage">
        <div className="lm-bg" aria-hidden="true">
          {mapFrame}
        </div>
        <span className="lm-wash" aria-hidden="true" />

        <div className="lm-card">
          {image && (
            <span className="lm-badge" aria-hidden="true">
              <img src={image} alt="" loading="lazy" decoding="async" draggable={false} />
            </span>
          )}
          <div className="loc-orn lm-orn" aria-hidden="true">
            <span />
            <Heart className="w-4 h-4" fill="currentColor" />
            <span />
          </div>
          <h2 className="lm-title">{displayTitle}</h2>
          <div className="loc-heart" aria-hidden="true">
            <span />
            <Heart className="w-3.5 h-3.5" fill="currentColor" />
            <span />
          </div>
          <div className="lm-addr">
            <MapPin className="w-7 h-7" fill="currentColor" />
            <p>{displayAddress}</p>
          </div>
          <button type="button" className="lm-btn" onClick={openMaps}>
            <Navigation className="w-5 h-5" />
            <span>{t.getDirections}</span>
          </button>
        </div>
      </div>
    </section>
  );

  if (variant === "framed") return framed;
  if (variant === "mapcard") return mapCard;
  return softCard;
};
