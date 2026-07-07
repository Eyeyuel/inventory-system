import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('access_token');
  const refreshToken = request.cookies.get('refresh_token');

  if (!accessToken && !refreshToken) {
    console.log('redirected to login from proxy.');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!$|login|signup|api|_next).*)'],
};

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function proxy(request: NextRequest) {
//   return NextResponse.next(); // CHANGED: allow everything
// }

// export const config = {
//   matcher: ['/((?!$|login|signup|api|_next).*)'],
// };
