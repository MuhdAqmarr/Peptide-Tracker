import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Refreshes the Supabase auth session and copies cookies onto the response.
 * Accepts an existing response (e.g. from next-intl) so both middleware
 * layers share the same response object.
 */
export async function updateSession(
  request: NextRequest,
  response: NextResponse,
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Use getSession() for fast local JWT validation in middleware.
  // This avoids a network round-trip to Supabase on every navigation.
  // Server Components / Route Handlers should still use getUser() for
  // full token verification when performing sensitive operations.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { response, user: session?.user ?? null };
}
