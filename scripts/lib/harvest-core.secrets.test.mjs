import { describe, it, expect } from 'vitest';
import { scanSecrets } from './harvest-core.mjs';

describe('scanSecrets', () => {
  it('passes clean text', () => {
    expect(scanSecrets('def gate(): return True')).toEqual([]);
  });
  it('flags an AWS-style key', () => {
    expect(scanSecrets('key=AKIAIOSFODNN7EXAMPLE').length).toBeGreaterThan(0);
  });
  it('flags a private key header', () => {
    expect(scanSecrets('-----BEGIN RSA PRIVATE KEY-----').length).toBeGreaterThan(0);
  });
  it('flags long hex secrets and bearer tokens', () => {
    expect(scanSecrets('Authorization: Bearer abcdefghijklmnopqrstuvwxyz0123').length).toBeGreaterThan(0);
  });
  it('does NOT flag the literal placeholder label SECRET_KEY in a comment', () => {
    expect(scanSecrets('# set SECRET_KEY via env')).toEqual([]);
  });

  it('flags a JSON-style quoted key', () => {
    expect(scanSecrets('"api_key": "abcdefghijklmnop"').length).toBeGreaterThan(0);
  });
  it('flags compound SCREAMING_SNAKE secret names', () => {
    expect(scanSecrets('SECRET_KEY="abcdefghijklmnop"').length).toBeGreaterThan(0);
    expect(scanSecrets('DATABASE_PASSWORD="abcdefghijklmnop"').length).toBeGreaterThan(0);
    expect(scanSecrets('AUTH_TOKEN="abcdefghijklmnop"').length).toBeGreaterThan(0);
  });
  it('flags quoted secret values containing special chars', () => {
    expect(scanSecrets('password: "P@ssw0rd!IsHere1234"').length).toBeGreaterThan(0);
  });
  it('reports every occurrence (global), not just the first', () => {
    expect(scanSecrets('a AKIAIOSFODNN7EXAMPLE b AKIAIOSFODNN7EXAMPLE').length).toBe(2);
  });
  it('still passes clean real-world code (no false positives)', () => {
    expect(scanSecrets('const token = generateToken();')).toEqual([]);
    expect(scanSecrets('self.access_token: str = resolve()')).toEqual([]);
    expect(scanSecrets('# set SECRET_KEY via env')).toEqual([]);
    expect(scanSecrets('def gate(): return True')).toEqual([]);
  });
});
