import { LearnSidebar } from "@/components/learn/learn-sidebar";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ✅ Toàn bộ cao bằng cửa sổ, KHÔNG BAO GIỜ VỠ GIAO DIỆN
    <div className="flex h-screen w-full overflow-hidden  text-slate-900 py-2">
      {/* ✅ Sidebar = client con → hợp lệ Next.js, cha vẫn server */}
      <div className="flex w-full bg-[#121212] rounded-2xl">
        <LearnSidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden my-3 mr-3 bg-white rounded-2xl">
          {children}
        </main>
      </div>
    </div>
  );
}
