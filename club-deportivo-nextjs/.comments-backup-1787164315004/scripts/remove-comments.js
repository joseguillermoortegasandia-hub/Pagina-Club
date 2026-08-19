const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', '.next', 'out', 'dist']);
const BACKUP_DIR = path.join(ROOT, `.comments-backup-${Date.now()}`);

function isBinary(filename) {
  const binExt = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.wasm', '.ico', '.svg', '.mp4'];
  return binExt.includes(path.extname(filename).toLowerCase());
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function backupFile(filePath) {
  const rel = path.relative(ROOT, filePath);
  const dest = path.join(BACKUP_DIR, rel);
  ensureDir(path.dirname(dest));
  fs.copyFileSync(filePath, dest);
}

function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (isBinary(filePath)) return false;
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  if (['.ts', '.tsx', '.js', '.jsx', '.mjs', '.mts', '.cjs', '.cts'].includes(ext)) {
    // Remove JSX comments like {/* comment */}
    content = content.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');
    // Remove block comments
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove // line comments that start at line or after whitespace
    content = content.replace(/(^|\s)\/\/.*$/gm, (m, p1) => (p1 || ''));
  } else if (['.css', '.scss', '.sass', '.less'].includes(ext)) {
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  } else if (['.html', '.htm'].includes(ext)) {
    content = content.replace(/<!--([\s\S]*?)-->/g, '');
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  } else if (['.sql'].includes(ext)) {
    content = content.replace(/--.*$/gm, '');
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  } else if (['.env', '.local', '.ini', '.toml', '.cfg', '.conf', '.txt'].includes(ext) || path.basename(filePath).startsWith('.env')) {
    content = content.split(/\r?\n/).filter(line => !/^\s*#/.test(line)).join('\n');
  } else if (['.md'].includes(ext)) {
    // remove HTML-style comments in markdown
    content = content.replace(/<!--([\s\S]*?)-->/g, '');
  } else {
    // generic: remove block and line comments cautiously
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    content = content.replace(/(^|\s)\/\/.*$/gm, (m, p1) => (p1 || ''));
  }

  if (content !== original) {
    backupFile(filePath);
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function walk(dir) {
  let changed = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      changed += walk(full);
    } else if (e.isFile()) {
      // process source files only
      const ex = path.extname(e.name).toLowerCase();
      const allowedExts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.mts', '.css', '.scss', '.sass', '.less', '.html', '.htm', '.sql', '.env', '.env.local', '.md', '.txt', '.json', '.sql'];
      if (allowedExts.includes(ex) || e.name.startsWith('.env')) {
        try {
          if (processFile(full)) changed++;
        } catch (err) {
          console.error('Error processing', full, err.message);
        }
      }
    }
  }
  return changed;
}

function main() {
  ensureDir(BACKUP_DIR);
  console.log('Backup directory:', BACKUP_DIR);
  const count = walk(ROOT);
  console.log('Files changed:', count);
}

main();
