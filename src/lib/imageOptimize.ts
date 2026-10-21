// Phone photos are often 4-12 MB. Guests on mobile data wait on every byte, so
// photos are downscaled and re-encoded in the browser before they are uploaded.
const MAX_SIDE = 2400; // sharp on a full-bleed laptop hero, still ~10x smaller than a camera file
const QUALITY = 0.85;

export async function optimizeImage(file: File, maxSide = MAX_SIDE): Promise<File> {
  // Leave GIF/SVG (animation / vector) and non-images untouched.
  if (!/^image\/(jpeg|png|webp|heic|heif)$/i.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/webp", QUALITY),
    );
    // Keep the original if re-encoding failed or did not make it smaller.
    if (!blob || blob.type !== "image/webp" || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp" });
  } catch {
    return file;
  }
}
