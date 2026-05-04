import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    'https://fowtelstkvcokatlrybk.supabase.co',
    'sb_publishable_PzcO4nu3-VHL8TdF5_ErWg_SP9sH2UF',
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isRoot = request.nextUrl.pathname === '/'

  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/today', request.url))
  }
  if (user && isRoot) {
    return NextResponse.redirect(new URL('/today', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp|json|js|txt)$).*)'],
}
