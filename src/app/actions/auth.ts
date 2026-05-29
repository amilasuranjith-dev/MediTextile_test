"use server";

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const cookieStore = await cookies();

  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    // Simulated credentials validation
    if (email === 'admin@meditex.eu' && password === 'admin123') {
      cookieStore.set('meditex-mock-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 1 day
      });
      return { success: true, simulated: true };
    }
    return { success: false, error: "Invalid credentials. (For local preview use: admin@meditex.eu / admin123)" };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected authentication error occurred" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch (_) {}
  }

  // Clear mock cookie
  cookieStore.delete('meditex-mock-auth');
  redirect('/admin/login');
}
