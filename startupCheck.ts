import { assertValidEnv } from './utils/validateEnv';

// Optional: Trial ID for Vault population (adjust as needed per environment)
const TRIAL_ID = '786ed938-a2c5-4273-a887-aec6cf2b6b48';

async function populateEnvFromVault(trialId: string): Promise<void> {
  try {
    // Attempt to fetch secrets from Vault if configured
    const vaultUrl = process.env.VAULT_URL;
    const vaultToken = process.env.VAULT_TOKEN;
    if (!vaultUrl || !vaultToken) {
      // Vault not configured; skip without failing startup
      return;
    }
    // Use a KV v2 path pattern by design; adapt as needed
    const url = `${vaultUrl.replace(/\/$/, '')}/v1/secret/projects/${trialId}/env`;
    const resp = await fetch(url, {
      headers: {
        'X-Vault-Token': vaultToken,
        'Content-Type': 'application/json',
      },
    });
    if (!resp.ok) {
      // Non-fatal: vault not accessible or secret not present
      return;
    }
    const data = await resp.json();
    // Normalize possible shapes: data.data, data, payload, etc.
    const secret = (data && data.data && data.data.data) || data?.data || data?.payload || data;
    if (!secret || typeof secret !== 'object') return;
    const lines = Object.entries(secret)
      .filter(([_k, v]) => v != null)
      .map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`);
    if (lines.length === 0) return;
    const content = lines.join('\n');
    // Write env file using Node fs to ensure content persists across requests during startup
    const fs = await import('fs');
    fs.writeFileSync('/project/sandbox/.env', content);
    console.info('Populated /project/sandbox/.env from Vault secrets');
  } catch (err) {
    // Do not fail startup if Vault access fails; log and continue
    console.debug('Vault env population skipped or failed:', err);
  }
}

(async () => {
  // Run once on startup to preload env vars from Vault if available
  await populateEnvFromVault(TRIAL_ID);
  // Validate environment after potential vault population
  try {
    assertValidEnv();
  } catch (e: any) {
    console.error('Startup env validation failed:', e?.message ?? e);
    process.exit(1);
  }
})();
