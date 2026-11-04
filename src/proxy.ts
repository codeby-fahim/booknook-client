import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

// Runs before protected pages render. Guests are sent to the sign-in page and
// brought back to the page they originally requested after logging in.
export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session?.user) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set(
      'callbackUrl',
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    )

    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Home, All Books and the book details page stay public. Only the pages that
  // require an account are matched here.
  matcher: [
    '/add-books',
    '/add-books/:path*',
    '/my-books',
    '/my-books/:path*',
    '/my-borrows',
    '/my-borrows/:path*',
    '/my-profile',
    '/my-profile/:path*',
  ],
}
