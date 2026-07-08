"use client";

import { LOCALES } from "@/constants/locales";

import { Icon } from "@iconify/react";
import { useLocale } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = LOCALES.find((item) => item.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 outline-none focus:outline-none">
          <Icon
            icon={currentLocale?.icon ?? "circle-flags:us"}
            className="h-5 w-5"
          />

          {locale.toUpperCase()}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {LOCALES.map((item) => (
          <DropdownMenuItem
            key={item.code}
            onClick={() =>
              router.replace(pathname, {
                locale: item.code,
              })
            }
          >
            <Icon icon={item.icon} className="mr-2 h-5 w-5" />

            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
