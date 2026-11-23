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
const validEntities = new Set(['bull', 'check', 'mdash', 'copy', 'hellip', 'rarr', 'larr', 'nbsp', 'quot', 'apos', 'times', 'lt', 'gt', 'middot']);

let candidates = [];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    // Check if line has &
    if (!l.includes('&')) return;
    if (l.trim().startsWith('import ') || l.trim().startsWith('import{')) return;

    // Check for &amp;
    if (l.includes('&amp;')) {
      candidates.push({ file: f, line: idx + 1, type: 'amp', text: l.trim() });
      return;
    }

    // Check for & surrounded by spaces
    if (l.includes(' & ')) {
      candidates.push({ file: f, line: idx + 1, type: 'space-amp-space', text: l.trim() });
      return;
    }

    // Check for other attached & (e.g. Q&A or Research&Design)
    const regex = /([a-zA-Z0-9])&([a-zA-Z0-9])/g;
    let m;
    while ((m = regex.exec(l)) !== null) {
      // make sure it's not an entity like &bull;
      candidates.push({ file: f, line: idx + 1, type: 'attached-amp', match: m[0], text: l.trim() });
    }
  });
}

console.log('Total candidates to replace with "and":', candidates.length);
const attached = candidates.filter(c => c.type === 'attached-amp');
console.log('Attached ampersands (e.g. Q&A):', attached.length);
attached.forEach(a => console.log(a.file + ':' + a.line + ' [' + a.match + '] -> ' + a.text));
