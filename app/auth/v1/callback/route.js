import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  console.log('v1 Callback received:', { code: !!code, searchParams: Object.fromEntries(searchParams) });

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Successful authentication - redirect to home
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        console.error('Auth error:', error);
        return NextResponse.redirect(`${origin}/?error=auth_failed&message=${encodeURIComponent(error.message)}`);
      }
    } catch (error) {
      console.error('Callback error:', error);
      return NextResponse.redirect(`${origin}/?error=callback_failed&message=${encodeURIComponent(error.message)}`);
    }
  }

  console.log('No code received in v1 callback. Full URL:', request.url);
  return NextResponse.redirect(`${origin}/?error=no_code&debug=${encodeURIComponent(request.url)}`);
}
