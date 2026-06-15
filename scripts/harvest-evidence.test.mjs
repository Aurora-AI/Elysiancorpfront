import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runHarvest } from './harvest-evidence.mjs';

let repo, out;
beforeAll(() => {
  repo = mkdtempSync(path.join(tmpdir(), 'aurora-'));
  mkdirSync(path.join(repo, 'pkg'), { recursive: true });
  writeFileSync(path.join(repo, 'pkg', 'gate.py'), 'def gate():\n    return True\n');
  out = mkdtempSync(path.join(tmpdir(), 'site-'));
  mkdirSync(path.join(out, 'public', 'evidence'), { recursive: true });
  mkdirSync(path.join(out, 'src', 'data'), { recursive: true });
});
afterAll(() => { rmSync(repo, { recursive: true, force: true }); rmSync(out, { recursive: true, force: true }); });

const claims = [{ id: 'c1', source: { path: 'pkg/gate.py', label: 'gate' } }];

describe('runHarvest', () => {
  it('emits asset + provenance for a valid claim', () => {
    const res = runHarvest({ repoRoot: repo, siteRoot: out, claims });
    expect(res.ok).toBe(true);
    expect(existsSync(path.join(out, 'public', 'evidence', 'c1.txt'))).toBe(true);
    const prov = JSON.parse(readFileSync(path.join(out, 'src', 'data', 'evidence.provenance.json'), 'utf8'));
    expect(prov.c1.sourcePath).toBe('pkg/gate.py');
    expect(prov.c1.sha256).toHaveLength(64);
  });
  it('FAILS CLOSED when a source is missing', () => {
    const bad = [{ id: 'x', source: { path: 'pkg/nope.py', label: 'n' } }];
    expect(() => runHarvest({ repoRoot: repo, siteRoot: out, claims: bad })).toThrow(/MISSING_SOURCE/);
  });
  it('FAILS CLOSED when a secret is present', () => {
    writeFileSync(path.join(repo, 'pkg', 'leak.py'), 'KEY=AKIAIOSFODNN7EXAMPLE\n');
    const leak = [{ id: 'l', source: { path: 'pkg/leak.py', label: 'l' } }];
    expect(() => runHarvest({ repoRoot: repo, siteRoot: out, claims: leak })).toThrow(/SECRET_DETECTED/);
  });
});
