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
const validEntities = ['&apos;', '&ldquo;', '&rdquo;', '&lsquo;', '&rsquo;', '&times;', '&check;', '&bull;', '&mdash;', '&copy;', '&hellip;', '&rarr;', '&larr;', '&nbsp;', '&quot;', '&middot;'];

let remaining = [];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    let stripped = l;
    // strip valid entities
    validEntities.forEach(e => {
      stripped = stripped.split(e).join('');
    });
    // strip &&
    stripped = stripped.replace(/&&/g, '');
    // strip url query params (?.*=.*&.*)
    stripped = stripped.replace(/[?&][a-zA-Z0-9_]+=[^"'\s&]*/g, '');
    // check if & still exists
    if (stripped.includes('&')) {
      remaining.push({ file: f, line: idx + 1, text: l.trim(), stripped: stripped.trim() });
    }
  });
}

console.log('Remaining lines with &:', remaining.length);
remaining.forEach(r => console.log(r.file + ':' + r.line + ' -> ' + r.text));
