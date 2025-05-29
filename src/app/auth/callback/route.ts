import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/customer'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get the user after successful verification
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Update user profile with display name from metadata
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            display_name: user.user_metadata?.display_name || user.email?.split('@')[0],
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
        
        if (profileError) {
          console.error('Error creating user profile:', profileError)
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}