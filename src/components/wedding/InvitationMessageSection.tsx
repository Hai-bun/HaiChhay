import { ScrollText } from "lucide-react";
import type { InvitationMessageConfig } from "@/lib/weddingStore";
import { type Language, getStoredLanguage } from "@/lib/i18n";

interface InvitationMessageSectionProps {
  message: InvitationMessageConfig;
  language?: Language;
}

/** Formal invitation wording + the full date line (e.g. Khmer lunar date). */
export const InvitationMessageSection = ({
  message,
  language,
}: InvitationMessageSectionProps) => {
  const km = (language || getStoredLanguage()) === "km";
  if (!message?.enabled) return null;

  const pick = (en?: string, kh?: string) =>
    (km && kh?.trim() ? kh : en)?.trim() || kh?.trim() || "";
  const title = pick(message.title, message.titleKh);
  const body = pick(message.body, message.bodyKh);
  const dateLine = pick(message.dateLine, message.dateLineKh);

  if (!title && !body && !dateLine) return null;

  return (
    <section id="invitation" className="scroll-reveal py-16 px-4 bg-card">
      <div className="max-w-xl mx-auto text-center">
        <ScrollText className="w-10 h-10 text-primary mx-auto mb-4" />
        {title && (
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-4">
            {title}
          </h2>
        )}
        {body && (
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line font-serif text-lg">
            {body}
          </p>
        )}
        {dateLine && (
          <p className="mt-6 text-foreground leading-relaxed whitespace-pre-line font-serif text-lg font-semibold">
            {dateLine}
          </p>
        )}
      </div>
    </section>
  );
};
