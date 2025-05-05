import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import createIntlMiddleware from 'next-intl/middleware';

// Lista de rute protejate
const protectedRoutes = [
  '/api/user',
  '/api/settings',
  '/api/profile'
];

// Lista de rute publice
const publicRoutes = [
  '/api/login',
  '/api/register',
  '/api/newsletter',
  '/api/reset-password'
];

// Middleware pentru internaționalizare
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'ro'],
  defaultLocale: 'en'
});

// Funcție pentru obținerea mesajelor de eroare traduse
function getErrorMessage(locale: string, error: string): string {
  const messages = {
    unauthorized: {
      en: 'Unauthorized access',
      ro: 'Acces neautorizat'
    },
    invalidToken: {
      en: 'Invalid authentication token',
      ro: 'Token de autentificare invalid'
    }
  };
  
  return messages[error as keyof typeof messages][locale as keyof typeof messages[keyof typeof messages]] || messages[error as keyof typeof messages]['en'];
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = request.headers.get('accept-language')?.split(',')[0].split('-')[0] || 'en';

  // Verifică dacă este o rută API
  if (pathname.startsWith('/api')) {
    // Verifică dacă este o rută publică
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Verifică dacă este o rută protejată
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      const token = request.headers.get('Authorization')?.split(' ')[1];

      if (!token) {
        return NextResponse.json(
          { message: getErrorMessage(locale, 'unauthorized') },
          { status: 401 }
        );
      }

      try {
        // Verifică token-ul
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        return NextResponse.next();
      } catch (error) {
        return NextResponse.json(
          { message: getErrorMessage(locale, 'invalidToken') },
          { status: 401 }
        );
      }
    }
  }

  // Aplică middleware-ul de internaționalizare pentru rutele non-API
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)', '/api/:path*']
}; 