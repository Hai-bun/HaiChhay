import { Calendar, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Language, getTranslations } from "@/lib/i18n";
import { Guest, WeddingData, getLocationImage } from "@/lib/weddingStore";
import { getTemplate } from "@/lib/templateConfig";
import { formatWeddingDate, formatWeddingTime } from "@/lib/weddingFormat";
import { CinematicVideo } from "./CinematicVideo";
import { ReelChapter, ReelFrame } from "./ReelFrame";
import { useChapterTracker } from "@/hooks/use-chapter-tracker";
import { CountdownTimer } from "./CountdownTimer";
import { CoupleSection } from "./CoupleSection";
import { LocationSection } from "./LocationSection";
import { PhotoGallery } from "./PhotoGallery";
import { RSVPSection } from "./RSVPSection";
import { GiftSection } from "./GiftSection";
import { Footer } from "./Footer";

interface ReelInvitationProps {
  weddingData: WeddingData;
  guest: Guest | null;
  language: Language;
}

/**
 * "Film Reel Story" template.
 *
 * Renders the invitation as a sequence of full-viewport chapters inside a
 * letterbox frame, opening on a cinematic video title card. Chapter order comes
 * from the template config rather than being hard-coded.
 */
export const ReelInvitation = ({
  weddingData,
  guest,
  language,
}: ReelInvitationProps) => {
  const t = getTranslations(language);
  const template = getTemplate("reel");
  const animOn = weddingData.animations?.enabled ?? true;

  const sectionNodes: Record<string, React.ReactNode> = {
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
        message={weddingData.invitationMessage}
        language={language}
      />
    ),
    gallery: (
      <PhotoGallery photos={weddingData.photos} language={language} layout={weddingData.galleryLayout} />
    ),
    location: (
      <LocationSection
        eventTitle={weddingData.eventTitle}
        eventAddress={weddingData.eventAddress}
        eventMapUrl={weddingData.eventMapUrl}
        image={getLocationImage(weddingData)}
        variant={weddingData.locationStyle}
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
    gift: (
      <GiftSection
        khqrImage={weddingData.khqrImage}
        enabled={weddingData.giftEnabled}
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

  const chapterTitles: Record<string, string> = {
    couple: t.theCouple,
    gallery: t.photoGallery,
    location: t.eventLocation,
    rsvp: t.rsvpTitle,
    gift: t.weddingGift,
    footer: t.thankYou,
  };

  // The gift chapter is skipped entirely when the couple has turned gifts off.
  const chapterKeys = template.sectionOrder.filter(
    (key) =>
      key !== "hero" &&
      sectionNodes[key] !== undefined &&
      (key !== "gift" || weddingData.giftEnabled),
  );

  const { active, setRef, scrollTo } = useChapterTracker(chapterKeys.length);

  const displayGroom =
    language === "km" && weddingData.groomNameKh
      ? weddingData.groomNameKh
      : weddingData.groomName;
  const displayBride =
    language === "km" && weddingData.brideNameKh
      ? weddingData.brideNameKh
      : weddingData.brideName;

  return (
    <ReelFrame
      chapters={chapterKeys.map((key) => chapterTitles[key] ?? key)}
      activeIndex={active}
      onJump={scrollTo}
      navLabel={t.chapter}>
      {/* Opening title card */}
      <section className="relative reel-hero-shell flex items-center justify-center">
        <CinematicVideo
          src={weddingData.backgroundImage}
          poster={weddingData.photos[0]}
          animate={animOn}
          allowAudio
          language={language}
        />

        <div className="reel-hero-content relative text-center px-4 max-w-4xl mx-auto">
          {guest && (
            <p
              className={cn(
                "reel-tag mb-8",
                animOn && "animate-fade-in-up",
              )}>
              {t.welcomeGuest}, {guest.name}
            </p>
          )}

          <p
            className={cn(
              "text-xs uppercase tracking-[0.35em] mb-8",
              animOn && "animate-fade-in-up delay-100",
            )}>
            {t.weInviteYou}
          </p>

          <h1
            className={cn(
              "font-script mb-5",
              animOn && "animate-fade-in-up delay-200",
            )}>
            {displayGroom}
          </h1>

          <div
            className={cn(
              "flex items-center justify-center gap-5 my-5",
              animOn && "animate-fade-in-up delay-300",
            )}>
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[rgba(233,196,141,0.8)]" />
            <Heart
              className={cn(
                "w-5 h-5 text-[rgb(233,196,141)]",
                animOn &&
                  weddingData.animations?.heartbeat &&
                  "animate-heartbeat",
              )}
              fill="currentColor"
            />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[rgba(233,196,141,0.8)]" />
          </div>

          <h1
            className={cn(
              "font-script mt-5",
              animOn && "animate-fade-in-up delay-300",
            )}>
            {displayBride}
          </h1>

          <div
            className={cn(
              "flex items-center justify-center gap-2 mt-10",
              animOn && "animate-fade-in-up delay-500",
            )}>
            <Calendar className="w-4 h-4" />
            <p className="font-serif tracking-[0.12em]">
              {formatWeddingDate(weddingData.weddingDate, language)}
              {" · "}
              {formatWeddingTime(weddingData.weddingTime, language)}
            </p>
          </div>

          {weddingData.showCountdown && (
            <div
              className={cn(
                "mt-12",
                animOn && "animate-fade-in-up delay-700",
              )}>
              <p className="text-[0.6rem] uppercase tracking-[0.3em] mb-5">
                {t.countingDown}
              </p>
              <CountdownTimer
                targetDate={weddingData.weddingDate}
                targetTime={weddingData.weddingTime}
                language={language}
              />
            </div>
          )}
        </div>
      </section>

      {/* Story chapters */}
      {chapterKeys.map((key, index) => (
        <ReelChapter
          key={key}
          index={index}
          total={chapterKeys.length}
          label={chapterTitles[key] ?? key}
          chapterWord={t.chapter}
          innerRef={setRef(index)}>
          {sectionNodes[key]}
        </ReelChapter>
      ))}
    </ReelFrame>
  );
};
