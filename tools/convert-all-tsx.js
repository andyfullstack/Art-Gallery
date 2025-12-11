#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { transform } = require('sucrase');

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full));
    } else if (/\.tsx?$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const root = path.resolve(__dirname, '..', 'src');
if (!fs.existsSync(root)) {
  console.error('src directory not found');
  process.exit(1);
}

const files = walk(root).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
if (files.length === 0) {
  console.log('No .ts/.tsx files found under src.');
  process.exit(0);
}

for (const f of files) {
  try {
    const src = fs.readFileSync(f, 'utf8');
    const out = transform(src, {
      transforms: ['typescript', 'jsx'],
      filePath: f,
    }).code;
    const newPath = f.replace(/\.tsx?$/, '.jsx');
    fs.writeFileSync(newPath, out, 'utf8');
    console.log(
      'Converted:',
      path.relative(process.cwd(), f),
      '->',
      path.relative(process.cwd(), newPath)
    );
  } catch (err) {
    console.error('Failed to convert', f, err && err.message);
  }
}

console.log('Conversion complete.');
