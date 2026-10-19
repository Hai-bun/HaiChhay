import { useEffect, useRef, useState } from "react";
import { Home, Heart, BookHeart, MapPin, Clock, Images, Gift, MailCheck, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTranslations, type Language } from "@/lib/i18n";
import type { WeddingData } from "@/lib/weddingStore";

interface HeaderNavProps {
  weddingData: WeddingData;
  language: Language;
}

// Sections that can appear in the bar, in page order. Only the ones actually
// rendered on the page (matched by id) get a link.
const ITEMS = [
  { id: "couple", key: "navCouple", icon: Heart },
  { id: "story", key: "navStory", icon: BookHeart },
  { id: "location", key: "navLocation", icon: MapPin },
  { id: "schedule", key: "navSchedule", icon: Clock },
  { id: "gallery", key: "navGallery", icon: Images },
  { id: "gift", key: "navGift", icon: Gift },
  { id: "rsvp", key: "navRsvp", icon: MailCheck },
] as const;

const firstWord = (s: string) => s.trim().split(/\s+/)[0] ?? "";

/**
 * Sticky top bar with smooth-scroll links to each section and a scroll-spy
 * highlight. Shown only when `showHeaderNav` is on in Admin.
 */
export const HeaderNav = ({ weddingData, language }: HeaderNavProps) => {
  const t = getTranslations(language);
  const [present, setPresent] = useState<string[]>([]);
  const [active, setActive] = useState("top");
  const listRef = useRef<HTMLDivElement>(null);

  // Find which sections exist on this page (depends on template + settings).
  useEffect(() => {
    const id = window.setTimeout(() => {
      setPresent(
        ITEMS.filter((i) => document.getElementById(i.id)).map((i) => i.id),
      );
    }, 50);
    return () => window.clearTimeout(id);
  }, [weddingData, language]);

  // Scroll-spy: highlight the section nearest the middle of the screen.
  useEffect(() => {
    if (present.length === 0) return;
    const els = present
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));
    const onScroll = () => {
      if (window.scrollY < 120) setActive("top");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [present]);

  // Keep the active link visible in the horizontally scrolling mobile bar.
  useEffect(() => {
    const btn = listRef.current?.querySelector<HTMLElement>("[data-active='true']");
    btn?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  if (!weddingData.showHeaderNav || present.length === 0) return null;

  const go = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const groom =
    language === "km" && weddingData.groomNameKh ? weddingData.groomNameKh : weddingData.groomName;
  const bride =
    language === "km" && weddingData.brideNameKh ? weddingData.brideNameKh : weddingData.brideName;
  // Nicknames set in Admin (e.g. "HAI" / "CHHAY", "ហៃ" / "ឆាយ"); otherwise the
  // first word of each name.
  const nb = weddingData.navBrand ?? {};
  const brandGroom =
    (language === "km" ? nb.groomKh : nb.groom)?.trim() || firstWord(groom);
  const brandBride =
    (language === "km" ? nb.brideKh : nb.bride)?.trim() || firstWord(bride);
  const links = [{ id: "top", label: t.navHome, icon: Home as LucideIcon }].concat(
    ITEMS.filter((i) => present.includes(i.id)).map((i) => ({
      id: i.id,
      label: t[i.key],
      icon: i.icon as LucideIcon,
    })),
  );

  return (
    <header className="header-nav" role="navigation" aria-label="Invitation sections">
      <button type="button" className="header-nav-brand" onClick={() => go("top")}>
        <span>
          {brandGroom} <span aria-hidden="true">💙</span> {brandBride}
        </span>
      </button>
      <div ref={listRef} className="header-nav-links">
        {links.map((l) => (
          <button
            key={l.id}
            type="button"
            data-active={active === l.id}
            className={cn("header-nav-link", active === l.id && "is-active")}
            onClick={() => go(l.id)}>
            <l.icon className="header-nav-icon" aria-hidden="true" />
            <span className="header-nav-label">{l.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
