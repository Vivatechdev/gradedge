/**
 * WCAG 2.1 Contrast Ratio Checker for GradEdge Tone System
 */

import { TONE_STYLES, SectionTone } from "../components/ui/section";

function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function parseColor(color: string, bgRgb?: [number, number, number]): [number, number, number] {
  if (color.startsWith("#")) {
    return hexToRgb(color);
  }
  // rgba(255, 255, 255, 0.2) or similar
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1], 10);
    const g = parseInt(rgbaMatch[2], 10);
    const b = parseInt(rgbaMatch[3], 10);
    const a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;
    if (a < 1 && bgRgb) {
      // composite over bg
      return [
        Math.round(r * a + bgRgb[0] * (1 - a)),
        Math.round(g * a + bgRgb[1] * (1 - a)),
        Math.round(b * a + bgRgb[2] * (1 - a)),
      ];
    }
    return [r, g, b];
  }
  throw new Error(`Unsupported color format: ${color}`);
}

function sRgbToLinear(c: number): number {
  const norm = c / 255;
  return norm <= 0.03928 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  return 0.2126 * sRgbToLinear(r) + 0.7152 * sRgbToLinear(g) + 0.0722 * sRgbToLinear(b);
}

function contrastRatio(fgHex: string, bgHex: string): number {
  const bg = parseColor(bgHex);
  const fg = parseColor(fgHex, bg);
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

console.log("===============================================================================");
console.log("            GRADEDGE TONE SYSTEM CONTRAST RATIO AUDIT REPORT                   ");
console.log("===============================================================================");
console.log();

const tones: SectionTone[] = ["paper", "cream", "white", "navy", "navy-deep"];

let totalPairs = 0;
let passedPairs = 0;

for (const tone of tones) {
  const style = TONE_STYLES[tone];
  console.log(`\n--- TONE: ${tone.toUpperCase()} (bg: ${style.bg}) ---`);
  console.log("-------------------------------------------------------------------------------");
  console.log(
    "Element".padEnd(20) +
    "Foreground".padEnd(16) +
    "Background".padEnd(16) +
    "Ratio".padEnd(10) +
    "Min Req".padEnd(10) +
    "Status"
  );
  console.log("-------------------------------------------------------------------------------");

  const pairs: Array<{
    name: string;
    fg: string;
    bg: string;
    minRatio: number;
    desc: string;
  }> = [
    { name: "Heading", fg: style.heading, bg: style.bg, minRatio: 4.5, desc: "Level 1-3 headings" },
    { name: "Body text", fg: style.body, bg: style.bg, minRatio: 4.5, desc: "Paragraph / body" },
    { name: "Muted text", fg: style.muted, bg: style.bg, minRatio: 4.5, desc: "Metadata, secondary" },
    { name: "Link", fg: style.link, bg: style.bg, minRatio: 4.5, desc: "Inline / editorial links" },
    { name: "Rule / Border (decor)", fg: style.rule, bg: style.bg, minRatio: 1.0, desc: "Hairline decorative divider" },
    { name: "Input Text", fg: style.inputText, bg: style.inputBg, minRatio: 4.5, desc: "Form input text" },
    { name: "Input Placeholder", fg: style.inputPlaceholder, bg: style.inputBg, minRatio: 4.5, desc: "Form placeholder" },
    { name: "Input Border", fg: style.inputBorder, bg: style.bg, minRatio: 3.0, desc: "Input boundary contrast" },
  ];

  for (const p of pairs) {
    totalPairs++;
    const ratio = contrastRatio(p.fg, p.bg);
    const pass = ratio >= p.minRatio;
    if (pass) passedPairs++;
    console.log(
      p.name.padEnd(20) +
      p.fg.padEnd(16) +
      p.bg.padEnd(16) +
      `${ratio.toFixed(2)}:1`.padEnd(10) +
      `${p.minRatio.toFixed(1)}:1`.padEnd(10) +
      (pass ? "PASS" : "FAIL")
    );
  }
}

// Button check
console.log("\n--- BUTTON STATES ---");
console.log("-------------------------------------------------------------------------------");
console.log(
  "Button Type".padEnd(28) +
  "Foreground".padEnd(16) +
  "Background".padEnd(16) +
  "Ratio".padEnd(10) +
  "Min Req".padEnd(10) +
  "Status"
);
console.log("-------------------------------------------------------------------------------");

const buttonChecks = [
  { name: "Gold Button (default)", fg: "#14263F", bg: "#C8963E", minRatio: 4.5 },
  { name: "Gold Button (hover)", fg: "#14263F", bg: "#D6A650", minRatio: 4.5 },
  { name: "Navy Button on Light", fg: "#FFFFFF", bg: "#1F3A5F", minRatio: 4.5 },
  { name: "Outline on Light (Navy)", fg: "#1F3A5F", bg: "#FAF8F4", minRatio: 4.5 },
  { name: "Outline on Navy (White)", fg: "#FFFFFF", bg: "#1F3A5F", minRatio: 4.5 },
  { name: "Outline on Navy (hover)", fg: "#14263F", bg: "#FFFFFF", minRatio: 4.5 },
  { name: "Disabled Button (Dark text)", fg: "#555555", bg: "#E4DFD5", minRatio: 3.0 },
  { name: "Disabled Button (Navy tone)", fg: "#E6ECF4", bg: "#1F3A5F", minRatio: 3.0 },
];

for (const b of buttonChecks) {
  totalPairs++;
  const ratio = contrastRatio(b.fg, b.bg);
  const pass = ratio >= b.minRatio;
  if (pass) passedPairs++;
  console.log(
    b.name.padEnd(28) +
    b.fg.padEnd(16) +
    b.bg.padEnd(16) +
    `${ratio.toFixed(2)}:1`.padEnd(10) +
    `${b.minRatio.toFixed(1)}:1`.padEnd(10) +
    (pass ? "PASS" : "FAIL")
  );
}

console.log("\n===============================================================================");
console.log(`TOTAL AUDIT: ${passedPairs}/${totalPairs} (${Math.round((passedPairs/totalPairs)*100)}%) contrast checks passed.`);
console.log("===============================================================================");
