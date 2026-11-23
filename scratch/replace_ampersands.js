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

const files = walk('./app').concat(walk('./components')).concat(walk('./lib')).concat(walk('./config'));

const HTML_ENTITIES = [
  '&apos;', '&ldquo;', '&rdquo;', '&lsquo;', '&rsquo;',
  '&times;', '&check;', '&bull;', '&mdash;', '&copy;',
  '&hellip;', '&rarr;', '&larr;', '&nbsp;', '&quot;', '&middot;'
];

let totalReplacements = 0;
let modifiedFiles = [];

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  let content = original;

  // 1. Replace ' & ' with ' and '
  // But ensure it's not a URL query param line or code logical operator.
  // In TS/TSX, ' & ' is NEVER in URL query strings (query params don't have spaces around &).
  // In TS/TSX, ' && ' is logical AND, which does not match ' & '.
  // So ' & ' is ALWAYS user-facing text, comments, titles, or strings!
  
  // 2. Replace ' &amp; ' or '&amp;' when used as ampersand (not in valid entity names)
  // Let's check `&amp;`
  
  let newContent = content;
  
  // Replace &amp; with and
  newContent = newContent.replace(/&amp;/g, 'and');
  
  // Replace ' & ' with ' and '
  newContent = newContent.replace(/ & /g, ' and ');

  if (newContent !== original) {
    totalReplacements++;
    modifiedFiles.push(file);
    fs.writeFileSync(file, newContent, 'utf8');
  }
}

console.log('Modified files:', modifiedFiles.length);
console.log('Total files checked:', files.length);
