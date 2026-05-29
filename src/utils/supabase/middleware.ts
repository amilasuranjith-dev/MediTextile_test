import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let user = null;

  if (isSupabaseConfigured) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh session
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } else {
    // Supabase not configured: Check mock cookie
    const mockAuth = request.cookies.get('meditex-mock-auth')?.value;
    if (mockAuth === 'true') {
      user = { id: 'mock-admin-uuid', email: 'admin@meditex.eu' };
    }
  }

  // Route protection
  const isGoingToAdmin = request.nextUrl.pathname.startsWith('/admin');
  const isGoingToLogin = request.nextUrl.pathname.startsWith('/admin/login');

  if (isGoingToAdmin) {
    if (!user && !isGoingToLogin) {
      // Redirect to login page if unauthorized
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    if (user && isGoingToLogin) {
      // Redirect to dashboard if already logged in
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
