export type VarFormat = 'string' | 'url' | 'number' | 'bool' | 'port';

export interface EnvVarSpec {
  name: string;
  format?: VarFormat;
  required?: boolean;
}

// Define required environment variables and their expected formats
export const REQUIRED_VARS: EnvVarSpec[] = [
  { name: 'DATABASE_URL', format: 'url', required: true },
  { name: 'API_BASE_URL', format: 'url', required: true },
  { name: 'PORT', format: 'port', required: true },
  { name: 'NEXTAUTH_SECRET', format: 'string', required: true },
  { name: 'JWT_SECRET', format: 'string', required: true },
  { name: 'SESSION_SECRET', format: 'string', required: true },
  // Optional flags
  { name: 'ENABLE_METRICS', format: 'bool', required: false },
];

function isValidUrl(value: string): boolean {
  try {
    // URL constructor validates well-formed URLs
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isValidPort(value: string): boolean {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 && n <= 65535;
}

function normalizeBool(value: string): boolean {
  const v = value.toLowerCase();
  return v === 'true' || v === '1' || v === 'yes' || v === 'on';
}

export function validateVar(value: string, format?: VarFormat): boolean {
  if (value == null) return false;
  const trimmed = value.toString().trim();
  if (trimmed.length === 0) return false;
  switch (format) {
    case 'url':
      return isValidUrl(trimmed);
    case 'number':
      return !Number.isNaN(Number(trimmed));
    case 'port':
      return isValidPort(trimmed);
    case 'bool':
      return ['true', 'false', '1', '0', 'yes', 'no'].includes(trimmed.toLowerCase());
    case 'string':
    default:
      return trimmed.length > 0;
  }
}

export function validateEnv(): { ok: boolean; missing: string[]; invalid: string[] } {
  const missing: string[] = [];
  const invalid: string[] = [];
  for (const v of REQUIRED_VARS) {
    const value = (process.env as any)[v.name];
    if (value == null || value.toString().trim() === '') {
      missing.push(v.name);
      continue;
    }
    const fmt = v.format ?? 'string';
    if (!validateVar(value.toString(), fmt)) {
      invalid.push(v.name);
    }
  }
  const ok = missing.length === 0 && invalid.length === 0;
  return { ok, missing, invalid };
}

export function assertValidEnv(): void {
  const res = validateEnv();
  if (!res.ok) {
    const parts: string[] = [];
    if (res.missing.length) parts.push(`Missing: ${res.missing.join(', ')}`);
    if (res.invalid.length) parts.push(`Invalid: ${res.invalid.join(', ')}`);
    throw new Error(parts.join(' | '));
  }
}
