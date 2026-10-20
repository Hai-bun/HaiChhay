import type { WeddingData } from "@/lib/weddingStore";

// What the loading screen needs to look like the invitation before the real
// data arrives: remembered from the last successful load on this device.
const KEY = "invite-loader-cache";

export interface LoaderCache {
  theme: string;
  template: string;
  headingFont?: string;
  bodyFont?: string;
  nameFont?: string;
  groom: string;
  bride: string;
  groomKh?: string;
  brideKh?: string;
}

export const saveLoaderCache = (d: WeddingData): void => {
  try {
    const cache: LoaderCache = {
      theme: d.theme,
      template: d.template,
      headingFont: d.headingFont,
      bodyFont: d.bodyFont,
      nameFont: d.nameFont,
      groom: d.groomName,
      bride: d.brideName,
      groomKh: d.groomNameKh,
      brideKh: d.brideNameKh,
    };
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* storage unavailable: the loader just stays generic */
  }
};

export const readLoaderCache = (): LoaderCache | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LoaderCache) : null;
  } catch {
    return null;
  }
};
