const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        results = results.concat(walk(full));
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.json') || file.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

const dirs = ['./app', './components', './lib', './config'];
let files = [];
dirs.forEach(d => { files = files.concat(walk(d)); });

let replacedCount = 0;
let modifiedFiles = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  let content = original;

  // We want to replace ' & ' with ' and ' in text/strings.
  // We must be careful:
  // 1. ' & ' -> ' and '
  // 2. '&amp;' -> 'and' (or &amp; in jsx)
  // 3. 'Q&A' -> 'Q&A' or 'Q and A'? Let's check where Q&A appears.
  // Let's replace ' & ' with ' and '
  // Also check if there is ' &amp; '
  
  // Note: in TypeScript/JSX, ' & ' is NEVER a valid binary operator unless doing bitwise AND between numbers or type intersection 'TypeA & TypeB'.
  // In type definitions: `type X = A & B;` or `props: Foo & Bar`!
  // We MUST NOT replace ` & ` in TypeScript type intersections!
  // e.g., `type Foo = Bar & Baz;` or `interface Props extends A & B` or `({ params }: { params: Promise<...> } & Foo)`
}
