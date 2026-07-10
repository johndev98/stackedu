"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "@/constants/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { Link as I18nLink, usePathname } from "@/i18n/navigation";
import { RainbowButton } from "../ui/rainbow-button";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

export function HeaderNavbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="relative flex h-16 items-center justify-between border-b-2">
      {/* Logo */}
      <I18nLink href="/" className="text-2xl font-bold text-primary">
        StackEdu
      </I18nLink>

      {/* Navigation center */}
      <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <I18nLink
              key={item.key}
              href={item.href}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="navbar-active"
                  className="absolute inset-0 rounded-full bg-primary/10"
                  transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon size={18} />
                <span>{t(item.key)}</span>
              </span>
            </I18nLink>
          );
        })}
      </nav>

      {/* Right */}
      <div className="flex gap-5">
        <AnimatedThemeToggler />
        <LanguageSwitcher />
        <Link href="/learn">
          <RainbowButton variant="outline">{t("startLearning")}</RainbowButton>
        </Link>
      </div>
    </header>
  );
}
