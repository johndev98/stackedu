"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, type Transition } from "framer-motion";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { LEARN_SIDEBAR_LABELS } from "@/constants/learn-copy";
import { LEARN_MENU } from "@/constants/learn-navigation";
import { cn } from "@/lib/utils";

const SIDEBAR_WIDE = "w-60";
const SIDEBAR_NARROW = "w-[72px]";

const MOTION = {
  layout: {
    type: "spring",
    bounce: 0.2,
    duration: 0.4,
  } as const satisfies Transition,
  opacity: {
    type: "tween",
    duration: 0.15,
    ease: "easeOut",
  } as const satisfies Transition,
} as const;

export function LearnSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative z-20 flex h-full shrink-0 flex-col justify-between bg-[#121212] text-slate-200 transition-[width] duration-300 ease-in-out rounded-bl-2xl rounded-tl-2xl",
        collapsed ? SIDEBAR_NARROW : SIDEBAR_WIDE,
      )}
    >
      <div>
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            <motion.span
              animate={{
                opacity: collapsed ? 0 : 1,
                width: collapsed ? 0 : "auto",
              }}
              transition={MOTION.opacity}
              className="whitespace-nowrap text-sm font-semibold text-white overflow-hidden"
            >
              StackEdu
            </motion.span>
          </Link>

          <button
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
            className="grid h-8 w-8 place-items-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              key={String(collapsed)}
            >
              {collapsed ? (
                <ChevronRight size={25} />
              ) : (
                <ChevronLeft size={25} />
              )}
            </motion.div>
          </button>
        </div>

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
                title={collapsed ? LEARN_SIDEBAR_LABELS[item.key] : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="learn-active"
                    className="absolute inset-0 rounded-lg bg-[#D9A956] shadow-[0_4px_14px_-4px_rgba(217,169,86,0.6)]"
                    transition={MOTION.layout}
                  />
                )}
                <span className="relative z-10 shrink-0">
                  <Icon size={19} strokeWidth={2.1} />
                </span>
                <motion.span
                  animate={{
                    opacity: collapsed ? 0 : 1,
                    width: collapsed ? 0 : "auto",
                  }}
                  transition={MOTION.opacity}
                  className="relative z-10 whitespace-nowrap overflow-hidden"
                >
                  {LEARN_SIDEBAR_LABELS[item.key]}
                </motion.span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#D9A956] text-sm font-bold text-[#1A1206]">
            <User size={16} />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Elizabeth
              </p>
              <p className="truncate text-[11px] text-emerald-400">● Active</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
