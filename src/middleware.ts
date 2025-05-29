import updateSession  from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const { user, response, supabase } = await updateSession(request)

    // Allow public routes
    const publicUrls = ['/', '/auth/login', '/auth/register', '/auth/reset-password']
    if (publicUrls.includes(request.nextUrl.pathname)) {
      return response
    }

    // If no user and not on auth routes, redirect to login
    if (
      !user &&
      !request.nextUrl.pathname.startsWith('/auth')
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }

    // If user exists, check their role for protected routes
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      // Check if accessing admin routes
      if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!profile || profile.role !== 'admin') {
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      }

      // Check if accessing customer routes
      if (request.nextUrl.pathname.startsWith('/customer')) {
        if (!profile || profile.role !== 'customer') {
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      }
    }

    return response
  } catch {
    // If there's any error, redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}