import { Fragment, type ReactNode } from "react";
import type { WeddingData, Guest } from "@/lib/weddingStore";
import type { Language } from "@/lib/i18n";
import { CoupleSection } from "../CoupleSection";
import { MonogramSection } from "../MonogramSection";
import { StorySection } from "../StorySection";
import { ScheduleSection } from "../ScheduleSection";
import { LocationSection } from "../LocationSection";
import { PhotoGallery } from "../PhotoGallery";
import { GiftSection } from "../GiftSection";
import { RSVPSection } from "../RSVPSection";
import { Footer } from "../Footer";

export type SectionKey =
  | "couple"
  | "story"
  | "schedule"
  | "location"
  | "gallery"
  | "gift"
  | "rsvp"
  | "footer";

const DEFAULT_ORDER: SectionKey[] = [
  "couple",
  "story",
  "location",
  "schedule",
  "gallery",
  "gift",
  "rsvp",
  "footer",
];

interface TemplateSectionsProps {
  weddingData: WeddingData;
  guest: Guest | null;
  language: Language;
  order?: SectionKey[];
  /** Set false to skip the monogram (e.g. when rendering the stack in two parts). */
  showMonogram?: boolean;
}

/**
 * Renders the shared invitation sections (couple, location, gallery, gift,
 * rsvp, footer) in a given order. Each template supplies its own hero and
 * visual chrome, then drops this in for the repeating content — the per-template
 * look comes from the `template-*` CSS scope on the page root.
 */
export const TemplateSections = ({
  weddingData,
  guest,
  language,
  order = DEFAULT_ORDER,
  showMonogram = true,
}: TemplateSectionsProps) => {
  const nodes: Record<SectionKey, ReactNode> = {
    couple: (
      <CoupleSection
        groomName={weddingData.groomName}
        brideName={weddingData.brideName}
        groomParents={weddingData.groomParents}
        brideParents={weddingData.brideParents}
        groomNameKh={weddingData.groomNameKh}
        brideNameKh={weddingData.brideNameKh}
        groomParentsKh={weddingData.groomParentsKh}
        brideParentsKh={weddingData.brideParentsKh}
        language={language}
      />
    ),
    story: <StorySection story={weddingData.story} language={language} />,
    schedule: (
      <ScheduleSection schedule={weddingData.schedule} language={language} />
    ),
    location: (
      <LocationSection
        eventTitle={weddingData.eventTitle}
        eventAddress={weddingData.eventAddress}
        eventTitleKh={weddingData.eventTitleKh}
        eventAddressKh={weddingData.eventAddressKh}
        eventMapUrl={weddingData.eventMapUrl}
        language={language}
      />
    ),
    gallery: <PhotoGallery photos={weddingData.photos} language={language} layout={weddingData.galleryLayout} />,
    gift: (
      <GiftSection
        khqrImage={weddingData.khqrImage}
        enabled={weddingData.giftEnabled}
        language={language}
      />
    ),
    rsvp: (
      <RSVPSection
        guestId={guest?.id}
        guestName={guest?.name}
        language={language}
      />
    ),
    footer: (
      <Footer
        groomName={weddingData.groomName}
        brideName={weddingData.brideName}
        groomNameKh={weddingData.groomNameKh}
        brideNameKh={weddingData.brideNameKh}
        socialLinks={weddingData.socialLinks}
        language={language}
      />
    ),
  };

  return (
    <>
      {showMonogram && <MonogramSection image={weddingData.monogramImage} language={language} />}
      {order.map((key) => (
        <Fragment key={key}>{nodes[key]}</Fragment>
      ))}
    </>
  );
};

/** Language-aware display names + "and" separator for the couple heroes. */
export const getCoupleDisplay = (
  weddingData: WeddingData,
  language: Language,
) => ({
  groom:
    language === "km" && weddingData.groomNameKh
      ? weddingData.groomNameKh
      : weddingData.groomName,
  bride:
    language === "km" && weddingData.brideNameKh
      ? weddingData.brideNameKh
      : weddingData.brideName,
  // Khmer uses the word "និង" ("and") between the names instead of "&".
  amp: language === "km" ? "និង" : "&",
});
