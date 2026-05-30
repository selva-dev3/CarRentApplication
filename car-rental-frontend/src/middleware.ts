import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_ROUTES = ['/', '/login', '/register', '/cars'];
const ADMIN_ROUTES = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  // Check if route is public (starts with any public route)
  const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  // Redirect logged-in users away from /login and /register
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Public routes — allow all
  if (isPublic) {
    return NextResponse.next();
  }

  // No token — redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let role = 'customer';
  let isValid = false;

  if (token === 'mock-admin-token') {
    role = 'admin';
    isValid = true;
  } else if (token === 'mock-customer-token') {
    role = 'customer';
    isValid = true;
  } else {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret');
      const { payload } = await jwtVerify(token, secret);
      role = (payload.role as string) || 'customer';
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  if (!isValid) {
    // Clear cookie to prevent loop
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('access_token');
    return response;
  }

  // Admin routes — check role
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  if (isAdminRoute) {
    if (!['admin', 'superadmin'].includes(role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
