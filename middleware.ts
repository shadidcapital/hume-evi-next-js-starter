import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { assertValidEnv } from './utils/validateEnv';

export function middleware(_req: NextRequest) {
  try {
    // Validate environment variables on server startup/request to fail fast if misconfigured
    assertValidEnv();
  } catch (e: any) {
    return new Response(`Environment validation failed: ${e.message}`, { status: 500 });
  }
  return NextResponse.next();
}

export const config = {
  // Apply to all routes; adjust if you want to limit to specific paths
  matcher: '/:path*',
};
