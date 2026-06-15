import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '..', 'src');

const BANNED_PATTERNS = [
  {
    name: 'Generic CTA Text',
    regex: /\b(saiba mais|começar|clique aqui|learn more|get started|click here)\b/i,
    severity: 'error',
    description: 'Use descriptive, value-driven CTAs instead of generic phrases.'
  },
  {
    name: 'SaaS Purple/Blue Gradient Pattern',
    regex: /(from-purple-[0-9]{2,3}\s+to-blue-[0-9]{2,3}|from-indigo-[0-9]{2,3}\s+to-cyan-[0-9]{2,3}|purple-to-blue|indigo-to-cyan)/i,
    severity: 'warning',
    description: 'Avoid generic SaaS purple/blue/cyan gradients without brand justification.'
  },
  {
    name: 'Generic Glassmorphism Overlay',
    regex: /(backdrop-blur|backdrop-filter.*blur)/i,
    severity: 'warning',
    description: 'Decorative glassmorphism without physical context or validation should be avoided.'
  },
  {
    name: 'Lucide Icon import without custom wrappers',
    regex: /import\s+.*from\s+['"]lucide-react['"]/i,
    severity: 'warning',
    description: 'Avoid using Lucide icons directly as visual identity. Wrap or customize them.'
  }
];

function scanDirectory(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.astro' && file !== 'dist') {
        scanDirectory(filePath, fileList);
      }
    } else {
      const ext = path.extname(filePath);
      if (['.astro', '.tsx', '.jsx', '.html', '.css', '.js'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  return fileList;
}

console.log('=========================================');
console.log('Running Anti-Generic / Anti-AI Linter');
console.log(`Scan Target: ${SRC_DIR}`);
console.log('=========================================');

const files = scanDirectory(SRC_DIR);
let errorsCount = 0;
let warningsCount = 0;

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  const relativePath = path.relative(path.join(__dirname, '..'), file);

  BANNED_PATTERNS.forEach((pattern) => {
    lines.forEach((line, index) => {
      if (pattern.regex.test(line)) {
        const lineNumber = index + 1;
        const coloredType = pattern.severity === 'error' ? '\x1b[31m[ERROR]\x1b[0m' : '\x1b[33m[WARNING]\x1b[0m';
        
        console.log(`${coloredType} ${relativePath}:${lineNumber}`);
        console.log(`  > Code: "${line.trim()}"`);
        console.log(`  > Rule: ${pattern.name} - ${pattern.description}`);
        console.log('');

        if (pattern.severity === 'error') {
          errorsCount++;
        } else {
          warningsCount++;
        }
      }
    });
  });
});

console.log('=========================================');
console.log(`Scan complete: found ${errorsCount} error(s) and ${warningsCount} warning(s).`);
console.log('=========================================');

if (errorsCount > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'Anti-Generic Gate: FAILED');
  process.exit(1);
} else {
  console.log('\x1b[32m%s\x1b[0m', 'Anti-Generic Gate: PASSED');
  process.exit(0);
}
