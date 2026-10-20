import { supabase } from "@/integrations/supabase/client";
import type { TelegramConfig } from "@/lib/weddingStore";

const WEDDING_ID = "default-wedding";

export interface TelegramResult {
  ok: boolean;
  error?: string;
}

// Admin "Test": goes through our server (needs the signed-in session).
export const sendTelegramMessage = async (
  botToken: string,
  chatId: string,
  html: string,
): Promise<TelegramResult> => {
  const { data: session } = await supabase.auth.getSession();
  try {
    const res = await fetch("/api/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.session?.access_token ?? ""}`,
      },
      body: JSON.stringify({ botToken, chatId, text: html }),
    });
    const body = await res.json().catch(() => null);
    if (!body) return { ok: false, error: `Server error ${res.status} (is /api deployed?)` };
    return body.ok ? { ok: true } : { ok: false, error: body.description || `Error ${res.status}` };
  } catch {
    return { ok: false, error: "Could not reach the server" };
  }
};

// Owner-only credentials. Preferred home: the telegram_secrets table (RLS lets only
// the owner read it). If that table has not been created on this Supabase project
// yet, they are kept in the signed-in owner's own account profile (user_metadata),
// which is just as private: anonymous visitors and other users cannot read it.
interface StoredTelegram {
  enabled: boolean;
  botToken: string;
  chatId: string;
}

const fromProfile = async (): Promise<TelegramConfig | null> => {
  const { data } = await supabase.auth.getUser();
  const t = data.user?.user_metadata?.telegram as Partial<StoredTelegram> | undefined;
  if (!t) return null;
  return { enabled: !!t.enabled, botToken: t.botToken ?? "", chatId: String(t.chatId ?? "") };
};

export const getTelegramConfig = async (): Promise<TelegramConfig | null> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;
  const { data, error } = await supabase
    .from("telegram_secrets" as never)
    .select("enabled, bot_token, chat_id")
    .eq("wedding_id", WEDDING_ID)
    .maybeSingle();
  if (!error && data) {
    const row = data as unknown as { enabled: boolean; bot_token: string; chat_id: string };
    return { enabled: row.enabled, botToken: row.bot_token, chatId: row.chat_id };
  }
  return fromProfile();
};

export const saveTelegramConfig = async (cfg: TelegramConfig): Promise<boolean> => {
  const clean: StoredTelegram = {
    enabled: cfg.enabled,
    botToken: cfg.botToken.trim(),
    chatId: String(cfg.chatId).trim(),
  };
  const { error } = await supabase.from("telegram_secrets" as never).upsert({
    wedding_id: WEDDING_ID,
    enabled: clean.enabled,
    bot_token: clean.botToken,
    chat_id: clean.chatId,
    updated_at: new Date().toISOString(),
  } as never);
  if (!error) return true;

  // Table missing (or not writable): fall back to the owner's account profile.
  console.warn("telegram_secrets unavailable, saving to the account profile instead:", error);
  const { error: profileError } = await supabase.auth.updateUser({ data: { telegram: clean } });
  if (profileError) console.error("Failed to save Telegram settings:", profileError);
  return !profileError;
};
