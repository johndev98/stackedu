import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

export default async function middleware(request: NextRequest) {
  // Extract country from Vercel or Cloudflare headers
  const country = 
    request.headers.get('x-vercel-ip-country') || 
    request.headers.get('cf-ipcountry');

  // When testing on localhost (development), IP headers are missing (country is null).
  // We mock it to 'VN' here so you can test the behavior locally in a private tab.
  const isLocalDev = process.env.NODE_ENV === 'development' && !country;
  const isVN = country === 'VN' || isLocalDev;

  const hasCookie = request.cookies.has('NEXT_LOCALE');

  // If the user is in Vietnam and hasn't explicitly chosen a language yet (no cookie),
  // we disable browser language detection to forcefully default to 'vi'.
  // Otherwise, we respect the cookie or the browser's default language.
  const handleI18nRouting = createMiddleware({
    ...routing,
    localeDetection: hasCookie ? true : !isVN,
    defaultLocale: (!hasCookie && isVN) ? 'vi' : routing.defaultLocale
  });

  return handleI18nRouting(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(vi|en)/:path*']
};
