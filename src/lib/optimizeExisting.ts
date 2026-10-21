import type { WeddingData } from "@/lib/weddingStore";
import { optimizeImage } from "@/lib/imageOptimize";
import { isStorageUrl, uploadWeddingImage } from "@/lib/storage";

const SKIP_BELOW_BYTES = 450 * 1024; // already small enough
const MAX_SIDE = 2400;

/** Every stored photo URL the invitation points at. */
const collectUrls = (d: WeddingData): string[] => {
  const s = d.sectionImages ?? {};
  const all = [
    ...d.photos,
    d.backgroundImage,
    d.monogramImage,
    s.hero,
    s.heroSide,
    s.polaroid,
    s.seal,
    s.location,
    ...(s.polaroidList ?? []),
  ];
  return [...new Set(all.filter((u): u is string => !!u && isStorageUrl(u)))];
};

const swap = (u: string | undefined, map: Map<string, string>) => (u ? map.get(u) ?? u : u);

/**
 * Resizes oversized photos already in storage and returns the invitation data
 * pointing at the smaller copies. The originals stay in storage; nothing is saved
 * here, so the admin reviews the result and presses Save.
 */
export async function optimizeStoredPhotos(
  data: WeddingData,
  onProgress?: (done: number, total: number) => void,
): Promise<{ data: WeddingData; replaced: number; beforeBytes: number; afterBytes: number }> {
  const urls = collectUrls(data);
  const map = new Map<string, string>();
  let beforeBytes = 0;
  let afterBytes = 0;

  for (let i = 0; i < urls.length; i += 1) {
    onProgress?.(i, urls.length);
    const url = urls[i];
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const blob = await res.blob();
      if (!/^image\/(jpeg|png|webp)$/i.test(blob.type) || blob.size < SKIP_BELOW_BYTES) continue;

      const name = url.split("/").pop() ?? "photo.jpg";
      const smaller = await optimizeImage(new File([blob], name, { type: blob.type }), MAX_SIDE);
      if (smaller.size >= blob.size * 0.9) continue; // not worth replacing

      const newUrl = await uploadWeddingImage(smaller, "photos", { optimize: false });
      if (!newUrl) continue;
      map.set(url, newUrl);
      beforeBytes += blob.size;
      afterBytes += smaller.size;
    } catch (e) {
      console.error("Could not optimise", url, e);
    }
  }
  onProgress?.(urls.length, urls.length);

  const s = data.sectionImages ?? {};
  const next: WeddingData = {
    ...data,
    photos: data.photos.map((u) => swap(u, map) as string),
    backgroundImage: swap(data.backgroundImage, map) as string,
    monogramImage: swap(data.monogramImage, map) as string,
    sectionImages: {
      ...s,
      hero: swap(s.hero, map),
      heroSide: swap(s.heroSide, map),
      polaroid: swap(s.polaroid, map),
      seal: swap(s.seal, map),
      location: swap(s.location, map),
      polaroidList: s.polaroidList?.map((u) => swap(u, map) as string),
    },
  };
  return { data: next, replaced: map.size, beforeBytes, afterBytes };
}
