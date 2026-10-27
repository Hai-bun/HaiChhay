// Serves the SPA shell for /invite/:id with link-preview tags (og:title, og:image...)
// filled in from the saved wedding profile. Chat apps (Telegram, WhatsApp, Facebook)
// do not run JavaScript, so the tags must be in the HTML they download.
// Any failure falls back to the untouched index.html.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  const host = String(req.headers?.["x-forwarded-host"] || req.headers?.host || "");
  const origin = `https://${host}`;
  let html: string;
  try {
    const shell = await fetch(`${origin}/index.html`);
    if (!shell.ok) throw new Error(`index.html ${shell.status}`);
    html = await shell.text();
  } catch {
    res.setHeader("Location", "/");
    return res.status(302).end();
  }

  try {
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const anon = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !anon) throw new Error("no supabase env");
    const r = await fetch(
      `${url}/rest/v1/wedding_profiles?id=eq.default-wedding&select=groom_name,bride_name,groom_name_kh,bride_name_kh,wedding_date_time,background_image_url,welcome_popup`,
      { headers: { apikey: anon } },
    );
    const p = (await r.json())?.[0];
    if (!p) throw new Error("no profile");

    const groom = p.groom_name_kh || p.groom_name;
    const bride = p.bride_name_kh || p.bride_name;
    const title = `${groom} & ${bride}`;
    let date = "";
    if (p.wedding_date_time) {
      date = new Date(`${String(p.wedding_date_time).slice(0, 10)}T00:00:00Z`).toLocaleDateString("km-KH", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });
    }
    const description = `សូមគោរពអញ្ជើញចូលរួមពិធីអាពាហ៍ពិពាហ៍${date ? ` ថ្ងៃទី ${date}` : ""}`;
    const imgs = p.welcome_popup?.sectionImages ?? {};
    const image = [imgs.hero, imgs.heroSide, imgs.seal, p.background_image_url].find(
      (u: unknown) => typeof u === "string" && /^https:\/\//.test(u),
    );

    const esc = (v: string) =>
      v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const meta = (attr: "property" | "name", key: string, v: string) =>
      `<meta ${attr}="${key}" content="${esc(v)}" />`;

    const tags = [
      meta("property", "og:type", "website"),
      meta("property", "og:url", `${origin}${req.url || ""}`),
      meta("property", "og:title", title),
      meta("property", "og:description", description),
      meta("name", "twitter:card", image ? "summary_large_image" : "summary"),
      meta("name", "twitter:title", title),
      meta("name", "twitter:description", description),
      ...(image ? [meta("property", "og:image", image), meta("name", "twitter:image", image)] : []),
    ].join("\n    ");

    // Drop the old static tags, then add ours.
    html = html
      .replace(/<meta\s+(?:property|name)="(?:og|twitter):[^"]*"[^>]*>\s*/g, "")
      .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
      .replace(/<meta name="description"[^>]*>/, meta("name", "description", description))
      .replace("</head>", `    ${tags}\n  </head>`);
  } catch {
    // keep the default index.html
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");
  return res.status(200).send(html);
}
