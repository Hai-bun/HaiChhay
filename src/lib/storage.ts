import { supabase } from "@/integrations/supabase/client";
import { optimizeImage } from "@/lib/imageOptimize";

const BUCKET_NAME =
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET ??
  import.meta.env.vite_supabase_storage_bucket ??
  "wedding-images";

function generateUniquePath(folder: string, file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  const safeName = file.name.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30);
  return `${folder}/${timestamp}-${random}-${safeName}.${ext}`;
}

export async function uploadWeddingImage(
  file: File,
  folder: "photos" | "khqr" | "background" | "monogram" | "fonts" | "music",
  options: { optimize?: boolean } = {},
): Promise<string | null> {
  // Downscale photos (not the KHQR, which must stay pixel-exact, nor fonts).
  if (
    options.optimize !== false &&
    (folder === "photos" || folder === "background" || folder === "monogram")
  ) {
    file = await optimizeImage(file);
  }
  const path = generateUniquePath(folder, file);

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      // Filenames are unique, so browsers/CDN may cache them for a year.
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    console.error("Storage upload failed:", error);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
}

export function isStorageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.pathname.includes(
      `/storage/v1/object/public/${BUCKET_NAME}/`,
    );
  } catch {
    return false;
  }
}

export async function deleteWeddingImage(url: string): Promise<boolean> {
  if (!isStorageUrl(url)) return true;

  const path = url.split(`/storage/v1/object/public/${BUCKET_NAME}/`)[1];
  if (!path) return false;

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
  if (error) {
    console.error("Storage delete failed:", error);
    return false;
  }
  return true;
}
