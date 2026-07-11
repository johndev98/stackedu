"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, type Transition } from "framer-motion";
// Import icon cần dùng
import {
  ChevronLeft,
  ChevronRight,
  User,
  LayoutDashboard,
  GraduationCap,
  MessageCircleHeart,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* =========================================================
   ✅ MẢNG MENU DUY NHẤT - SỬA Ở ĐÂY LÀ ĐỦ
   Mỗi item chỉ có 3 trường: href | icon | label
   ========================================================= */
const SIDEBAR_MENU = [
  {
    href: "/learn",
    icon: LayoutDashboard,
    label: "Tổng quan",
  },
  {
    href: "/learn/my-courses",
    icon: GraduationCap,
    label: "Khóa học",
  },
  {
    href: "/learn/community",
    icon: MessageCircleHeart,
    label: "Cộng đồng",
  },
];

/* ---------------- CÁC HẰNG SỐ KHÁC ---------------- */
const SIDEBAR_WIDTH = {
  WIDE: "w-60",
  NARROW: "w-[67px]",
} as const;

const ANIMATION: Record<string, Transition> = {
  layout: { type: "spring", bounce: 0.2, duration: 0.4 },
  fade: { type: "tween", duration: 0.15, ease: "easeOut" },
};

/* ---------------- HÀM KIỂM TRA ROUTE ACTIVE ---------------- */
function isActive(pathname: string, href: string) {
  if (href === "/learn") return pathname === "/learn";
  return pathname === href || pathname.startsWith(href + "/");
}

/* ---------------- COMPONENT CHÍNH ---------------- */
export function LearnSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative z-20 flex h-full shrink-0 flex-col justify-between bg-[#121212] text-slate-200 transition-[width] duration-300 ease-in-out rounded-bl-2xl rounded-tl-2xl",
        isCollapsed ? SIDEBAR_WIDTH.NARROW : SIDEBAR_WIDTH.WIDE,
      )}
    >
      {/* PHẦN TRÊN: LOGO + MENU */}
      <div>
        {/* Logo + nút thu gọn */}
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            <motion.span
              animate={{
                opacity: isCollapsed ? 0 : 1,
                width: isCollapsed ? 0 : "auto",
              }}
              transition={ANIMATION.fade}
              className="whitespace-nowrap text-sm font-semibold text-white overflow-hidden"
            >
              StackEdu
            </motion.span>
          </Link>

          <button
            onClick={() => setIsCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
            className="grid h-8 w-8 place-items-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <motion.div
              key={String(isCollapsed)}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {isCollapsed ? (
                <ChevronRight size={25} />
              ) : (
                <ChevronLeft size={25} />
              )}
            </motion.div>
          </button>
        </div>

        {/* ✅ DANH SÁCH MENU - CHỈ CẦN .MAP() 1 LẦN */}
        <nav className="mt-2 space-y-1 px-3">
          {SIDEBAR_MENU.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href} // dùng href làm key (duy nhất)
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "group relative my-1 flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                  active
                    ? "text-[#1A1206]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                )}
              >
                {/* Nền vàng active di chuyển mượt */}
                {active && (
                  <motion.div
                    layoutId="learn-active"
                    className="absolute inset-0 rounded-lg bg-[#D9A956] shadow-[0_4px_14px_-4px_rgba(217,169,86,0.6)]"
                    transition={ANIMATION.layout}
                  />
                )}

                {/* Icon + Label */}
                <span className="relative z-10 shrink-0">
                  <Icon size={19} strokeWidth={2.1} />
                </span>
                <motion.span
                  animate={{
                    opacity: isCollapsed ? 0 : 1,
                    width: isCollapsed ? 0 : "auto",
                  }}
                  transition={ANIMATION.fade}
                  className="relative z-10 whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* PHẦN DƯỚI: USER */}
      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#D9A956] text-sm font-bold text-[#1A1206]">
            <User size={16} />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Elizabeth
              </p>
              <p className="truncate text-[11px] text-emerald-400">
                ● Đang hoạt động
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
