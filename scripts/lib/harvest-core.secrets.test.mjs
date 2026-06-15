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
});
