// Background music that outlives route changes: one <audio> element owned by
// this module, so it keeps playing when the guest taps "Open" and the invite
// page is replaced by the detail page.

const MUTE_KEY = "invite-music-muted";

let audio: HTMLAudioElement | null = null;
let currentUrl = "";
let unlockArmed = false;
const listeners = new Set<() => void>();

const readMuted = (): boolean => {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
};

let muted = readMuted();

const notify = () => listeners.forEach((l) => l());

/** Browsers block autoplay until a gesture; retry on the first interaction. */
const armUnlock = () => {
  if (unlockArmed || typeof window === "undefined") return;
  unlockArmed = true;
  const events = ["pointerdown", "touchend", "keydown"] as const;
  const go = () => {
    events.forEach((e) => window.removeEventListener(e, go));
    unlockArmed = false;
    void audio?.play().then(notify, () => {});
  };
  events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
};

let resumeOnShow = false;
let hideArmed = false;

/** Stop the music when the guest leaves the page (home button, app switch, screen off) and resume on return. */
const armHideHandling = () => {
  if (hideArmed || typeof document === "undefined") return;
  hideArmed = true;
  const hide = () => {
    if (audio && !audio.paused) {
      resumeOnShow = true;
      audio.pause();
    }
  };
  const show = () => {
    if (resumeOnShow && audio) {
      resumeOnShow = false;
      void audio.play().then(notify, armUnlock);
    }
  };
  document.addEventListener("visibilitychange", () => (document.hidden ? hide() : show()));
  window.addEventListener("pagehide", hide);
  window.addEventListener("pageshow", show);
};

/** Sets the track (if it changed) and tries to play it. Safe to call repeatedly. */
export const startMusic = (url: string): void => {
  const src = url?.trim();
  if (!src || typeof Audio === "undefined") return;
  if (!audio) {
    audio = new Audio();
    audio.loop = true;
    audio.preload = "auto";
    audio.addEventListener("play", notify);
    audio.addEventListener("pause", notify);
    armHideHandling();
  }
  if (currentUrl !== src) {
    currentUrl = src;
    audio.src = src;
  }
  audio.muted = muted;
  if (audio.paused) audio.play().then(notify, armUnlock);
};

export const isMusicMuted = (): boolean => muted;
export const isMusicPlaying = (): boolean => !!audio && !audio.paused;

export const setMusicMuted = (value: boolean): void => {
  muted = value;
  try {
    localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  } catch {
    /* storage unavailable: mute still applies for this visit */
  }
  if (audio) {
    audio.muted = value;
    if (!value && audio.paused) audio.play().then(notify, armUnlock);
  }
  notify();
};

export const subscribeMusic = (fn: () => void): (() => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
