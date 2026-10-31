import fs from "fs";
import path from "path";

interface ReplacementReport {
  file: string;
  line: number;
  oldClass: string;
  newClass: string;
  lineContent: string;
}

const reports: ReplacementReport[] = [];

// Specific replacement rules
// We use regex with negative/positive lookaround to be 100% precise
const rules: Array<{ pattern: RegExp; replacement: string; oldName: string; newName: string }> = [
  {
    // Match text-navy-deep
    pattern: /\btext-navy-deep\b/g,
    replacement: "text-tone-heading",
    oldName: "text-navy-deep",
    newName: "text-tone-heading",
  },
  {
    // Match text-ink-soft (MUST be before text-ink!)
    pattern: /\btext-ink-soft\b/g,
    replacement: "text-tone-muted",
    oldName: "text-ink-soft",
    newName: "text-tone-muted",
  },
  {
    // Match text-ink, but NOT text-ink-soft, NOT text-ink-light, NOT text-ink-muted
    pattern: /\btext-ink(?![-\w])/g,
    replacement: "text-tone-body",
    oldName: "text-ink",
    newName: "text-tone-body",
  },
  {
    // Match border-rule, but NOT border-rule-something
    pattern: /\bborder-rule(?![-\w])/g,
    replacement: "border-tone-rule",
    oldName: "border-rule",
    newName: "border-tone-rule",
  },
  {
    // Match divide-rule, but NOT divide-rule-something
    pattern: /\bdivide-rule(?![-\w])/g,
    replacement: "divide-tone-rule",
    oldName: "divide-rule",
    newName: "divide-tone-rule",
  },
];

function processFile(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  let modified = false;

  const newLines = lines.map((line, idx) => {
    let currentLine = line;

    // Check for each replacement
    for (const rule of rules) {
      if (rule.pattern.test(currentLine)) {
        reports.push({
          file: filePath.replace(/\\/g, "/"),
          line: idx + 1,
          oldClass: rule.oldName,
          newClass: rule.newName,
          lineContent: line.trim(),
        });
        currentLine = currentLine.replace(rule.pattern, rule.replacement);
        modified = true;
      }
    }

    return currentLine;
  });

  if (modified) {
    fs.writeFileSync(filePath, newLines.join("\n"), "utf-8");
  }
}

function walkDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next") {
        walkDir(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
      processFile(fullPath);
    }
  }
}

// Target app directory
const targetDir = path.resolve(__dirname, "../app");
walkDir(targetDir);

// Write reports to JSON file for audit compilation
fs.writeFileSync(
  path.resolve(__dirname, "migration-report.json"),
  JSON.stringify(reports, null, 2),
  "utf-8"
);

console.log(`Successfully migrated ${reports.length} instances across app directory.`);
console.log(`Report written to scripts/migration-report.json`);

