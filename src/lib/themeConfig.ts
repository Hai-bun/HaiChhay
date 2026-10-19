// Theme configuration for wedding invitation
export type ThemeType = "luxury" | "minimal" | "traditional" | "floral";

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    card: string;
  };
  fonts: {
    heading: string;
    body: string;
    script: string;
  };
  style: {
    borderRadius: string;
    shadowIntensity: "subtle" | "medium" | "dramatic";
    decorativeElements: boolean;
    gradientStyle: string;
  };
}

export const THEMES: Record<ThemeType, ThemeConfig> = {
  luxury: {
    id: "luxury",
    name: "Luxury Rose Gold",
    description: "Elegant rose gold with champagne accents",
    preview: "linear-gradient(135deg, #f5e6d3 0%, #c9a87c 50%, #d4a574 100%)",
    colors: {
      primary: "15 45% 65%", // Rose gold
      secondary: "35 35% 90%", // Champagne
      accent: "38 70% 55%", // Gold
      background: "30 25% 98%", // Ivory
      foreground: "20 20% 15%", // Dark brown
      muted: "20 25% 95%", // Soft blush
      card: "30 30% 99%", // Warm white
    },
    fonts: {
      heading: "Cormorant Garamond",
      body: "Lato",
      script: "Great Vibes",
    },
    style: {
      borderRadius: "0.75rem",
      shadowIntensity: "medium",
      decorativeElements: true,
      gradientStyle:
        "linear-gradient(135deg, hsl(350 35% 92%) 0%, hsl(30 25% 98%) 50%, hsl(38 45% 85%) 100%)",
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal Elegance",
    description: "Clean, modern black and white aesthetic",
    preview: "linear-gradient(135deg, #ffffff 0%, #f8f8f8 50%, #e0e0e0 100%)",
    colors: {
      primary: "0 0% 15%", // Near black
      secondary: "0 0% 96%", // Off white
      accent: "0 0% 40%", // Dark gray
      background: "0 0% 100%", // Pure white
      foreground: "0 0% 10%", // Black
      muted: "0 0% 95%", // Light gray
      card: "0 0% 99%", // White
    },
    fonts: {
      heading: "Cormorant Garamond",
      body: "Lato",
      script: "Great Vibes",
    },
    style: {
      borderRadius: "0",
      shadowIntensity: "subtle",
      decorativeElements: false,
      gradientStyle:
        "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 0% 96%) 100%)",
    },
  },
  traditional: {
    id: "traditional",
    name: "Traditional Khmer",
    description: "Rich burgundy and gold inspired by Cambodian tradition",
    preview: "linear-gradient(135deg, #8B0000 0%, #DAA520 50%, #FFD700 100%)",
    colors: {
      primary: "0 70% 35%", // Deep burgundy/red
      secondary: "43 75% 50%", // Royal gold
      accent: "48 95% 55%", // Bright gold
      background: "40 40% 97%", // Warm cream
      foreground: "0 50% 15%", // Dark burgundy
      muted: "40 30% 92%", // Warm beige
      card: "45 50% 98%", // Cream
    },
    fonts: {
      heading: "Cormorant Garamond",
      body: "Lato",
      script: "Great Vibes",
    },
    style: {
      borderRadius: "0.5rem",
      shadowIntensity: "dramatic",
      decorativeElements: true,
      gradientStyle:
        "linear-gradient(135deg, hsl(40 40% 97%) 0%, hsl(43 60% 90%) 50%, hsl(40 40% 97%) 100%)",
    },
  },
  floral: {
    id: "floral",
    name: "Garden Floral",
    description: "Soft sage green with blush pink florals",
    preview: "linear-gradient(135deg, #E8F5E9 0%, #F8BBD9 50%, #FFF3E0 100%)",
    colors: {
      primary: "340 55% 65%", // Dusty pink
      secondary: "140 30% 85%", // Soft sage
      accent: "340 70% 70%", // Rose pink
      background: "85 30% 97%", // Soft cream green
      foreground: "150 25% 20%", // Deep forest
      muted: "100 20% 93%", // Light sage
      card: "80 40% 98%", // Warm white green
    },
    fonts: {
      heading: "Cormorant Garamond",
      body: "Lato",
      script: "Great Vibes",
    },
    style: {
      borderRadius: "1rem",
      shadowIntensity: "subtle",
      decorativeElements: true,
      gradientStyle:
        "linear-gradient(135deg, hsl(140 30% 95%) 0%, hsl(340 40% 95%) 50%, hsl(85 30% 97%) 100%)",
    },
  },
};

export const getTheme = (themeId: ThemeType): ThemeConfig => {
  return THEMES[themeId] || THEMES.luxury;
};

// System fonts that phones don't ship with, mapped to a metric-compatible
// Google font so mobile matches what the admin sees on desktop.
const SYSTEM_FONT_SUBSTITUTES: Record<string, string> = {
  arial: "Arimo",
  helvetica: "Arimo",
  "helvetica neue": "Arimo",
  "times new roman": "Tinos",
  times: "Tinos",
  "courier new": "Cousine",
  georgia: "Gelasio",
  calibri: "Carlito",
  cambria: "Caladea",
};

// Fonts the admin uploaded (e.g. a Khmer font that only exists on their PC)
// are registered with @font-face so every guest's device can load them.
const registeredFaces = new Map<string, string>();

const registerCustomFonts = (fonts: Array<{ family: string; url: string }> = []) => {
  for (const { family, url } of fonts) {
    if (!family || !url || registeredFaces.get(family.toLowerCase()) === url) continue;
    registeredFaces.set(family.toLowerCase(), url);
    const id = `custom-font-${family.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    document.getElementById(id)?.remove();
    const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
    const format =
      ext === "woff2" ? "woff2" : ext === "woff" ? "woff" : ext === "otf" ? "opentype" : "truetype";
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@font-face{font-family:"${family.replace(/"/g, "")}";src:url("${url}") format("${format}");font-display:swap;}`;
    document.head.appendChild(style);
  }
};

const loadedFonts = new Set<string>();

// Fonts the admin types in are only installed on the admin's own computer, so
// request them from Google Fonts. Unknown names 400 harmlessly and fall back.
const ensureFontLoaded = (name: string | undefined): string | undefined => {
  const raw = name?.trim();
  if (raw && registeredFaces.has(raw.toLowerCase())) return raw; // uploaded font, not on Google
  if (!raw) return undefined;
  const family = SYSTEM_FONT_SUBSTITUTES[raw.toLowerCase()] ?? raw;
  if (!loadedFonts.has(family)) {
    loadedFonts.add(family);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap`;
    document.head.appendChild(link);
  }
  return family;
};

const HEX = /^#[0-9a-f]{6}$/i;

// "#rrggbb" -> [h, s%, l%] so it can feed the app's `hsl(var(--token))` colors.
const hexToHsl = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
};

// Custom text colors are set on <html> and picked up by `html[data-*-color]`
// rules in index.css, which use !important so they beat each template's own
// colors. Empty/invalid values fall back to the theme.
const applyTextColors = (colors?: { body?: string; heading?: string; names?: string; border?: string }) => {
  const root = document.documentElement;
  const set = (key: "body" | "heading" | "names" | "border", vars: Record<string, string>) => {
    const value = colors?.[key]?.trim();
    const attr = `data-${key}-color`;
    if (value && HEX.test(value)) {
      root.setAttribute(attr, "1");
      Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
      return value;
    }
    root.removeAttribute(attr);
    Object.keys(vars).forEach((k) => root.style.removeProperty(k));
    return "";
  };

  const body = colors?.body?.trim();
  if (body && HEX.test(body)) {
    const [h, s, l] = hexToHsl(body);
    // Secondary text is the same hue, pushed toward the middle for contrast.
    const muted = `${h} ${Math.max(s - 15, 0)}% ${l < 50 ? Math.min(l + 22, 70) : Math.max(l - 22, 35)}%`;
    set("body", { "--user-foreground": `${h} ${s}% ${l}%`, "--user-muted": muted });
  } else {
    set("body", { "--user-foreground": "", "--user-muted": "" });
  }
  set("heading", { "--user-heading": colors?.heading?.trim() ?? "" });
  set("names", { "--user-names": colors?.names?.trim() ?? "" });
  const border = colors?.border?.trim() ?? "";
  if (border && HEX.test(border)) {
    const [h, sat, l] = hexToHsl(border);
    set("border", { "--user-border": border, "--user-border-hsl": `${h} ${sat}% ${l}%` });
  } else {
    set("border", { "--user-border": "", "--user-border-hsl": "" });
  }
};

export const applyTheme = (
  themeId: ThemeType,
  customFonts?: {
    headingFont?: string;
    bodyFont?: string;
    nameFont?: string;
    fontFiles?: Array<{ family: string; url: string }>;
    colors?: { body?: string; heading?: string; names?: string; border?: string };
  },
): void => {
  const theme = getTheme(themeId);
  registerCustomFonts(customFonts?.fontFiles);
  applyTextColors(customFonts?.colors);
  const root = document.documentElement;

  // Apply colors
  root.style.setProperty("--primary", theme.colors.primary);
  root.style.setProperty("--secondary", theme.colors.secondary);
  root.style.setProperty("--accent", theme.colors.accent);
  root.style.setProperty("--background", theme.colors.background);
  root.style.setProperty("--foreground", theme.colors.foreground);
  root.style.setProperty("--muted", theme.colors.muted);
  root.style.setProperty("--card", theme.colors.card);
  root.style.setProperty("--card-foreground", theme.colors.foreground);
  root.style.setProperty("--popover", theme.colors.card);
  root.style.setProperty("--popover-foreground", theme.colors.foreground);

  // Apply ring color (for focus states)
  root.style.setProperty("--ring", theme.colors.primary);
  root.style.setProperty("--hero-gradient", theme.style.gradientStyle);

  const headingFont =
    ensureFontLoaded(customFonts?.headingFont) || theme.fonts.heading;
  const bodyFont = ensureFontLoaded(customFonts?.bodyFont) || theme.fonts.body;
  const nameFont = ensureFontLoaded(customFonts?.nameFont);

  // Keep a Khmer fallback after the chosen Latin font so Khmer text renders in
  // a proper Khmer typeface no matter which custom font is selected.
  root.style.setProperty(
    "--font-serif",
    `"${headingFont}", "${theme.fonts.heading}", "Noto Serif Khmer", serif`,
  );
  root.style.setProperty(
    "--font-sans",
    `"${bodyFont}", "${theme.fonts.body}", "Noto Sans Khmer", sans-serif`,
  );
  // The couple names use --font-script. If the couple picked a name font, use
  // it first; otherwise fall back to the theme's script + Moul (Khmer) so names
  // still look elegant by default.
  root.style.setProperty(
    "--font-script",
    nameFont
      ? `"${nameFont}", "${theme.fonts.script}", "Moul", cursive`
      : `"${theme.fonts.script}", "Moul", cursive`,
  );

  // Store theme-specific classes
  root.setAttribute("data-theme", themeId);
  root.style.setProperty("--radius", theme.style.borderRadius);
};

export const getThemeClasses = (themeId: ThemeType): string => {
  const classes: string[] = [];

  switch (themeId) {
    case "minimal":
      classes.push("theme-minimal");
      break;
    case "traditional":
      classes.push("theme-traditional");
      break;
    case "floral":
      classes.push("theme-floral");
      break;
    default:
      classes.push("theme-luxury");
  }

  return classes.join(" ");
};
