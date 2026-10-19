import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react";
import { getTranslations, Language, getStoredLanguage } from "@/lib/i18n";
import { SpotlightGallery } from "./SpotlightGallery";
import { FadeInImage } from "@/components/ui/FadeInImage";
import { cn } from "@/lib/utils";
import type { GalleryLayout } from "@/lib/weddingStore";

interface PhotoGalleryProps {
  photos: string[];
  language?: Language;
  /** Admin-chosen layout; "default" keeps the template's own grid. */
  layout?: GalleryLayout;
}

export const PhotoGallery = ({ photos, language, layout = "default" }: PhotoGalleryProps) => {
  const spotlight = layout === "spotlight";
  const custom = layout !== "default" && !spotlight;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const lang = language || getStoredLanguage();
  const t = getTranslations(lang);

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  if (photos.length === 0) {
    return (
      <section id="gallery" className="scroll-reveal py-16 px-4 bg-romantic-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <Camera className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            {t.photoGallery}
          </h2>
          <p className="text-muted-foreground">
            {lang === 'km' ? 'រូបថតនឹងត្រូវបានបន្ថែមក្រោយពេល...' : 'Photos will be added soon...'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className={cn("gallery-section scroll-reveal py-16 px-4 bg-romantic-gradient", custom && "gl-wrap")}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <Camera className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
            {t.photoGallery}
          </h2>
        </div>

        {spotlight ? (
          <SpotlightGallery photos={photos} language={lang} onOpen={setSelectedIndex} />
        ) : (
        <div className={cn("gallery-grid", custom ? `gl-grid gl-${layout}` : "grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4")}>
          {photos.map((photo, index) => (
            <div
              key={index}
              className={cn("gallery-item overflow-hidden cursor-pointer group transition-all duration-300 bg-muted/40", custom ? "gl-item" : "aspect-square rounded-lg shadow-card hover:shadow-elevated")}
              onClick={() => setSelectedIndex(index)}
            >
              <FadeInImage
                src={photo}
                alt={`Wedding photo ${index + 1}`}
                className="photo-zoom w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
            </div>
          ))}
        </div>
        )}

        <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
            <div className="relative">
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {selectedIndex !== null && (
                <img
                  src={photos[selectedIndex]}
                  alt={`Wedding photo ${selectedIndex + 1}`}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
              )}
              
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
