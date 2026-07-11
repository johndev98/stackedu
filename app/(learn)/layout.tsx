'use client'; // ✅ NESTED LAYOUT → AN TOÀN, KHÔNG ẢNH HƯỞNG SEO

import { LearnSidebar } from '@/components/learn/learn-sidebar';
import { LearnTopNav } from '@/components/learn/learn-top-nav';
import { useMediaQuery } from '@/hooks/use-media-query';

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ============== DETECT 3 BREAKPOINT ============== */
  // 📱 < 768px = Mobile
  const isMobile = useMediaQuery('(max-width: 767px)');
  // 📟 768 → 1023px = iPad / Tablet
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  // 💻 ≥ 1024px = Desktop

  return (
    <div className="h-screen w-full overflow-hidden bg-[#D9A956] p-0 md:p-3 text-slate-900">
      <div className="flex h-full w-full max-w-screen-2xl mx-auto overflow-hidden md:rounded-3xl bg-[#121212] flex-col md:flex-row">
        {/* ✅ MOBILE: Topbar + Drawer */}
        {isMobile && <LearnTopNav />}

        {/* ✅ TABLET + DESKTOP: Sidebar bình thường */}
        {!isMobile && (
          <LearnSidebar
            // 📟 iPad → TỰ ĐỘNG THU GỌN, 💻 Desktop → bình thường
            forceCollapsed={isTablet}
          />
        )}

        {/* ✅ NỘI DUNG CHÍNH */}
        <main
          className={
            isMobile
              ? 'flex-1 overflow-y-auto overflow-x-hidden bg-white'
              : 'my-3 mr-3 flex-1 overflow-y-auto overflow-x-hidden rounded-3xl bg-white'
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
