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

const files = walk('./app').concat(walk('./components')).concat(walk('./lib')).concat(walk('./config'));
let realTypes = [];

for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, idx) => {
    // Check if line contains & but is not inside a string ("...", '...', `...`) or JSX (<...>) or comment (//, /*)
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
    
    // Check if & is inside a type declaration
    if (/^(export\s+)?(type|interface)\s+/.test(trimmed) && trimmed.includes('&')) {
      realTypes.push({ file: f, line: idx + 1, text: trimmed });
    }
  });
}

console.log('Real type intersections:', realTypes.length);
realTypes.forEach(t => console.log(t.file + ':' + t.line + ' -> ' + t.text));
