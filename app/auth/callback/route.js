import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  console.log('Direct callback received:', { code: !!code, searchParams: Object.fromEntries(searchParams) });

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
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

  console.log('No code in direct callback. This means Google OAuth is misconfigured.');
  console.log('Google should redirect to: https://gwqpskwineafhtcusxho.supabase.co/auth/v1/callback');
  console.log('But Google is redirecting to:', request.url);
  
  return NextResponse.redirect(`${origin}/?error=google_oauth_misconfigured`);
}
