import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateEnv, assertValidEnv } from '../utils/validateEnv';

describe('validateEnv', () => {
  const original: Record<string, string | undefined> = {};
  const keys = ['DATABASE_URL','API_BASE_URL','PORT','NEXTAUTH_SECRET','JWT_SECRET','SESSION_SECRET','ENABLE_METRICS'];

  beforeEach(() => {
    // Save original values
    keys.forEach((k) => {
      original[k] = process.env[k];
    });
  });

  afterEach(() => {
    // Restore originals
    keys.forEach((k) => {
      if (original[k] === undefined) {
        delete process.env[k];
      } else {
        process.env[k] = original[k] as string;
      }
    });
  });

  it('validates when all required vars are present and well-formed', () => {
    process.env.DATABASE_URL = 'http://localhost:5432/db';
    process.env.API_BASE_URL = 'https://api.example.com';
    process.env.PORT = '3000';
    process.env.NEXTAUTH_SECRET = 'nexthauth';
    process.env.JWT_SECRET = 'jwtsecret';
    process.env.SESSION_SECRET = 'sessionsecret';
    process.env.ENABLE_METRICS = 'true';

    const res = validateEnv();
    expect(res.ok).toBe(true);
  });

  it('fails when a required var is missing', () => {
    process.env.DATABASE_URL = 'http://localhost:5432/db';
    process.env.API_BASE_URL = 'https://api.example.com';
    process.env.PORT = '3000';
    //Omit NEXTAUTH_SECRET to simulate missing required var
    delete process.env.NEXTAUTH_SECRET;
    process.env.JWT_SECRET = 'jwtsecret';
    process.env.SESSION_SECRET = 'sessionsecret';
    delete process.env.ENABLE_METRICS;

    const res = validateEnv();
    expect(res.ok).toBe(false);
    expect(res.missing).toContain('NEXTAUTH_SECRET');
  });

  it('detects invalid URLs and ports', () => {
    process.env.DATABASE_URL = 'not-a-url';
    process.env.API_BASE_URL = 'https://api.example.com';
    process.env.PORT = '99999';
    process.env.NEXTAUTH_SECRET = 'nexthauth';
    process.env.JWT_SECRET = 'jwtsecret';
    process.env.SESSION_SECRET = 'sessionsecret';

    const res = validateEnv();
    expect(res.ok).toBe(false);
    expect(res.invalid).toContain('DATABASE_URL');
    expect(res.invalid).toContain('PORT');
  });

  it('throws for invalid env when asserting', () => {
    process.env.DATABASE_URL = 'not-a-url';
    process.env.API_BASE_URL = 'https://api.example.com';
    process.env.PORT = '3000';
    process.env.NEXTAUTH_SECRET = 'nexthauth';
    process.env.JWT_SECRET = 'jwtsecret';
    process.env.SESSION_SECRET = 'sessionsecret';

    expect(() => assertValidEnv()).toThrow();
  });
});
