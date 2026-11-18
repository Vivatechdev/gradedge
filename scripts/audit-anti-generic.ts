import fs from "fs";
import path from "path";

const BANNED_PHRASES = [
  "game changer",
  "revolutionary",
  "all-in-one",
  "supercharge",
  "unleash",
  "elevate your",
  "cutting-edge",
  "unlock your potential",
  "seamlessly",
  "transformative",
];

const PLACEHOLDERS = [
  "lorem ipsum",
  "dolor sit amet",
  "coming soon",
  "placeholder",
  "john doe",
  "jane doe",
  "acme",
];

const EMOJI_REGEX = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

interface AuditResult {
  file: string;
  gradients: string[];
  glassmorphism: string[];
  emojis: string[];
  placeholders: string[];
  bannedPhrases: string[];
  emDashes: string[];
}

const results: AuditResult[] = [];

function scanFile(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, "/");

  // Skip test scripts and build outputs
  if (relPath.startsWith("scripts/") || relPath.startsWith("tests/") || relPath.includes(".next/")) return;

  const lines = content.split("\n");
  const r: AuditResult = {
    file: relPath,
    gradients: [],
    glassmorphism: [],
    emojis: [],
    placeholders: [],
    bannedPhrases: [],
    emDashes: [],
  };

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // Check gradients
    if (line.includes("bg-gradient-") || line.includes("linear-gradient")) {
      r.gradients.push(`L${lineNum}: ${line.trim()}`);
    }

    // Check glassmorphism
    if (line.includes("backdrop-blur")) {
      r.glassmorphism.push(`L${lineNum}: ${line.trim()}`);
    }

    // Check emojis
    if (EMOJI_REGEX.test(line)) {
      r.emojis.push(`L${lineNum}: ${line.trim()}`);
    }

    // Check placeholders (ignoring comments)
    if (!line.trim().startsWith("//") && !line.trim().startsWith("/*")) {
      const lower = line.toLowerCase();
      PLACEHOLDERS.forEach((p) => {
        if (lower.includes(p) && !lower.includes("placeholder-") && !lower.includes("image-placeholder")) {
          r.placeholders.push(`L${lineNum} [${p}]: ${line.trim()}`);
        }
      });

      // Check banned phrases
      BANNED_PHRASES.forEach((bp) => {
        if (lower.includes(bp)) {
          r.bannedPhrases.push(`L${lineNum} [${bp}]: ${line.trim()}`);
        }
      });

      // Check em dashes
      if (line.includes("—") || line.includes("&mdash;")) {
        r.emDashes.push(`L${lineNum}: ${line.trim()}`);
      }
    }
  });

  if (
    r.gradients.length ||
    r.glassmorphism.length ||
    r.emojis.length ||
    r.placeholders.length ||
    r.bannedPhrases.length ||
    r.emDashes.length
  ) {
    results.push(r);
  }
}

function walkDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next" && entry.name !== ".git") {
        walkDir(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
      scanFile(fullPath);
    }
  }
}

walkDir(path.join(process.cwd(), "app"));
walkDir(path.join(process.cwd(), "components"));

console.log(JSON.stringify(results, null, 2));

