"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { LearnSidebar } from "./learn-sidebar";

export function LearnTopNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /* ✅ TỰ ĐỘNG ĐÓNG DRAWER KHI CHUYỂN TRANG */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ✅ THANH TOPBAR CHỈ HIỆN TRÊN MOBILE (< md) */}
      <header className="md:hidden flex h-14 items-center justify-between px-4 bg-[#121212] text-white shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-wide">StackEdu</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Mở menu"
          className="grid h-9 w-9 place-items-center rounded-md hover:bg-white/10"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* ✅ DRAWER MOBILE - TRƯỢT TỪ TRÁI */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop tối */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/50"
            />

            {/* Sidebar trong drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="md:hidden fixed left-0 top-0 z-50 h-full"
            >
              <div className="relative h-full">
                {/* 🔑 DÒNG NÀY GIẢI QUYẾT: ép LUÔN BUNG RỘNG → hiện icon + label */}
                <LearnSidebar forceCollapsed={false} hideToggle />

                {/* Nút đóng góc trên phải */}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Đóng menu"
                  className="absolute right-2 top-4 grid h-8 w-8 place-items-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
