#!/usr/bin/env node
/** Simple codemod to replace HTML <img> tags with LazyImage usage in TSX/JSX files.
 * Usage: node scripts/convert-img-to-lazy.js [targetDir]
 * If no dir is provided, defaults to the repository root (project/sandbox).
 */
const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..');

function walk(dir){
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries){
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/(?:tsx|jsx|ts|js)$/.test(e.name)) processFile(full);
  }
}

function processFile(file){
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('<img')) return; // nothing to do
  let out = content;
  // Ensure import LazyImage exists
  if (!out.includes("import LazyImage from '" ) && !out.includes('import LazyImage from "')) {
    // naive insert after first line
    const lines = out.split(/\r?\n/);
    lines.unshift("import LazyImage from '@/components/ui/LazyImage';");
    out = lines.join('\n');
  }
  // Replace <img ...> with <LazyImage ...>
  // This is a best-effort, simple transformation suitable for straightforward usage
  const imgTagRegex = /<img\s+([^>]*?)src=(['"])([^'"]+)\2([^>]*?)\/?>/g;
  out = out.replace(imgTagRegex, (match, before, q, src, after) => {
    const beforeAttr = before && before.trim() ? ' ' + before.trim() : '';
    const afterAttr = after && after.trim() ? ' ' + after.trim() : '';
    // Build replacement preserving existing attributes, but using LazyImage with same attributes
    // We keep src value literal; if the original used src="..." it's preserved as a string
    return `<LazyImage src=${q}${src}${q}${beforeAttr}${afterAttr} />`;
  });

  if (out !== content) {
    fs.writeFileSync(file, out, 'utf8');
    console.log('Transformed:', file);
  }
}

walk(targetDir);
console.log('done');
