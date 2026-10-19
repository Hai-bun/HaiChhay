import { useState } from "react";
import { Gift, Download, Share2, ScanLine, Heart, QrCode } from "lucide-react";
import { toast } from "sonner";
import { getTranslations, Language, getStoredLanguage } from "@/lib/i18n";
import { FadeInImage } from "@/components/ui/FadeInImage";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface GiftSectionProps {
  khqrImage: string;
  enabled: boolean;
  language?: Language;
}

const triggerDownload = (href: string) => {
  const link = document.createElement("a");
  link.href = href;
  link.download = "wedding-gift-khqr.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Fetches the KHQR image as a File so it can be saved or shared as a picture.
const fetchImageFile = async (url: string): Promise<File> => {
  const res = await fetch(url, { mode: "cors" });
  if (!res.ok) throw new Error("fetch failed");
  const blob = await res.blob();
  const type = blob.type || "image/png";
  const ext = type.split("/")[1]?.replace("jpeg", "jpg") || "png";
  return new File([blob], `wedding-gift-khqr.${ext}`, { type });
};

export const GiftSection = ({
  khqrImage,
  enabled,
  language,
}: GiftSectionProps) => {
  const lang = language || getStoredLanguage();
  const t = getTranslations(lang);
  const [open, setOpen] = useState(false);
  const openLabel = lang === "km" ? "បើកកូដ KHQR" : "Open KHQR";

  if (!enabled) return null;

  const handleDownload = async () => {
    if (!khqrImage) {
      toast.error("No KHQR image available");
      return;
    }
    try {
      const file = await fetchImageFile(khqrImage);
      const url = URL.createObjectURL(file);
      triggerDownload(url);
      URL.revokeObjectURL(url);
    } catch {
      triggerDownload(khqrImage);
    }
    toast.success("KHQR image downloaded!");
  };

  // Shares the KHQR picture itself (not the invitation link). Browsers that
  // can't share files get the image saved to the device instead.
  const handleShare = async () => {
    if (!khqrImage) {
      toast.error("No KHQR image available");
      return;
    }
    let file: File;
    try {
      file = await fetchImageFile(khqrImage);
    } catch {
      await handleDownload();
      return;
    }
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: t.weddingGift,
          text: t.scanQR,
        });
      } catch (e) {
        if ((e as DOMException)?.name !== "AbortError") {
          toast.error("Could not share the image");
        }
      }
    } else {
      const url = URL.createObjectURL(file);
      triggerDownload(url);
      URL.revokeObjectURL(url);
      toast.info("Sharing isn't supported here, so the image was saved instead");
    }
  };

  return (
    <section id="gift" className="gift-section scroll-reveal py-16 px-4">
      <div className="gift-card max-w-sm mx-auto text-center">
        <div className="gift-card-inner">
          <div className="gift-icon" aria-hidden="true">
            <Gift className="w-7 h-7" />
            <Heart className="gift-icon-heart w-4 h-4" fill="currentColor" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mt-4 mb-2">
            {t.weddingGift}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">{t.giftMessage}</p>

          <button type="button" className="gift-open" onClick={() => setOpen(true)}>
            <QrCode className="w-5 h-5" />
            <span>{openLabel}</span>
          </button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gift-dialog max-w-sm border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{t.weddingGift}</DialogTitle>
          <DialogDescription className="sr-only">{t.scanQR}</DialogDescription>
          <div className="gift-pop">
            <div className="gift-pop-head">
              <div className="gift-pop-icon" aria-hidden="true">
                <Gift className="w-6 h-6" />
              </div>
              <p className="gift-pop-title">{t.weddingGift}</p>
              <p className="gift-pop-sub">{t.scanQR}</p>
            </div>

            <div className="gift-pop-body">
              {khqrImage ? (
                <div className="gift-qr">
                  <span className="gift-corner gift-corner-tl" />
                  <span className="gift-corner gift-corner-tr" />
                  <span className="gift-corner gift-corner-bl" />
                  <span className="gift-corner gift-corner-br" />
                  <FadeInImage
                    src={khqrImage}
                    alt="KHQR Code"
                    className="w-full h-auto mx-auto object-contain rounded-lg"
                    style={{ maxHeight: "52vh" }}
                  />
                  <span className="gift-scan" aria-hidden="true" />
                </div>
              ) : (
                <div className="gift-qr gift-qr-empty">
                  <ScanLine className="w-10 h-10 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm mt-2">KHQR Code</p>
                </div>
              )}

              <div className="gift-actions">
                <button type="button" onClick={handleDownload} className="gift-btn gift-btn-solid">
                  <Download className="w-4 h-4" />
                  {t.save}
                </button>
                <button type="button" onClick={handleShare} className="gift-btn gift-btn-ghost">
                  <Share2 className="w-4 h-4" />
                  {t.share}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
