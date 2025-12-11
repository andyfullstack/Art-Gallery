#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { transform } = require('sucrase');

if (process.argv.length < 3) {
  console.error(
    'Usage: node tools/sucrase-convert.js <file1.tsx> [file2.tsx] ...'
  );
  process.exit(2);
}

const files = process.argv.slice(2);

for (const f of files) {
  const abs = path.resolve(f);
  if (!fs.existsSync(abs)) {
    console.error('Not found:', f);
    continue;
  }
  const src = fs.readFileSync(abs, 'utf8');
  try {
    const out = transform(src, {
      transforms: ['typescript', 'jsx'],
      filePath: f,
    }).code;
    const newPath = abs.replace(/\.tsx?$/, '.jsx');
    fs.writeFileSync(newPath, out, 'utf8');
    console.log('Converted:', f, '->', path.relative(process.cwd(), newPath));
  } catch (err) {
    console.error('Failed to convert', f, err && err.message);
  }
}
