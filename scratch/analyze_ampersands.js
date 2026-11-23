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
let urls = [];
let htmlEntities = [];
let other = [];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    // find single & that is not &&
    const regex = /(?<!&)&(?!&)/g;
    let match;
    while ((match = regex.exec(l)) !== null) {
      const surrounding = l.substring(Math.max(0, match.index - 10), Math.min(l.length, match.index + 15));
      if (surrounding.includes('&amp;') || surrounding.includes('&nbsp;') || surrounding.includes('&quot;')) {
        htmlEntities.push({ file: f, line: idx + 1, snippet: surrounding });
      } else if (surrounding.includes('=') || surrounding.includes('/') || surrounding.includes('?') || surrounding.includes('http')) {
        urls.push({ file: f, line: idx + 1, snippet: surrounding });
      } else {
        other.push({ file: f, line: idx + 1, snippet: surrounding, lineText: l.trim() });
      }
    }
  });
}

console.log('HTML entities:', htmlEntities.length);
console.log('URLs/query params:', urls.length);
console.log('Other (text/copy):', other.length);
console.log('\nSample URLs:');
urls.slice(0, 10).forEach(u => console.log(u.file + ':' + u.line + ' -> ' + u.snippet));
console.log('\nSample HTML entities:');
htmlEntities.slice(0, 10).forEach(h => console.log(h.file + ':' + h.line + ' -> ' + h.snippet));
