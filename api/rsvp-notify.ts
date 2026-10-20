// Guest RSVP -> Telegram. The bot token never reaches the browser: it is read
// here with the Supabase service-role key from the owner-only telegram_secrets
// table. Needs env vars SUPABASE_SERVICE_ROLE_KEY (+ SUPABASE_URL or VITE_SUPABASE_URL).
const WEDDING_ID = "default-wedding";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, description: "Method not allowed" });

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return res.status(500).json({ ok: false, description: "Server is missing SUPABASE_SERVICE_ROLE_KEY" });
  }

  const { guestName, attending, message } = req.body ?? {};
  if (typeof guestName !== "string" || typeof attending !== "boolean") {
    return res.status(400).json({ ok: false, description: "Invalid request" });
  }

  // 1) the telegram_secrets table; 2) if it does not exist yet, the owner's account
  //    profile (user_metadata.telegram), read with the service-role key.
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  let cfg: { enabled?: boolean; bot_token?: string; chat_id?: string } | undefined;
  try {
    const q = await fetch(
      `${url}/rest/v1/telegram_secrets?wedding_id=eq.${WEDDING_ID}&select=enabled,bot_token,chat_id`,
      { headers },
    );
    const rows = q.ok ? await q.json() : [];
    cfg = Array.isArray(rows) ? rows[0] : undefined;
  } catch {
    cfg = undefined;
  }
  if (!cfg) {
    try {
      const p = await fetch(`${url}/rest/v1/wedding_profiles?id=eq.${WEDDING_ID}&select=user_id`, { headers });
      const owner = (await p.json())?.[0]?.user_id;
      if (owner) {
        const u = await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(owner)}`, { headers });
        const t = (await u.json())?.user_metadata?.telegram;
        if (t) cfg = { enabled: !!t.enabled, bot_token: t.botToken, chat_id: String(t.chatId ?? "") };
      }
    } catch {
      /* fall through to "off" */
    }
  }
  if (!cfg?.enabled || !cfg.bot_token || !cfg.chat_id) {
    return res.status(200).json({ ok: false, description: "Telegram notifications are off" });
  }

  const text =
    `🎊 <b>New RSVP Response</b>\n\n` +
    `👤 <b>Guest:</b> ${esc(guestName.slice(0, 100))}\n` +
    `✅ <b>Status:</b> ${attending ? "Attending" : "Not Attending"}\n` +
    `💌 <b>Message:</b> ${esc(String(message || "No message").slice(0, 1500))}\n` +
    `📅 <b>Date:</b> ${new Date().toLocaleString("en-GB", { timeZone: "Asia/Phnom_Penh" })}`;

  try {
    const tg = await fetch(`https://api.telegram.org/bot${cfg.bot_token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: cfg.chat_id, text, parse_mode: "HTML" }),
    });
    const body = await tg.json().catch(() => ({}));
    return res.status(tg.ok ? 200 : 502).json({ ok: tg.ok, description: body?.description });
  } catch {
    return res.status(502).json({ ok: false, description: "Could not reach Telegram" });
  }
}
