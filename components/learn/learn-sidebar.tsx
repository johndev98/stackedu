"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Moon, Sun, User } from "lucide-react";
import { LEARN_MENU } from "@/constants/learn-navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const SIDEBAR_WIDE = "w-60"; // mở đầy
const SIDEBAR_NARROW = "w-[72px]"; // chỉ icon

export function LearnSidebar() {
  const t = useTranslations("learn.sidebar");
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false); // ✅ THU GỌN

  return (
    <aside
      className={cn(
        "relative z-20 flex h-full shrink-0 flex-col justify-between bg-[#121212] text-slate-200 transition-all duration-300 ease-in-out rounded-bl-2xl rounded-tl-2xl",
        collapsed ? SIDEBAR_NARROW : SIDEBAR_WIDE,
      )}
    >
      {/* ============== TOP: LOGO + NÚT THU GỌN ============== */}
      <div>
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            <span
              className={cn(
                "whitespace-nowrap text-sm font-semibold text-white transition-opacity duration-200",
                collapsed && "opacity-0 w-0",
              )}
            >
              StackEdu
            </span>
          </Link>

          {/* ✅ NÚT MỞ / THU GỌN */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
            className="grid h-8 w-8 place-items-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* ============== MENU ============== */}
        <nav className="mt-2 space-y-1 px-3">
          {LEARN_MENU.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/learn"
                ? pathname === "/learn"
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "group relative my-1 flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                  isActive
                    ? "text-[#1A1206]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                )}
                title={collapsed ? t(item.key) : undefined}
              >
                {/* ✅ HIỆU ỨNG NỀN TRƯỢT GIỐNG HEADER CỦA BẠN */}
                {isActive && (
                  <motion.div
                    layoutId="learn-active"
                    className="absolute inset-0 rounded-lg bg-[#D9A956] shadow-[0_4px_14px_-4px_rgba(217,169,86,0.6)]"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                  />
                )}

                {/* ✅ ICON LUÔN HIỆN */}
                <span className="relative z-10 shrink-0">
                  <Icon size={19} strokeWidth={2.1} />
                </span>

                {/* ✅ CHỮ: THU GỌN = ẤN ĐI */}
                <span
                  className={cn(
                    "relative z-10 whitespace-nowrap transition-all duration-200",
                    collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100",
                  )}
                >
                  {t(item.key)}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ============== DƯỚI: USER + LIGHT/DARK ============== */}
      <div className="border-t border-white/5 p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-2",
            collapsed && "justify-center",
          )}
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#D9A956] text-sm font-bold text-[#1A1206]">
            <User size={16} />
          </div>

          <div
            className={cn(
              "min-w-0 transition-opacity",
              collapsed && "hidden opacity-0",
            )}
          >
            <p className="truncate text-sm font-semibold text-white">
              Elizabeth
            </p>
            <p className="truncate text-[11px] text-emerald-400">● Active</p>
          </div>
        </div>

        {/* Switch theme */}
        <div
          className={cn(
            "mt-2 flex items-center gap-2 rounded-lg bg-white/5 p-1 text-xs",
            collapsed && "flex-col",
          )}
        >
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#D9A956] px-2 py-1.5 font-semibold text-[#1A1206]">
            <Sun size={14} /> {!collapsed && "Light"}
          </button>
          <button className="flex flex-1 items-center justify-center gap-1.5 px-2 py-1.5 text-slate-300 hover:text-white">
            <Moon size={14} /> {!collapsed && "Dark"}
          </button>
        </div>
      </div>
    </aside>
  );
}
