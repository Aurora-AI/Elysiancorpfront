import { writeFileSync, copyFileSync, readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import {
  resolveSource, gitProvenance, sha256, extractExcerpt, sanitize, scanSecrets,
} from './lib/harvest-core.mjs';

/**
 * Orchestration; throws on any violation (fail-closed).
 *
 * Two-phase design:
 *  Phase 1 — validate + prepare all claims (throw on any violation, no I/O)
 *  Phase 2 — write all outputs atomically (only reached if Phase 1 fully passes)
 */
export function runHarvest({ repoRoot, siteRoot, claims }) {
  // Ensure output directories exist (idempotent)
  mkdirSync(path.join(siteRoot, 'public', 'evidence'), { recursive: true });
  mkdirSync(path.join(siteRoot, 'src', 'data'), { recursive: true });

  // ── Phase 1: validate + prepare (no disk writes) ──────────────────────────
  const prepared = [];
  for (const claim of claims) {
    const { abs, isDir, kind } = resolveSource(repoRoot, claim.source);

    if (kind === 'image') {
      const assetName = `${claim.id}${path.extname(abs)}`;
      prepared.push({ claim, abs, kind, assetName, assetBody: null });
    } else {
      const raw = isDir ? `// directory: ${claim.source.path}` : readFileSync(abs, 'utf8');
      const excerpt = extractExcerpt(raw, claim.source.lines);
      // Scan only the excerpt that ships — guards what's published without
      // false-positives from surrounding security-related code in large files.
      const secrets = scanSecrets(excerpt);
      if (secrets.length) {
        throw new Error(`SECRET_DETECTED in ${claim.source.path}: ${secrets.map(s => s.name).join(',')}`);
      }
      const assetBody = sanitize(excerpt);
      const assetName = `${claim.id}.txt`;
      prepared.push({ claim, abs, kind, assetName, assetBody });
    }
  }

  // ── Phase 2: write all outputs (only reached if all claims passed) ─────────
  const provenance = {};
  for (const { claim, abs, kind, assetName, assetBody } of prepared) {
    if (kind === 'image') {
      copyFileSync(abs, path.join(siteRoot, 'public', 'evidence', assetName));
    } else {
      writeFileSync(path.join(siteRoot, 'public', 'evidence', assetName), assetBody, 'utf8');
    }

    const { commit, timestamp } = gitProvenance(repoRoot, claim.source.path);
    provenance[claim.id] = {
      sourcePath: claim.source.path,
      sha256: sha256(assetBody ?? readFileSync(abs)),
      commit, timestamp,
      asset: `/evidence/${assetName}`,
      kind,
    };
  }

  writeFileSync(
    path.join(siteRoot, 'src', 'data', 'evidence.provenance.json'),
    JSON.stringify(provenance, null, 2) + '\n', 'utf8',
  );
  return { ok: true, count: Object.keys(provenance).length };
}

// CLI entry — guard is cross-platform safe (handles Windows backslash paths)
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const siteRoot = process.cwd();
  const repoRoot = path.resolve(siteRoot, process.env.AURORA_REPO_ROOT ?? '../../Aurora');
  const evidencePath = pathToFileURL(path.join(siteRoot, 'src', 'data', 'evidence.ts')).href;
  const { CLAIMS } = await import(evidencePath);
  try {
    const res = runHarvest({ repoRoot, siteRoot, claims: CLAIMS });
    console.log(`✓ harvested ${res.count} evidence artifacts`);
  } catch (err) {
    console.error(`✗ harvest failed (fail-closed): ${err.message}`);
    process.exit(1);
  }
}
