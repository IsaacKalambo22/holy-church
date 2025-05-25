import { NextResponse } from 'next/server';

import { auth } from './auth';

const publicRoutes = [
  '/',
  '/contact-us',
  '/search',
  '/checkout',
  '/about-us',
  '/sermons',
  '/events',
  '/blog',
  '/give',
  '/prayer-requests',
];

export const authRoutes = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
];
export const apiAuthPrefix = '/api/auth';
export const DEFAULT_LOGIN_REDIRECT = '/';

export const userRoutes = '/user';
export const adminRoutes = '/admin';

export const middleware = auth(async (req) => {
  const secretKey = process.env.AUTH_SECRET;

  if (!secretKey) {
    throw new Error('AUTH_SECRET is not defined');
  }

  const token = req.auth;

  const { nextUrl } = req;
  const isLoggedIn = !!token;
  console.log({ isLoggedIn });
  // Route checks
  const isApiAuthRoute =
    nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute =
    authRoutes.includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith(
      '/set-password'
    ) ||
    nextUrl.pathname.startsWith(
      '/reset-password'
    );
  const isAdminRoute =
    nextUrl.pathname.startsWith(adminRoutes);
  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith('/api') ||
    nextUrl.pathname.startsWith('/courses');

  // Skip API auth routes
  if (isApiAuthRoute) return;
  if (isPublicRoute) return;

  // Allow public access to the login page without redirecting if not logged in
  if (isAuthRoute && !isLoggedIn) return;
    return;

  // Redirect logged-in users away from login and register pages
  // if (isAuthRoute && isLoggedIn) {
  //   return NextResponse.redirect(
  //     new URL('/current-dashboard', nextUrl)
  //   );
  // }

  // Redirect logged-in users away from sign-in/up pages
  if (isAuthRoute && isLoggedIn && token) {
    // At this point TypeScript knows token is not null
    const redirectTo =
      token?.role === 'ADMIN' || token?.role === 'MANAGER'
        ? '/admin/dashboard'
        : '/user/dashboard';
    return NextResponse.redirect(
      new URL(redirectTo, nextUrl)
    );
  }

  // Redirect to login if not logged in and accessing a protected route
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(
      new URL('/sign-in', nextUrl)
    );
  }

  // Restrict access to admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL('/sign-in', nextUrl)
      );
    }

    if (
      token?.role !== 'ADMIN' &&
      token?.role !== 'MANAGER'
    ) {
      return NextResponse.redirect(
        new URL('/current-dashboard', nextUrl)
      ); // Prevent non-admin users from accessing
    }

    return;
  }

  // Role-based redirection if logged in and accessing the wrong route
  if (isLoggedIn && token) {
    switch (token?.role) {
      case 'STUDENT':
      case 'USER':
        if (
          !nextUrl.pathname.startsWith('/user')
        ) {
          return NextResponse.redirect(
            new URL('/user/dashboard', nextUrl)
          );
        }
        break;

      case 'ADMIN':
      case 'MANAGER':
        if (
          !nextUrl.pathname.startsWith('/admin')
        ) {
          return NextResponse.redirect(
            new URL('/admin/dashboard', nextUrl)
          );
        }
        break;

      default:
        if (
          nextUrl.pathname !==
          DEFAULT_LOGIN_REDIRECT
        ) {
          return NextResponse.redirect(
            new URL('/', nextUrl)
          );
        }
    }
  }

  // No redirect needed
  return;
});

// Configure the middleware to match specific routes
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
