import { MapPin, Navigation } from "lucide-react";
import { getTranslations, Language, getStoredLanguage } from "@/lib/i18n";

interface LocationSectionProps {
  eventTitle: string;
  eventAddress: string;
  eventMapUrl: string;
  eventTitleKh?: string;
  eventAddressKh?: string;
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

export const LocationSection = ({ eventTitle, eventAddress, eventMapUrl, eventTitleKh, eventAddressKh, language }: LocationSectionProps) => {
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

  return (
    <section id="location" className="location-section scroll-reveal py-16 px-4 bg-card">
      <div className="max-w-4xl mx-auto text-center">
        <MapPin className="loc-pin w-9 h-9 mx-auto" />

        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mt-3 mb-2">
          {displayTitle}
        </h2>
        <p className="loc-address">{displayAddress}</p>

        <div className="loc-frame">
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
          </div>
          <button type="button" className="loc-btn" onClick={() => window.open(directionsUrl, "_blank")}>
            <Navigation className="w-4 h-4" />
            <span>{t.getDirections}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
