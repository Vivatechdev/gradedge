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
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(full);
    }
  }
  return results;
}

const dirs = ['./app', './components', './lib', './config'];
let files = [];
dirs.forEach(d => { files = files.concat(walk(d)); });

let matches = [];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    // Check for & surrounded by spaces or in strings/jsx
    if (l.includes(' & ') && !l.includes('&&') && !l.includes('&amp;') && !l.includes('bit_and') && !l.includes('&nbsp;')) {
      matches.push({ file: f, line: idx + 1, text: l.trim() });
    }
  });
}

console.log('Total matches with " & ":', matches.length);
matches.slice(0, 50).forEach(m => console.log(`${m.file}:${m.line} -> ${m.text}`));
