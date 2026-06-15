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
