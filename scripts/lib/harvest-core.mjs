import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, statSync, readFileSync } from 'node:fs';
import path from 'node:path';

export function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

export function classifyKind(p) {
  const ext = path.extname(p).toLowerCase();
  if (ext === '.md') return 'report';
  if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) return 'image';
  return 'code';
}

/** Resolve a claim source against the Aurora repo root. Throws if missing. */
export function resolveSource(repoRoot, source) {
  const abs = path.resolve(repoRoot, source.path);
  if (!existsSync(abs)) {
    throw new Error(`MISSING_SOURCE: ${source.path} (resolved ${abs})`);
  }
  const isDir = statSync(abs).isDirectory();
  return { abs, isDir, kind: isDir ? 'code' : classifyKind(source.path) };
}

/** Last commit short SHA + ISO date for a path (git). Falls back gracefully. */
export function gitProvenance(repoRoot, relPath) {
  try {
    const out = execFileSync(
      'git', ['-C', repoRoot, 'log', '-1', '--format=%h|%cI', '--', relPath],
      { encoding: 'utf8' },
    ).trim();
    const [commit, timestamp] = out.split('|');
    if (!commit) throw new Error('no commit');
    return { commit, timestamp };
  } catch {
    return { commit: 'UNTRACKED', timestamp: new Date(statSync(path.resolve(repoRoot, relPath)).mtime).toISOString() };
  }
}

export { readFileSync };

const SECRET_PATTERNS = [
  { name: 'aws-access-key', re: /AKIA[0-9A-Z]{16}/ },
  { name: 'private-key-header', re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/ },
  { name: 'bearer-token', re: /Bearer\s+[A-Za-z0-9._-]{24,}/ },
  { name: 'generic-assigned-secret', re: /(?:api[_-]?key|secret|token|password)\s*[:=]\s*['"][A-Za-z0-9/+_-]{16,}['"]/i },
  { name: 'long-hex', re: /\b[0-9a-f]{40,}\b/i },
];

export function scanSecrets(text) {
  const hits = [];
  for (const { name, re } of SECRET_PATTERNS) {
    const m = text.match(re);
    if (m) hits.push({ name, match: m[0].slice(0, 12) + '…' });
  }
  return hits;
}
