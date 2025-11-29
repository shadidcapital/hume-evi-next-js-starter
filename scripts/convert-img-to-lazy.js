import LazyImage from '@/components/ui/LazyImage';
#!/usr/bin/env node
/** Improved codemod to replace HTML <img> tags with LazyImage usage in TSX/JSX files.
 * Handles static and simple dynamic cases. For complex dynamic src usage, manual review may be required.
 * Usage: node scripts/convert-img-to-lazy.js [targetDir] [--dry-run]
 * If no dir is provided, defaults to /project/sandbox.
 * If --dry-run is provided, changes are printed but not written.
 */
const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..');
const dryRun = process.argv.includes('--dry-run');

function ensureImportLazyImage(content) {
  const importRegex = /^import\s+LazyImage\s+from\s+['"][^'"]+['"];?/m;
  if (importRegex.test(content)) return content;
  // Insert after the first line (or after existing imports block)
  const lines = content.split(/\r?\n/);
  // Find last import line to better place the new import
  let insertIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/^import\b/.test(lines[i].trim())) insertIndex = i + 1;
  }
  lines.splice(insertIndex, 0, "import LazyImage from '@/components/ui/LazyImage';");
  return lines.join('\n');
}

function transformContent(content) {
  let out = content;
  // Ensure closing tag </LazyImage> becomes </LazyImage>
  out = out.replace(/<\/img\s*>/g, '</LazyImage>');
  // Replace opening <LazyImage ... /> (self-closing)
  out = out.replace(/<img(\s[^>]*?)\/\>/g, '<LazyImage$1/>');
  // Replace opening <LazyImage ...> (non-self-closing)
  out = out.replace(/<img(\s[^>]*?)>/g, '<LazyImage$1>');
  // If there was a closing tag handled above, ensure proper closing of LazyImage if any remnant
  // Import insertion will be handled outside
  return out;
}

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
  if (!content.includes('<img')) return;
  let out = content;
  // Ensure import LazyImage exists
  out = ensureImportLazyImage(out);
  // Perform transformations
  out = transformContent(out);

  if (out !== content) {
    if (!dryRun) {
      fs.writeFileSync(file, out, 'utf8');
      console.log('Transformed:', file);
    } else {
      console.log('[DRY-RUN] Would transform:', file);
    }
  }
}

walk(targetDir);
console.log('done');
