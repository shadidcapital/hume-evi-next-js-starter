import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock server-only and hume modules before importing the target module
vi.mock('server-only', () => ({}));
vi.mock('hume', () => ({
  fetchAccessToken: vi.fn(),
}));

import { getHumeAccessToken } from '../utils/getHumeAccessToken';

describe('getHumeAccessToken', () => {
  beforeEach(() => {
    // Reset mocks and environment for each test
    // @ts-ignore
    const mod = require('hume');
    mod.fetchAccessToken?.mockReset?.();
    delete process.env.HUME_API_KEY;
    delete process.env.HUME_SECRET_KEY;
  });

  it('returns token when env vars provided and API returns token', async () => {
    process.env.HUME_API_KEY = 'apiKey123';
    process.env.HUME_SECRET_KEY = 'secretKey456';

    // @ts-ignore
    const { fetchAccessToken } = require('hume');
    fetchAccessToken.mockResolvedValue('token-abc');

    const token = await getHumeAccessToken();
    expect(token).toBe('token-abc');
    expect(fetchAccessToken).toHaveBeenCalledWith({ apiKey: 'apiKey123', secretKey: 'secretKey456' });
  });

  it('throws when env vars are missing', async () => {
    await expect(getHumeAccessToken()).rejects.toThrow('Missing required environment variables');
  });

  it('returns null when fetchAccessToken returns undefined', async () => {
    process.env.HUME_API_KEY = 'apiKey';
    process.env.HUME_SECRET_KEY = 'secretKey';

    // @ts-ignore
    const { fetchAccessToken } = require('hume');
    fetchAccessToken.mockResolvedValue(undefined);

    const token = await getHumeAccessToken();
    expect(token).toBeNull();
  });

  it('throws when fetchAccessToken returns the string "undefined"', async () => {
    process.env.HUME_API_KEY = 'apiKey';
    process.env.HUME_SECRET_KEY = 'secretKey';

    // @ts-ignore
    const { fetchAccessToken } = require('hume');
    fetchAccessToken.mockResolvedValue('undefined');

    await expect(getHumeAccessToken()).rejects.toThrow('Unable to get access token');
  });
});