import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type TemplateType =
  | "classic"
  | "modern"
  | "elegant"
  | "romantic"
  | "video"
  | "reel"
  | "royal"
  | "editorial"
  | "botanical"
  | "split"
  | "artdeco"
  | "polaroid"
  | "mono"
  | "tropical"
  | "glassgarden"
  | "cute"
  | "aurora";

export type GalleryLayout =
  | "default"
  | "rhythm"
  | "square"
  | "editorial"
  | "strip"
  | "staggered"
  | "mosaic"
  | "band";

export interface TextColors {
  /** Body text (hex like #3a2a33); empty = theme default. */
  body?: string;
  /** Section headings (h2/h3). */
  heading?: string;
  /** Couple names. */
  names?: string;
}

export interface SectionImages {
  /** Motion Showcase hero photo (default: the Background image). */
  hero?: string;
  /** Polaroid photo in the Save the Date section. */
  polaroid?: string;
  /** Photo in the round seal on the cover page (default: a heart icon). */
  seal?: string;
}

export interface NavBrand {
  /** Short names shown in the header bar, e.g. "HAI" / "CHHAY". */
  groom?: string;
  bride?: string;
  groomKh?: string;
  brideKh?: string;
}

export interface CustomFont {
  family: string;
  url: string;
}

export interface SocialLinks {
  telegram: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

export interface WeddingData {
  // Couple Information
  groomName: string;
  groomNameKh?: string;
  brideName: string;
  brideNameKh?: string;
  groomParents: string;
  groomParentsKh?: string;
  brideParents: string;
  brideParentsKh?: string;

  // Wedding Date & Time
  weddingDate: string;
  weddingTime: string;
  showCountdown: boolean;

  // Event Location
  eventTitle: string;
  eventAddress: string;
  eventTitleKh?: string;
  eventAddressKh?: string;
  eventMapUrl: string;

  // Theme Settings
  theme: "luxury" | "minimal" | "traditional" | "floral";
  template: TemplateType;
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  nameFont: string;
  /** Uploaded font files (admin PC fonts aren't available on guests' phones). */
  customFonts: CustomFont[];
  /** How the photo gallery is laid out ("default" = the template's own gallery). */
  galleryLayout: GalleryLayout;
  /** Sticky header navigation on the invitation (can be turned off in Admin). */
  showHeaderNav: boolean;
  /** Custom text colors chosen in Admin. */
  textColors: TextColors;
  /** Photos chosen in Admin for specific spots in the Motion Showcase template. */
  sectionImages: SectionImages;
  /** Short nicknames for the header navigation brand. */
  navBrand: NavBrand;

  // Photo Gallery
  photos: string[];

  // Wedding monogram / crest (optional)
  monogramImage: string;

  // KHQR Gift
  khqrImage: string;
  giftEnabled: boolean;

  // Guests
  guests: Guest[];

  // RSVP Responses
  rsvpResponses: RSVPResponse[];

  // Social Links & Footer
  socialLinks: SocialLinks;

  // Telegram Bot Config
  telegramConfig: TelegramConfig;

  // Welcome Popup
  welcomePopupEnabled: boolean;
  welcomePopupMessage: string;

  // Our Story
  story: StoryConfig;

  // Wedding Day Schedule
  schedule: ScheduleConfig;

  // Animations
  animations: AnimationSettings;
}

export interface StoryConfig {
  enabled: boolean;
  title: string;
  text: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  titleKh?: string;
  descriptionKh?: string;
}

export interface ScheduleConfig {
  enabled: boolean;
  title: string;
  titleKh?: string;
  items: ScheduleItem[];
}

export interface AnimationSettings {
  enabled: boolean;
  floatingPetals: boolean;
  heartbeat: boolean;
  fadeInOnScroll: boolean;
  photoHoverZoom: boolean;
  heroFloatIndicator: boolean;
  speed: "slow" | "normal" | "fast";
}

export interface Guest {
  id: string;
  name: string;
  inviteUrl: string;
  createdAt: string;
}

export interface RSVPResponse {
  id: string;
  guestName: string;
  attending: boolean;
  message: string;
  submittedAt: string;
}

const DEFAULT_WEDDING_ID = "default-wedding";
const DEFAULT_WEDDING_DATA: WeddingData = {
  groomName: "Sokha Virak",
  groomNameKh: "",
  brideName: "Channary Meas",
  brideNameKh: "",
  groomParents: "Mr. & Mrs. Virak Family",
  groomParentsKh: "",
  brideParents: "Mr. & Mrs. Meas Family",
  brideParentsKh: "",
  weddingDate: "2026-02-14",
  weddingTime: "10:00",
  showCountdown: true,
  eventTitle: "Wedding Ceremony & Reception",
  eventAddress: "Royal Palace Gardens, Phnom Penh, Cambodia",
  eventTitleKh: "ពិធីមង្គលការ និង ពិធីជប់លៀង",
  eventAddressKh: "",
  eventMapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.7512345678!2d104.9282!3d11.5564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRoyal+Palace!5e0!3m2!1sen!2skh!4v1234567890",
  theme: "luxury",
  template: "classic",
  backgroundImage: "",
  primaryColor: "#c9a87c",
  secondaryColor: "#f5e6d3",
  accentColor: "#d4a574",
  headingFont: "Cormorant Garamond",
  bodyFont: "Lato",
  nameFont: "",
  customFonts: [],
  galleryLayout: "default",
  showHeaderNav: true,
  textColors: {},
  sectionImages: {},
  navBrand: {},
  photos: [],
  monogramImage: "",
  khqrImage: "",
  giftEnabled: true,
  guests: [],
  rsvpResponses: [],
  socialLinks: {
    telegram: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
  },
  telegramConfig: {
    botToken: "",
    chatId: "",
    enabled: false,
  },
  welcomePopupEnabled: true,
  welcomePopupMessage:
    "We are delighted to share this special moment with you. Please scroll down to view our wedding invitation.",
  story: {
    enabled: false,
    title: "Our Love Story",
    text: "From the moment our paths first crossed, we knew our hearts were meant to walk together. Through laughter, small adventures, and quiet moments, our love grew stronger each day. Now, surrounded by the people we cherish most, we can't wait to begin this new chapter as one.",
  },
  schedule: {
    enabled: false,
    title: "Wedding Day Schedule",
    titleKh: "",
    items: [
      {
        id: "s1",
        time: "07:00",
        title: "Morning Ceremony",
        description: "Traditional Khmer ceremony at the family home",
        titleKh: "ពិធីពេលព្រឹក",
        descriptionKh: "ពិធីប្រពៃណីខ្មែរនៅឯផ្ទះ",
      },
      {
        id: "s2",
        time: "10:00",
        title: "Blessing & Photos",
        description: "Blessings from elders followed by family photos",
        titleKh: "ពិធីពរជ័យ និង ថតរូប",
        descriptionKh: "ទទួលពរជ័យពីចាស់ទុំ និង ថតរូបគ្រួសារ",
      },
      {
        id: "s3",
        time: "17:00",
        title: "Reception Dinner",
        description: "Join us for dinner, music and celebration",
        titleKh: "ពិធីជប់លៀង",
        descriptionKh: "អញ្ជើញរួមពិសាអាហារ តន្ត្រី និង ការប្រារព្ធ",
      },
    ],
  },
  animations: {
    enabled: true,
    floatingPetals: true,
    heartbeat: true,
    fadeInOnScroll: true,
    photoHoverZoom: true,
    heroFloatIndicator: true,
    speed: "normal",
  },
};

const getInviteUrl = (guestId: string): string =>
  typeof window !== "undefined"
    ? `${window.location.origin}/invite/${guestId}`
    : `/invite/${guestId}`;

const mapGuestRowToGuest = (
  row: Database["public"]["Tables"]["guest_invitations"]["Row"],
): Guest => ({
  id: row.id,
  name: row.guest_name,
  inviteUrl: getInviteUrl(row.id),
  createdAt: row.created_at ?? new Date().toISOString(),
});

const mapGuestRowToResponse = (
  row: Database["public"]["Tables"]["guest_invitations"]["Row"],
): RSVPResponse => ({
  id: row.id,
  guestName: row.guest_name,
  attending: row.rsvp_status === "attending",
  message: row.blessing_message ?? "",
  submittedAt: row.updated_at ?? row.created_at ?? new Date().toISOString(),
});

const getCurrentUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data?.session?.user?.id ?? null;
};

const ensureUserProfileExists = async (userId: string | null) => {
  if (!userId) return true;

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .single();

  if (data) return true;

  if (error && error.code !== "PGRST116") {
    console.error("Failed to check user profile existence:", error);
    return false;
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id: userId,
    email: null,
    full_name: null,
  });

  if (insertError) {
    console.error("Failed to create missing user profile:", insertError);
    return false;
  }

  return true;
};

const buildWeddingProfileRow = (
  weddingData: WeddingData,
  userId: string | null = null,
): Database["public"]["Tables"]["wedding_profiles"]["Insert"] => ({
  id: DEFAULT_WEDDING_ID,
  user_id: userId,
  bride_name: weddingData.brideName,
  bride_name_kh: weddingData.brideNameKh,
  groom_name: weddingData.groomName,
  groom_name_kh: weddingData.groomNameKh,
  bride_parent_names: weddingData.brideParents,
  groom_parent_names: weddingData.groomParents,
  bride_parent_names_kh: weddingData.brideParentsKh,
  groom_parent_names_kh: weddingData.groomParentsKh,
  // Store the exact wall-clock date & time the couple entered (no timezone
  // suffix). The column is `timestamp without time zone`, so this is stored
  // literally and read back verbatim — the time never shifts per device.
  wedding_date_time: `${weddingData.weddingDate}T${weddingData.weddingTime}:00`,
  theme: weddingData.theme,
  template: weddingData.template,
  background_image_url: weddingData.backgroundImage,
  primary_color: weddingData.primaryColor,
  secondary_color: weddingData.secondaryColor,
  accent_color: weddingData.accentColor,
  heading_font: weddingData.headingFont,
  body_font: weddingData.bodyFont,
  show_countdown: weddingData.showCountdown,
  social_links: weddingData.socialLinks,
  // Credentials live in the owner-only telegram_secrets table, never here.
  telegram_config: {},
  // Story & Schedule are packed into the existing welcome_popup jsonb column so
  // no new database columns (migration) are required to persist them.
  welcome_popup: {
    enabled: weddingData.welcomePopupEnabled,
    message: weddingData.welcomePopupMessage,
    story: weddingData.story,
    schedule: weddingData.schedule,
    nameFont: weddingData.nameFont,
    customFonts: weddingData.customFonts,
    galleryLayout: weddingData.galleryLayout,
    showHeaderNav: weddingData.showHeaderNav,
    textColors: weddingData.textColors,
    sectionImages: weddingData.sectionImages,
    navBrand: weddingData.navBrand,
    monogramImage: weddingData.monogramImage,
    eventTitleKh: weddingData.eventTitleKh,
    eventAddressKh: weddingData.eventAddressKh,
  },
  animations: weddingData.animations,
  event_title: weddingData.eventTitle,
  event_address: weddingData.eventAddress,
  event_map_url: weddingData.eventMapUrl,
  gift_enabled: weddingData.giftEnabled,
});

const mapProfileToWeddingData = (
  profile: Database["public"]["Tables"]["wedding_profiles"]["Row"],
  guests: Database["public"]["Tables"]["guest_invitations"]["Row"][],
  photos: Database["public"]["Tables"]["photo_gallery"]["Row"][],
  gift: Database["public"]["Tables"]["wedding_gifts"]["Row"] | null,
): WeddingData => {
  // wedding_date_time comes back as a naive ISO-ish string, e.g.
  // "2026-12-20T16:00:00" (the column is `timestamp without time zone`) or
  // "...+00:00". Pull the date and time straight out of the string so NO
  // timezone conversion is ever applied — the wall-clock time the couple
  // entered is exactly what's shown, on every device.
  const rawDateTime =
    profile.wedding_date_time ??
    `${DEFAULT_WEDDING_DATA.weddingDate}T${DEFAULT_WEDDING_DATA.weddingTime}:00`;
  const dtMatch = rawDateTime.match(/(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/);

  const getSavedDate = () =>
    dtMatch ? dtMatch[1] : DEFAULT_WEDDING_DATA.weddingDate;

  const getSavedTime = () =>
    dtMatch ? dtMatch[2] : DEFAULT_WEDDING_DATA.weddingTime;

  return {
    groomName: profile.groom_name ?? DEFAULT_WEDDING_DATA.groomName,
    groomNameKh: profile.groom_name_kh ?? DEFAULT_WEDDING_DATA.groomNameKh,
    brideName: profile.bride_name ?? DEFAULT_WEDDING_DATA.brideName,
    brideNameKh: profile.bride_name_kh ?? DEFAULT_WEDDING_DATA.brideNameKh,
    groomParents:
      profile.groom_parent_names ?? DEFAULT_WEDDING_DATA.groomParents,
    groomParentsKh:
      profile.groom_parent_names_kh ?? DEFAULT_WEDDING_DATA.groomParentsKh,
    brideParents:
      profile.bride_parent_names ?? DEFAULT_WEDDING_DATA.brideParents,
    brideParentsKh:
      profile.bride_parent_names_kh ?? DEFAULT_WEDDING_DATA.brideParentsKh,
    weddingDate: getSavedDate(),
    weddingTime: getSavedTime(),
    showCountdown: profile.show_countdown ?? DEFAULT_WEDDING_DATA.showCountdown,
    eventTitle: profile.event_title ?? DEFAULT_WEDDING_DATA.eventTitle,
    eventAddress: profile.event_address ?? DEFAULT_WEDDING_DATA.eventAddress,
    eventTitleKh:
      (profile.welcome_popup as { eventTitleKh?: string })?.eventTitleKh ??
      DEFAULT_WEDDING_DATA.eventTitleKh,
    eventAddressKh:
      (profile.welcome_popup as { eventAddressKh?: string })?.eventAddressKh ??
      DEFAULT_WEDDING_DATA.eventAddressKh,
    eventMapUrl: profile.event_map_url ?? DEFAULT_WEDDING_DATA.eventMapUrl,
    theme:
      (profile.theme as WeddingData["theme"]) ?? DEFAULT_WEDDING_DATA.theme,
    template:
      (profile.template as TemplateType) ?? DEFAULT_WEDDING_DATA.template,
    backgroundImage:
      profile.background_image_url ?? DEFAULT_WEDDING_DATA.backgroundImage,
    primaryColor: profile.primary_color ?? DEFAULT_WEDDING_DATA.primaryColor,
    secondaryColor:
      profile.secondary_color ?? DEFAULT_WEDDING_DATA.secondaryColor,
    accentColor: profile.accent_color ?? DEFAULT_WEDDING_DATA.accentColor,
    headingFont: profile.heading_font ?? DEFAULT_WEDDING_DATA.headingFont,
    bodyFont: profile.body_font ?? DEFAULT_WEDDING_DATA.bodyFont,
    nameFont:
      (profile.welcome_popup as { nameFont?: string })?.nameFont ??
      DEFAULT_WEDDING_DATA.nameFont,
    customFonts:
      (profile.welcome_popup as { customFonts?: CustomFont[] })?.customFonts ??
      DEFAULT_WEDDING_DATA.customFonts,
    galleryLayout:
      (profile.welcome_popup as { galleryLayout?: GalleryLayout })
        ?.galleryLayout ?? DEFAULT_WEDDING_DATA.galleryLayout,
    showHeaderNav:
      (profile.welcome_popup as { showHeaderNav?: boolean })?.showHeaderNav ??
      DEFAULT_WEDDING_DATA.showHeaderNav,
    textColors:
      (profile.welcome_popup as { textColors?: TextColors })?.textColors ??
      DEFAULT_WEDDING_DATA.textColors,
    sectionImages:
      (profile.welcome_popup as { sectionImages?: SectionImages })
        ?.sectionImages ?? DEFAULT_WEDDING_DATA.sectionImages,
    navBrand:
      (profile.welcome_popup as { navBrand?: NavBrand })?.navBrand ??
      DEFAULT_WEDDING_DATA.navBrand,
    monogramImage:
      (profile.welcome_popup as { monogramImage?: string })?.monogramImage ??
      DEFAULT_WEDDING_DATA.monogramImage,
    photos: photos.map((photo) => photo.image_url),
    khqrImage: gift?.khqr_image_url ?? DEFAULT_WEDDING_DATA.khqrImage,
    giftEnabled: gift?.enabled ?? DEFAULT_WEDDING_DATA.giftEnabled,
    guests: guests.map(mapGuestRowToGuest),
    rsvpResponses: guests
      .filter((guest) => guest.rsvp_status !== "pending")
      .map(mapGuestRowToResponse),
    socialLinks: profile.social_links ?? DEFAULT_WEDDING_DATA.socialLinks,
    telegramConfig: DEFAULT_WEDDING_DATA.telegramConfig,
    welcomePopupEnabled:
      profile.welcome_popup?.enabled ??
      DEFAULT_WEDDING_DATA.welcomePopupEnabled,
    welcomePopupMessage:
      profile.welcome_popup?.message ??
      DEFAULT_WEDDING_DATA.welcomePopupMessage,
    story:
      (profile.welcome_popup as { story?: StoryConfig })?.story ??
      DEFAULT_WEDDING_DATA.story,
    schedule:
      (profile.welcome_popup as { schedule?: ScheduleConfig })?.schedule ??
      DEFAULT_WEDDING_DATA.schedule,
    animations: profile.animations ?? DEFAULT_WEDDING_DATA.animations,
  };
};

const ensureWeddingProfile = async () => {
  const { data, error } = await supabase
    .from("wedding_profiles")
    .select("*")
    .eq("id", DEFAULT_WEDDING_ID)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Failed to load wedding profile:", error);
  }

  if (data) {
    return data;
  }

  const userId = await getCurrentUserId();
  const { data: inserted, error: insertError } = await supabase
    .from("wedding_profiles")
    .insert(buildWeddingProfileRow(DEFAULT_WEDDING_DATA, userId))
    .select()
    .single();

  if (insertError) {
    console.error("Failed to create default wedding profile:", insertError);
    return null;
  }

  return inserted;
};

const getWeddingRelationalData = async () => {
  const [guestRes, photoRes, giftRes] = await Promise.all([
    supabase
      .from("guest_invitations")
      .select("*")
      .eq("wedding_id", DEFAULT_WEDDING_ID)
      .order("created_at", { ascending: true }),
    supabase
      .from("photo_gallery")
      .select("*")
      .eq("wedding_id", DEFAULT_WEDDING_ID)
      .order("display_order", { ascending: true }),
    supabase
      .from("wedding_gifts")
      .select("*")
      .eq("wedding_id", DEFAULT_WEDDING_ID)
      .limit(1)
      .single(),
  ]);

  if (guestRes.error) {
    console.error("Failed to load guest invitations:", guestRes.error);
  }

  if (photoRes.error) {
    console.error("Failed to load photo gallery:", photoRes.error);
  }

  if (giftRes.error && giftRes.error.code !== "PGRST116") {
    console.error("Failed to load wedding gift settings:", giftRes.error);
  }

  return {
    guests: guestRes.data ?? [],
    photos: photoRes.data ?? [],
    gift: giftRes.data ?? null,
  };
};

export const getWeddingData = async (): Promise<WeddingData> => {
  const profile = await ensureWeddingProfile();
  if (!profile) {
    return DEFAULT_WEDDING_DATA;
  }

  const { guests, photos, gift } = await getWeddingRelationalData();
  return mapProfileToWeddingData(profile, guests, photos, gift);
};

export const saveWeddingData = async (
  data: Partial<WeddingData>,
): Promise<boolean> => {
  const current = await getWeddingData();
  const updated = { ...current, ...data };
  const userId = await getCurrentUserId();

  if (userId) {
    const profileExists = await ensureUserProfileExists(userId);
    if (!profileExists) {
      return false;
    }
  }

  const { error: profileError } = await supabase
    .from("wedding_profiles")
    .upsert(buildWeddingProfileRow(updated, userId));
  if (profileError) {
    console.error("Failed to save wedding profile:", profileError);
    return false;
  }

  const giftRow: Database["public"]["Tables"]["wedding_gifts"]["Insert"] = {
    id: `gift-${DEFAULT_WEDDING_ID}`,
    wedding_id: DEFAULT_WEDDING_ID,
    khqr_image_url: updated.khqrImage,
    enabled: updated.giftEnabled,
  };

  const { error: giftError } = await supabase
    .from("wedding_gifts")
    .upsert(giftRow);
  if (giftError) {
    console.error("Failed to save wedding gift settings:", giftError);
    return false;
  }

  const { data: existingPhotos, error: existingPhotoError } = await supabase
    .from("photo_gallery")
    .select("id,image_url")
    .eq("wedding_id", DEFAULT_WEDDING_ID);

  if (existingPhotoError) {
    console.error(
      "Failed to load existing photos for sync:",
      existingPhotoError,
    );
    return false;
  }

  const existingPhotoUrls = (existingPhotos ?? []).map(
    (photo) => photo.image_url,
  );
  const addedPhotoUrls = updated.photos.filter(
    (url) => !existingPhotoUrls.includes(url),
  );
  const removedPhotoIds = (existingPhotos ?? [])
    .filter((photo) => !updated.photos.includes(photo.image_url))
    .map((photo) => photo.id);

  if (removedPhotoIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("photo_gallery")
      .delete()
      .in("id", removedPhotoIds);
    if (deleteError) {
      console.error("Failed to delete removed photos:", deleteError);
      return false;
    }
  }

  if (addedPhotoUrls.length > 0) {
    const photoRows = addedPhotoUrls.map((image_url, index) => ({
      id: generateGuestId(),
      wedding_id: DEFAULT_WEDDING_ID,
      image_url,
      display_order: index,
    }));

    const { error: insertError } = await supabase
      .from("photo_gallery")
      .insert(photoRows);
    if (insertError) {
      console.error("Failed to insert new photos:", insertError);
      return false;
    }
  }

  return true;
};

export const generateGuestId = (): string =>
  Math.random().toString(36).substring(2, 15);

export const addGuest = async (name: string): Promise<Guest | null> => {
  const id = generateGuestId();
  const guest = {
    id,
    wedding_id: DEFAULT_WEDDING_ID,
    guest_name: name,
    invitation_token: generateGuestId(),
    invitation_status: "sent" as const,
    rsvp_status: "pending" as const,
  };

  const { data, error } = await supabase
    .from("guest_invitations")
    .insert(guest)
    .select()
    .single();
  if (error || !data) {
    console.error("Failed to add guest:", error);
    return null;
  }

  return mapGuestRowToGuest(data);
};

export const getGuestById = async (id: string): Promise<Guest | null> => {
  const { data, error } = await supabase
    .from("guest_invitations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch guest by id:", error);
    return null;
  }

  return mapGuestRowToGuest(data);
};

export const deleteGuest = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("guest_invitations")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("Failed to delete guest:", error);
    return false;
  }
  return true;
};

export const addRSVPResponse = async (
  guestId: string | undefined,
  guestName: string,
  attending: boolean,
  message: string,
): Promise<boolean> => {
  const status = attending ? "attending" : "not_attending";
  const token = generateGuestId();

  if (guestId) {
    const { error } = await supabase
      .from("guest_invitations")
      .update({
        rsvp_status: status,
        blessing_message: message,
        invitation_status: "opened",
      })
      .eq("id", guestId);

    if (error) {
      console.error("Failed to update RSVP response:", error);
      return false;
    }

    return true;
  }

  const { error } = await supabase.from("guest_invitations").insert({
    id: generateGuestId(),
    wedding_id: DEFAULT_WEDDING_ID,
    guest_name: guestName,
    invitation_token: token,
    invitation_status: "opened" as const,
    rsvp_status: status as const,
    blessing_message: message,
  });

  if (error) {
    console.error("Failed to insert RSVP response:", error);
    return false;
  }

  return true;
};

export const addPhoto = async (imageUrl: string): Promise<boolean> => {
  const { error } = await supabase.from("photo_gallery").insert({
    id: generateGuestId(),
    wedding_id: DEFAULT_WEDDING_ID,
    image_url: imageUrl,
    display_order: 0,
  });
  if (error) {
    console.error("Failed to add photo record:", error);
    return false;
  }
  return true;
};

export const deletePhotoByUrl = async (imageUrl: string): Promise<boolean> => {
  const { error } = await supabase
    .from("photo_gallery")
    .delete()
    .match({ wedding_id: DEFAULT_WEDDING_ID, image_url: imageUrl });

  if (error) {
    console.error("Failed to delete photo record:", error);
    return false;
  }

  return true;
};

// The server reads the bot credentials itself; the browser only reports the RSVP.
export const sendRSVPToTelegram = async (
  guestName: string,
  attending: boolean,
  message: string,
): Promise<boolean> => {
  try {
    const res = await fetch("/api/rsvp-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestName, attending, message }),
    });
    return res.ok;
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    return false;
  }
};
