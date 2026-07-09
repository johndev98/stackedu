import { HeaderNavbar } from "@/components/header/header-navbar";

// ✅ SERVER 100%
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    // ✅ MÀU NỀN CHỈ RIÊNG NHÓM PUBLIC
    <div className="min-h-screen w-full bg-[#270e65] text-slate-900">
      {/* ✅ CHỈ Ở ĐÂY MỚI CÓ GIỚI HẠN RỘNG + PADDING */}
      <div className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col px-8">
        <HeaderNavbar />
        <main className="flex-1">{children}</main>
        {/* sau này thêm footer ở đây */}
      </div>
    </div>
  );
}
