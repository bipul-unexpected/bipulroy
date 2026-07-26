/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  SeeUI · Royalty / Prestige design system
 *  Dark + Light modes from SeeUI Workspace exports
 *  Updated: 2026-07-14
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const workspaceMeta = {
  brandName: "Bipul Roy",
  source: "SeeUI Workspace",
  emotion: "royalty",
  emotionLabel: "Royalty / Prestige",
  modes: ["dark", "light"] as const,
  updatedAt: "2026-07-14T14:31:15.079Z",
} as const;

/** Dark mode psychology palette */
export const paletteDark = {
  background: "#1A0B2E",
  text: "#FAF5FF",
  accent: "#A855F7",
  highlight: "#A855F7",
} as const;

/** Light mode psychology palette (SeeUI light export) */
export const paletteLight = {
  background: "#FAF5FF",
  text: "#5B21B6",
  accent: "#7C3AED",
  highlight: "#7C3AED",
} as const;

/** Dark royalty scale — base 500 = #A855F7 */
export const royaltyScaleDark = {
  50: "#f4eff8",
  100: "#eae0f3",
  200: "#dbc7ef",
  300: "#caa4ed",
  400: "#b87df0",
  500: "#a855f7",
  600: "#8f22f7",
  700: "#7605e1",
  800: "#5c02b1",
  900: "#41017e",
  950: "#2a0250",
} as const;

/** Light royalty scale — base 500 = #7C3AED */
export const royaltyScaleLight = {
  50: "#f1eef7",
  100: "#e4dcf0",
  200: "#cfbfea",
  300: "#b396e6",
  400: "#9768e7",
  500: "#7c3aed",
  600: "#6112e8",
  700: "#4f0dc1",
  800: "#3e0899",
  900: "#2d066f",
  950: "#1e0549",
} as const;

export const typography = {
  heading: "Playfair Display",
  body: "Lato",
  mono: "JetBrains Mono",
  emotion: "royalty",
  label: "Royalty / Prestige",
  dark: { fontWeight: 700, fontSize: 56 },
  light: { fontWeight: 400, fontSize: 56 },
} as const;

export const accessibility = {
  dark: {
    textOnBackground: { ratio: "17.3:1", level: "AAA", pass: true },
    accentOnBackground: { ratio: "4.7:1", level: "AA", pass: true },
    whiteOnAccent: { ratio: "4.0:1", level: "AA Large", pass: false },
  },
  light: {
    textOnBackground: { ratio: "8.4:1", level: "AAA", pass: true },
    accentOnBackground: { ratio: "5.3:1", level: "AA", pass: true },
    whiteOnAccent: { ratio: "5.7:1", level: "AA", pass: true },
  },
} as const;

/** @deprecated use paletteDark — kept for imports */
export const palette = paletteDark;
/** @deprecated use royaltyScaleDark */
export const royaltyScale = royaltyScaleDark;

export const royaltyRgb = {
  accent: "168, 85, 247",
  accentLight: "124, 58, 237",
  deep: "26, 11, 46",
  text: "250, 245, 255",
  textLight: "91, 33, 182",
  mid: "143, 34, 247",
} as const;

export const royaltyHex = {
  bg: paletteDark.background,
  text: paletteDark.text,
  accent: paletteDark.accent,
  accentDeep: royaltyScaleDark[700],
  accentDark: royaltyScaleDark[900],
  accentSoft: royaltyScaleDark[300],
  surface: "#24123d",
  surfaceElevated: "#2d1848",
  button: royaltyScaleDark[700],
  buttonHover: royaltyScaleDark[600],
  lightBg: paletteLight.background,
  lightText: paletteLight.text,
  lightAccent: paletteLight.accent,
} as const;

/**
 * Recent palette history (SeeUI localStorage · newest-first)
 * Ordered as saved by SeeUI workspace session.
 */
export const history = [
  {
    index: 1,
    label: "Trust",
    source: "gallery",
    emotion: "trust",
    background: "#1C253C",
    text: "#E8EAED",
    accent: "#2858D5",
  },
  {
    index: 2,
    label: "Trust",
    source: "gallery",
    emotion: "trust",
    background: "#1A2A39",
    text: "#E3E4E7",
    accent: "#4587E7",
  },
  {
    index: 3,
    label: "Calm",
    source: "gallery",
    emotion: "calm",
    background: "#213043",
    text: "#E7E9EB",
    accent: "#4695C5",
  },
  {
    index: 4,
    label: "Safety",
    source: "gallery",
    emotion: "safety",
    background: "#F7F9FA",
    text: "#454E5B",
    accent: "#1F7AE1",
  },
  {
    index: 5,
    label: "Energy",
    source: "gallery",
    emotion: "energy",
    background: "#F9F1F0",
    text: "#221E1E",
    accent: "#E83712",
  },
  {
    index: 6,
    label: "Creativity",
    source: "gallery",
    emotion: "creativity",
    background: "#1E0E27",
    text: "#EDEAED",
    accent: "#E365E5",
  },
  {
    index: 7,
    label: "Joy",
    source: "gallery",
    emotion: "joy",
    background: "#FBF9F4",
    text: "#49402C",
    accent: "#EDB918",
  },
  {
    index: 8,
    label: "Optimism",
    source: "gallery",
    emotion: "optimism",
    background: "#2C2312",
    text: "#F6F3EF",
    accent: "#EB9134",
  },
  {
    index: 9,
    label: "Love",
    source: "gallery",
    emotion: "love",
    background: "#300E15",
    text: "#EEEAEB",
    accent: "#E52A63",
  },
  {
    index: 10,
    label: "Safety",
    source: "gallery",
    emotion: "safety",
    background: "#F3F6F9",
    text: "#404858",
    accent: "#1F84DA",
  },
  {
    index: 11,
    label: "Energy",
    source: "gallery",
    emotion: "energy",
    background: "#FCF6F6",
    text: "#2D2322",
    accent: "#E02F17",
  },
  {
    index: 12,
    label: "Joy",
    source: "gallery",
    emotion: "joy",
    background: "#FBFAF4",
    text: "#3A362C",
    accent: "#F8C508",
  },
] as const;

export default {
  workspaceMeta,
  paletteDark,
  paletteLight,
  royaltyScaleDark,
  royaltyScaleLight,
  typography,
  accessibility,
  history,
};
