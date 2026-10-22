import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart, Send, Check } from "lucide-react";
import { addRSVPResponse, hasGuestAnswered, sendRSVPToTelegram } from "@/lib/weddingStore";
import { GuestWishes } from "./GuestWishes";
import { toast } from "sonner";
import { getTranslations, Language, getStoredLanguage } from "@/lib/i18n";

interface RSVPSectionProps {
  guestId?: string;
  guestName?: string;
  /** Admin switch: false hides the whole section (default true). */
  enabled?: boolean;
  language?: Language;
}

export const RSVPSection = ({
  guestId,
  guestName,
  enabled = true,
  language,
}: RSVPSectionProps) => {
  const [attending, setAttending] = useState<string>("yes");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // A guest who already answered (this visit or an earlier one) sees the thank-you, not the form.
  useEffect(() => {
    if (!guestId) return;
    let alive = true;
    hasGuestAnswered(guestId)
      .then((answered) => alive && answered && setSubmitted(true))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [guestId]);

  const lang = language || getStoredLanguage();
  const t = getTranslations(lang);

  if (!enabled) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const name = guestName || "Guest";
    const isAttending = attending === "yes";

    const result = await addRSVPResponse(guestId, name, isAttending, message);
    if (result === "locked") {
      // Already answered (e.g. from another tab): show the thank-you, send nothing again.
      setSubmitted(true);
      setIsSubmitting(false);
      return;
    }
    if (result === "error") {
      toast.error(t.rsvpFailed || "Unable to submit RSVP.");
      setIsSubmitting(false);
      return;
    }

    await sendRSVPToTelegram(name, isAttending, message);

    setSubmitted(true);
    setIsSubmitting(false);
    toast.success(t.rsvpSuccess);
  };

  if (submitted) {
    return (
      <section id="rsvp" className="scroll-reveal py-16 px-4 bg-card">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-3xl font-semibold text-foreground mb-4">
            {t.rsvpSuccess}
          </h2>
          <p className="text-muted-foreground">{t.rsvpSuccessMessage}</p>
          <GuestWishes language={lang} />
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="scroll-reveal py-16 px-4 bg-card">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-2">
            {t.rsvpTitle}
          </h2>
          <p className="text-muted-foreground">{t.rsvpSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-background rounded-lg p-6 shadow-card">
            <Label className="text-base font-medium mb-4 block">
              {t.willYouAttend}
            </Label>
            <RadioGroup
              value={attending}
              onValueChange={setAttending}
              className="space-y-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes" className="cursor-pointer">
                  {t.yesAttending}
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="cursor-pointer">
                  {t.noNotAttending}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label
              htmlFor="message"
              className="text-base font-medium mb-2 block">
              {t.blessingMessage}
            </Label>
            <Textarea
              id="message"
              placeholder={t.sendWishes}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {isSubmitting ? (
              t.loading
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {t.submitRsvp}
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};
