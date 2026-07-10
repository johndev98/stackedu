import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

export default async function middleware(request: NextRequest) {
  const country = 
    request.headers.get('x-vercel-ip-country') || 
    request.headers.get('cf-ipcountry');
  const isLocalDev = process.env.NODE_ENV === 'development' && !country;
  const isVN = country === 'VN' || isLocalDev;

  const hasCookie = request.cookies.has('NEXT_LOCALE');
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
