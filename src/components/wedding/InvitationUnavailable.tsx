import { Heart } from "lucide-react";
import { getTranslations, type Language } from "@/lib/i18n";

/** Shown instead of the invitation when the guest's link was removed in Admin. */
export const InvitationUnavailable = ({ language }: { language: Language }) => {
  const t = getTranslations(language);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 text-center">
      <div className="max-w-sm">
        <Heart className="w-10 h-10 text-primary mx-auto mb-5" aria-hidden="true" />
        <h1 className="font-serif text-2xl font-semibold text-foreground mb-3">
          {t.invitationUnavailableTitle}
        </h1>
        <p className="text-muted-foreground leading-relaxed">{t.invitationUnavailableBody}</p>
      </div>
    </div>
  );
};
