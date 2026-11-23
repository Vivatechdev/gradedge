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
let typeIntersections = [];
let stringOrJsx = [];

for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, idx) => {
    if (line.includes(' & ') && !line.includes('&&') && !line.includes('&amp;')) {
      // Check if it's a type intersection like `type ... = ` or `interface ...` or `<... & ...>` or `: Type & Other`
      const isType = /type\s+\w+.*=.*&/.test(line) ||
                     /:\s*[\w<>]+\s+&\s+[\w<>]+\b/.test(line) ||
                     /<\s*[\w<>]+\s+&\s+[\w<>]+\s*>/.test(line) ||
                     /extends\s+[\w<>]+\s+&\s+/.test(line);
      if (isType) {
        typeIntersections.push({ file: f, line: idx + 1, text: line.trim() });
      } else {
        stringOrJsx.push({ file: f, line: idx + 1, text: line.trim() });
      }
    }
  });
}

console.log('Type intersections:', typeIntersections.length);
typeIntersections.forEach(t => console.log('TYPE: ' + t.file + ':' + t.line + ' -> ' + t.text));
console.log('String or JSX lines:', stringOrJsx.length);
