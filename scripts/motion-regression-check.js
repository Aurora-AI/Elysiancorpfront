import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=========================================');
console.log('Running Motion & Animation Safety Gate');
console.log('=========================================');

const activeSubprojects = ['ElysianCorp', 'aurora-web', 'AuroraCognitiveAssets'];
const scanExtensions = ['.tsx', '.ts', '.jsx', '.js', '.astro', '.css'];
const ignorePatterns = [
  'node_modules',
  '.next',
  '.astro',
  'dist',
  'build',
  'scripts'
];

let violationsCount = 0;

function scanDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // Check if path matches ignore patterns
    const shouldIgnore = ignorePatterns.some((pattern) => filePath.includes(pattern));
    if (shouldIgnore) return;
    
    if (stat.isDirectory()) {
      scanDirectory(filePath, fileList);
    } else {
      const ext = path.extname(file);
      if (scanExtensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// Gather all files from active subprojects
const allFiles = [];
activeSubprojects.forEach((proj) => {
  const projPath = path.resolve(__dirname, `../../${proj}`);
  if (fs.existsSync(projPath)) {
    scanDirectory(projPath, allFiles);
  }
});

console.log(`Scanning ${allFiles.length} files for motion regressions...`);

allFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  const relativePath = path.relative(path.resolve(__dirname, '../..'), file);

  // 1. Check for Three.js resource disposal
  if (content.includes('THREE.') && (content.includes('Geometry') || content.includes('Material') || content.includes('Texture'))) {
    if (!content.includes('.dispose()')) {
      console.warn(`\x1b[33m%s\x1b[0m`, `Warning [ThreeJS memory leak risk] in ${relativePath}:`);
      console.warn('  > Found THREE geometries/materials/textures but no call to .dispose() for GPU cleanup.');
      violationsCount++;
    }
  }

  // 2. Check for custom requestAnimationFrame leak
  if (content.includes('requestAnimationFrame')) {
    if (!content.includes('cancelAnimationFrame')) {
      console.error(`\x1b[31m%s\x1b[0m`, `Violation [Missing cancelAnimationFrame] in ${relativePath}:`);
      console.error('  > requestAnimationFrame loop is declared without cancelAnimationFrame in cleanup.');
      violationsCount++;
    }
  }

  // 3. Check for GSAP cleanup (using gsap.to/gsap.from/gsap.timeline but no useGSAP and no cleanup method)
  if (content.includes('gsap') && (content.includes('.to(') || content.includes('.from(') || content.includes('.timeline('))) {
    // React specific check
    const isReact = file.endsWith('.tsx') || file.endsWith('.jsx');
    if (isReact && !content.includes('useGSAP') && !content.includes('.revert()') && !content.includes('.kill()')) {
      console.error(`\x1b[31m%s\x1b[0m`, `Violation [Unclean GSAP lifecycle] in ${relativePath}:`);
      console.error('  > React component uses GSAP but does not clean up via useGSAP or explicitly timeline.revert() / kill().');
      violationsCount++;
    }
  }

  // 4. Check for reduced motion media query presence in files declaring heavy animations (GSAP, CSS transitions, keyframes)
  if (content.includes('@keyframes') || content.includes('transition:') || content.includes('gsap')) {
    const hasReducedMotion = content.includes('prefers-reduced-motion') || content.includes('usePrefersReducedMotion') || content.includes('reducedMotion');
    if (!hasReducedMotion && !file.endsWith('.ts')) {
      console.warn(`\x1b[33m%s\x1b[0m`, `Warning [Missing prefers-reduced-motion fallback] in ${relativePath}:`);
      console.warn('  > File contains animations but no query for prefers-reduced-motion stylesheet/hooks.');
      violationsCount++;
    }
  }
});

console.log('=========================================');
if (violationsCount > 0) {
  console.warn(`Motion Gating Check: PASSED WITH WARNINGS (${violationsCount} potential leaks/omissions found)`);
} else {
  console.log('\x1b[32m%s\x1b[0m', 'Motion Gating Check: PASSED');
}
process.exit(0);
