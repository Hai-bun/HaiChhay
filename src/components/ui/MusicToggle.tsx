import { useEffect, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  isMusicMuted,
  isMusicPlaying,
  setMusicMuted,
  startMusic,
  subscribeMusic,
} from "@/lib/music";
import type { Language } from "@/lib/i18n";

interface MusicToggleProps {
  url?: string;
  language?: Language;
  /** Also try to start playing (the detail page does; the invite waits for "Open"). */
  autoStart?: boolean;
}

/** Floating mute / unmute button for the invitation's background music. */
export const MusicToggle = ({ url, language, autoStart = false }: MusicToggleProps) => {
  const muted = useSyncExternalStore(subscribeMusic, isMusicMuted, () => false);
  const playing = useSyncExternalStore(subscribeMusic, isMusicPlaying, () => false);

  useEffect(() => {
    if (autoStart && url) startMusic(url);
  }, [autoStart, url]);

  if (!url?.trim()) return null;

  const off = muted || !playing;
  const km = language === "km";
  const label = off
    ? km ? "បើកសំឡេងចម្រៀង" : "Play music"
    : km ? "បិទសំឡេងចម្រៀង" : "Mute music";

  return (
    <button
      type="button"
      className="music-toggle"
      aria-label={label}
      title={label}
      aria-pressed={!off}
      onClick={() => {
        if (!playing) startMusic(url);
        setMusicMuted(playing ? !muted : false);
      }}>
      {off ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
    </button>
  );
};
